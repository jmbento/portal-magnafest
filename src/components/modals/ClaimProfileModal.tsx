/**
 * =====================================================================
 * CLAIM PROFILE MODAL
 * =====================================================================
 * Modal para cadastro de novos profissionais ou reivindicação de perfis existentes
 */

import { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Tag,
  Sparkles,
  Loader2,
} from 'lucide-react';

// =====================================================================
// TYPES
// =====================================================================

interface ExistingProfile {
  id: string;
  name: string;
  category?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

interface ClaimProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProfile?: ExistingProfile;
  categories: ServiceCategory[];
}

interface SubmitData {
  name: string;
  contact: string;
  categoryId: string | null;
  suggestedCategory?: string;
  isClaiming: boolean;
  profileId?: string;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function ClaimProfileModal({
  isOpen,
  onClose,
  existingProfile,
  categories,
}: ClaimProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    categoryId: '',
    suggestedCategory: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestedField, setShowSuggestedField] = useState(false);

  const isClaiming = !!existingProfile;

  // Pre-fill if claiming existing profile
  useEffect(() => {
    if (existingProfile) {
      setFormData((prev) => ({
        ...prev,
        name: existingProfile.name,
      }));
    } else {
      // Reset form when opening for new registration
      setFormData({
        name: '',
        whatsapp: '',
        categoryId: '',
        suggestedCategory: '',
      });
    }
    setShowSuggestedField(false);
  }, [existingProfile, isOpen]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
    setShowSuggestedField(value === 'other');
  };

  // Format WhatsApp input
  const handleWhatsAppChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply mask: (XX) XXXXX-XXXX
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

    setFormData((prev) => ({ ...prev, whatsapp: formatted }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData: SubmitData = {
      name: formData.name,
      contact: formData.whatsapp,
      categoryId: formData.categoryId === 'other' ? null : formData.categoryId,
      isClaiming,
    };

    if (showSuggestedField) {
      submitData.suggestedCategory = formData.suggestedCategory;
    }

    if (isClaiming && existingProfile) {
      submitData.profileId = existingProfile.id;
    }

    // Mock submission
    console.log('📤 Dados enviados:', submitData);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(
        isClaiming
          ? '✅ Perfil reivindicado com sucesso!'
          : '✅ Cadastro realizado com sucesso!'
      );
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {isClaiming ? (
                  <>
                    <Sparkles className="w-6 h-6 inline-block mr-2 text-blue-600" />
                    Este perfil é seu?
                  </>
                ) : (
                  <>
                    <User className="w-6 h-6 inline-block mr-2 text-blue-600" />
                    Cadastre-se na Plataforma
                  </>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isClaiming
                  ? 'Complete o cadastro para assumir a titularidade'
                  : 'Apareça para milhares de contratantes gratuitamente'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Benefits Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  100% Gratuito
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  Visibilidade Instantânea
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  Sem Comissões
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                <User className="w-4 h-4 inline-block mr-1" />
                Nome Profissional ou Empresa *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={isClaiming}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 ${
                  isClaiming ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                placeholder="Ex: João Silva - Técnico de Som"
              />
              {isClaiming && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Nome pré-preenchido do perfil existente
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                <Phone className="w-4 h-4 inline-block mr-1" />
                WhatsApp para Contato *
              </label>
              <input
                type="tel"
                id="whatsapp"
                required
                value={formData.whatsapp}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              <p className="text-xs text-gray-500 mt-1">
                Número com DDD. Este será seu principal canal de orçamentos.
              </p>
            </div>

            {/* Categoria */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                <Tag className="w-4 h-4 inline-block mr-1" />
                Categoria Principal *
              </label>
              <select
                id="category"
                required
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 bg-white"
              >
                <option value="">Selecione sua especialidade</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="other" className="font-bold text-blue-600">
                  ✨ Outros / Sugerir Nova Categoria
                </option>
              </select>
            </div>

            {/* Suggested Category (Conditional) */}
            {showSuggestedField && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <label
                      htmlFor="suggested"
                      className="block text-sm font-bold text-gray-900 mb-2"
                    >
                      Qual a sua especialidade?
                    </label>
                    <input
                      type="text"
                      id="suggested"
                      required={showSuggestedField}
                      value={formData.suggestedCategory}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          suggestedCategory: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900"
                      placeholder="Ex: Bartender Profissional"
                    />
                    <p className="text-xs text-blue-700 mt-2 flex items-start gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Se aprovada, criaremos essa categoria e buscaremos
                        parceiros para você. Nossa equipe analisará em até 24h.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isClaiming ? 'Reivindicar Perfil' : 'Confirmar Cadastro'}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                Ao cadastrar, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
