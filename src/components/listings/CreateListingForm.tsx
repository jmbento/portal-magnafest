/**
 * =====================================================================
 * MAGNAFEST - Formulário de Criação de Anúncio
 * =====================================================================
 * Componente completo com upload de múltiplas imagens e validação
 */

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UploadCloud,
  X,
  Loader2,
  ImagePlus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  supabase,
  getCurrentUser,
  uploadFile,
  getPublicUrl,
  createListing,
  addListingMedia,
  getRootCategories,
} from '../../lib/supabase';

// =====================================================================
// SCHEMA DE VALIDAÇÃO COM ZOD
// =====================================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const listingSchema = z.object({
  title: z
    .string()
    .min(5, 'O título deve ter no mínimo 5 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  
  description: z
    .string()
    .min(20, 'A descrição deve ter no mínimo 20 caracteres')
    .max(2000, 'A descrição deve ter no máximo 2000 caracteres'),
  
  listing_type: z.enum(['venue', 'service', 'product_rent', 'product_sale'], {
    errorMap: () => ({ message: 'Selecione um tipo de anúncio' }),
  }),
  
  category_id: z
    .string()
    .min(1, 'Selecione uma categoria'),
  
  price_min: z
    .number()
    .min(1, 'O preço deve ser maior que zero')
    .transform((val) => val * 100), // Converter para centavos
  
  price_unit: z
    .string()
    .min(1, 'Selecione uma unidade de preço'),
  
  images: z
    .array(
      z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, 'Cada imagem deve ter no máximo 5MB')
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Apenas arquivos JPG, PNG e WEBP são aceitos'
        )
    )
    .min(1, 'Adicione pelo menos 1 imagem')
    .max(10, 'Máximo de 10 imagens'),
});

type ListingFormData = z.infer<typeof listingSchema>;

// =====================================================================
// TIPOS
// =====================================================================

interface ImagePreview {
  file: File;
  preview: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================

export default function CreateListingForm() {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      images: [],
    },
  });

  // Carregar categorias ao montar o componente
  useState(() => {
    loadCategories();
  });

  const loadCategories = async () => {
    try {
      const data = await getRootCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // ================================================================
  // GERENCIAMENTO DE IMAGENS
  // ================================================================

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validar tamanho e tipo
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} é maior que 5MB`);
        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`${file.name} não é um formato válido (use JPG, PNG ou WEBP)`);
        return false;
      }
      return true;
    });

    // Limitar a 10 imagens
    const currentImages = watch('images') || [];
    const totalImages = currentImages.length + validFiles.length;
    
    if (totalImages > 10) {
      alert('Você pode adicionar no máximo 10 imagens');
      return;
    }

    // Criar previews
    const newPreviews: ImagePreview[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setValue('images', [...currentImages, ...validFiles], { shouldValidate: true });
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = watch('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    
    // Revogar URL do preview para liberar memória
    URL.revokeObjectURL(imagePreviews[index].preview);
    
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setValue('images', newImages, { shouldValidate: true });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      // Simular mudança no input
      const dataTransfer = new DataTransfer();
      imageFiles.forEach((file) => dataTransfer.items.add(file));
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleImageSelect({ target: fileInputRef.current } as any);
      }
    }
  };

  // ================================================================
  // SUBMIT DO FORMULÁRIO
  // ================================================================

  const onSubmit: SubmitHandler<ListingFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // 1. Verificar autenticação
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Você precisa estar autenticado para criar um anúncio');
      }

      // 2. Upload das imagens
      const imageUrls: string[] = [];
      
      for (let i = 0; i < data.images.length; i++) {
        const file = data.images[i];
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `${user.id}/${fileName}`;

        try {
          // Upload para o bucket 'listing-images'
          await uploadFile('listing-images', filePath, file);
          
          // Obter URL pública
          const publicUrl = getPublicUrl('listing-images', filePath);
          imageUrls.push(publicUrl);
        } catch (uploadError) {
          console.error(`Erro ao fazer upload de ${file.name}:`, uploadError);
          throw new Error(`Falha no upload: ${file.name}`);
        }
      }

      // 3. Criar o anúncio
      const newListing = await createListing({
        title: data.title,
        description: data.description,
        listing_type: data.listing_type,
        category_id: data.category_id,
        price_min: data.price_min, // Já em centavos
        price_max: data.price_min, // Pode ser estendido para range
        price_unit: data.price_unit,
        metadata: {},
        location_data: {},
      });

      // 4. Adicionar as mídias ao anúncio
      for (let i = 0; i < imageUrls.length; i++) {
        await addListingMedia(newListing.id, imageUrls[i], 'image', i);
      }

      // 5. Sucesso!
      setSubmitStatus('success');
      
      // Limpar formulário após 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao criar anúncio:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Erro ao criar anúncio. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Novo Anúncio
          </h1>
          <p className="text-gray-600">
            Preencha os dados do seu produto ou serviço para começar a vender
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-semibold">Anúncio criado com sucesso!</p>
              <p className="text-green-700 text-sm">Redirecionando para o dashboard...</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-semibold">Erro ao criar anúncio</p>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="label-field">
              Título do Anúncio *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`input-field ${errors.title ? 'input-error' : ''}`}
              placeholder="Ex: Equipamento de Som Profissional para Eventos"
            />
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}
          </div>

          {/* Tipo de Anúncio e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="listing_type" className="label-field">
                Tipo de Anúncio *
              </label>
              <select
                id="listing_type"
                {...register('listing_type')}
                className={`input-field ${errors.listing_type ? 'input-error' : ''}`}
              >
                <option value="">Selecione...</option>
                <option value="venue">Local para Eventos</option>
                <option value="service">Serviço</option>
                <option value="product_rent">Produto para Aluguel</option>
                <option value="product_sale">Produto para Venda</option>
              </select>
              {errors.listing_type && (
                <p className="error-message">{errors.listing_type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category_id" className="label-field">
                Categoria *
              </label>
              <select
                id="category_id"
                {...register('category_id')}
                className={`input-field ${errors.category_id ? 'input-error' : ''}`}
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="error-message">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="label-field">
              Descrição Completa *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={6}
              className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
              placeholder="Descreva detalhadamente seu produto ou serviço, incluindo especificações técnicas, capacidade, diferenciais, etc."
            />
            {errors.description && (
              <p className="error-message">{errors.description.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Mínimo 20 caracteres • Máximo 2000 caracteres
            </p>
          </div>

          {/* Preço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price_min" className="label-field">
                Preço (R$) *
              </label>
              <input
                id="price_min"
                type="number"
                step="0.01"
                {...register('price_min', { valueAsNumber: true })}
                className={`input-field ${errors.price_min ? 'input-error' : ''}`}
                placeholder="0.00"
              />
              {errors.price_min && (
                <p className="error-message">{errors.price_min.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="price_unit" className="label-field">
                Unidade de Preço *
              </label>
              <select
                id="price_unit"
                {...register('price_unit')}
                className={`input-field ${errors.price_unit ? 'input-error' : ''}`}
              >
                <option value="">Selecione...</option>
                <option value="hora">Por Hora</option>
                <option value="dia">Por Dia</option>
                <option value="evento">Por Evento</option>
                <option value="unidade">Por Unidade</option>
                <option value="pessoa">Por Pessoa</option>
              </select>
              {errors.price_unit && (
                <p className="error-message">{errors.price_unit.message}</p>
              )}
            </div>
          </div>

          {/* Upload de Imagens */}
          <div>
            <label className="label-field">Imagens *</label>
            
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400 bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="p-4 bg-primary-100 rounded-full">
                  <UploadCloud className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Clique para selecionar ou arraste as imagens
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG ou WEBP • Máximo 5MB por imagem • Até 10 imagens
                  </p>
                </div>
              </label>
            </div>

            {errors.images && (
              <p className="error-message">{errors.images.message}</p>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando Anúncio...
                </>
              ) : (
                <>
                  <ImagePlus className="w-5 h-5" />
                  Publicar Anúncio
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
              className="btn-secondary px-6 py-3"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
