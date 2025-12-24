/**
 * =====================================================================
 * ComplianceCard - Card de Documento Legal
 * =====================================================================
 * Visual sóbrio e confiável para documentação de compliance
 */

import { ExternalLink, FileText } from 'lucide-react';
import type { ComplianceDoc } from '../../types/compliance';
import { getScopeColor, getScopeLabel, getIssuingBodyColor } from '../../types/compliance';

// =====================================================================
// PROPS
// =====================================================================

interface ComplianceCardProps {
  doc: ComplianceDoc;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function ComplianceCard({ doc }: ComplianceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header com Badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Badge de Abrangência */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getScopeColor(doc.scope)} mb-2`}>
            {getScopeLabel(doc.scope)}
          </span>
          
          {/* Badge de Obrigatoriedade */}
          {doc.is_mandatory && (
            <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Obrigatório
            </span>
          )}
        </div>
        
        <FileText className="w-6 h-6 text-gray-400" />
      </div>

      {/* Título */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {doc.title}
      </h3>

      {/* Órgão Emissor */}
      <div className="mb-4">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getIssuingBodyColor(doc.issuing_body)}`}>
          {doc.issuing_body}
        </span>
      </div>

      {/* Descrição */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {doc.description}
      </p>

      {/* Tags */}
      {doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {doc.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {doc.tags.length > 4 && (
            <span className="px-2 py-1 text-gray-400 text-xs">
              +{doc.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Rodapé com Botão */}
      <div className="pt-4 border-t border-gray-100">
        {doc.official_url ? (
          <a
            href={doc.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Acessar Site Oficial
          </a>
        ) : (
          <span className="text-sm text-gray-400 italic">
            Link não disponível
          </span>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// SKELETON
// =====================================================================

export function ComplianceCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24" />
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </div>

      {/* Título */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />

      {/* Órgão */}
      <div className="h-5 bg-gray-200 rounded w-32 mb-4" />

      {/* Descrição */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>

      {/* Botão */}
      <div className="pt-4 border-t border-gray-100">
        <div className="h-10 bg-gray-200 rounded w-48" />
      </div>
    </div>
  );
}
