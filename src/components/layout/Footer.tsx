/**
 * =====================================================================
 * Footer - Rodapé com Configuração Dinâmica
 * =====================================================================
 * Usa siteConfig para manter informações centralizadas
 */

import { Link } from 'react-router-dom';
import { 
  Mail, 
  LifeBuoy, 
  Briefcase, 
  Newspaper,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MapPin
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-magna-dark border-t border-white/10 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Coluna 1: Brand */}
          <div>
            <h3 className="text-2xl font-black uppercase mb-4 bg-gradient-to-r from-magna-violet via-magna-magenta to-magna-violet bg-clip-text text-transparent">
              Portal MagnaFest
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {siteConfig.description}
            </p>
            
            {/* Redes Sociais */}
            <div className="flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-magna-magenta rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/explorar" className="text-gray-400 hover:text-magna-cyan transition-colors text-sm">
                  Explorar Profissionais
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-gray-400 hover:text-magna-cyan transition-colors text-sm">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-magna-cyan transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-gray-400 hover:text-magna-cyan transition-colors text-sm">
                  Guia Legal
                </Link>
              </li>
              <li>
                <Link to={siteConfig.links.about} className="text-gray-400 hover:text-magna-cyan transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to={siteConfig.links.careers} className="text-gray-400 hover:text-magna-cyan transition-colors text-sm">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato (Estratégia Tática) */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.emails.contato}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-magna-cyan transition-colors text-sm group"
                >
                  <Mail className="w-4 h-4 group-hover:text-magna-cyan" />
                  <div>
                    <p className="font-medium text-white">Contato Geral</p>
                    <p className="text-xs">{siteConfig.emails.contato}</p>
                  </div>
                </a>
              </li>
              
              <li>
                <a
                  href={`mailto:${siteConfig.emails.suporte}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors text-sm group"
                >
                  <LifeBuoy className="w-4 h-4 group-hover:text-green-500" />
                  <div>
                    <p className="font-medium text-white">Suporte</p>
                    <p className="text-xs">{siteConfig.emails.suporte}</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteConfig.emails.comercial}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors text-sm group"
                >
                  <Briefcase className="w-4 h-4 group-hover:text-yellow-500" />
                  <div>
                    <p className="font-medium text-white">Comercial</p>
                    <p className="text-xs">{siteConfig.emails.comercial}</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteConfig.emails.press}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition-colors text-sm group"
                >
                  <Newspaper className="w-4 h-4 group-hover:text-purple-500" />
                  <div>
                    <p className="font-medium text-white">Imprensa</p>
                    <p className="text-xs">{siteConfig.emails.press}</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Endereço & Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Informações</h4>
            
            {/* Endereço */}
            <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
              <div>
                <p>{siteConfig.address.street}</p>
                <p>{siteConfig.address.complement}</p>
                <p>{siteConfig.address.city}, {siteConfig.address.state}</p>
                <p>{siteConfig.address.cep}</p>
              </div>
            </div>

            {/* Links Legais */}
            <ul className="space-y-2">
              <li>
                <Link 
                  to={siteConfig.links.privacyPolicy} 
                  className="text-gray-400 hover:text-magna-cyan transition-colors text-sm"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to={siteConfig.links.termsOfService} 
                  className="text-gray-400 hover:text-magna-cyan transition-colors text-sm"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link 
                  to={siteConfig.links.mediaKit} 
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-semibold"
                >
                  📢 Anuncie Conosco
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-magna-black py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} {siteConfig.name}. Todos os direitos reservados.
            </p>
            <p className="text-xs">
              CNPJ: {siteConfig.cnpj} | {siteConfig.razaoSocial}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
