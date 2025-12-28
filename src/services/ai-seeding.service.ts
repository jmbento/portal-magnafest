/**
 * =====================================================================
 * AI SEEDING SERVICE - Orquestrador de Web Scraping
 * =====================================================================
 * Coordena todos os scrapers e insere dados no Supabase
 */

import { supabase } from '../lib/supabase';
import { symplaScraper } from './scrapers/sympla.scraper';
import { instagramScraper } from './scrapers/instagram.scraper';
import { eventbriteScraper } from './scrapers/eventbrite.scraper';

export interface SeedResult {
  source: 'sympla' | 'eventbrite' | 'instagram';
  type: 'event' | 'professional';
  count: number;
  success: boolean;
  error?: string;
}

export class AISeedingService {
  /**
   * Executa varredura completa de dados reais
   */
  async runFullScraping(city?: string, state?: string): Promise<SeedResult[]> {
    const results: SeedResult[] = [];

    // Usa geolocalização ou padrão
    const targetCity = city || 'São Paulo';
    const targetState = state || 'SP';

    console.log(`🤖 Iniciando varredura IA para ${targetCity} - ${targetState}`);

    // 1. Sympla - Eventos
    try {
      const symplaEvents = await symplaScraper.searchUpcomingEvents(targetCity, targetState);
      const insertedCount = await this.insertEvents(symplaEvents);
      
      results.push({
        source: 'sympla',
        type: 'event',
        count: insertedCount,
        success: true
      });
    } catch (error: any) {
      results.push({
        source: 'sympla',
        type: 'event',
        count: 0,
        success: false,
        error: error.message
      });
    }

    // 2. Eventbrite - Eventos
    try {
      const eventbriteEvents = await eventbriteScraper.searchEventsByCity(targetCity, targetState, 8);
      const insertedCount = await this.insertEvents(eventbriteEvents);
      
      results.push({
        source: 'eventbrite',
        type: 'event',
        count: insertedCount,
        success: true
      });
    } catch (error: any) {
      results.push({
        source: 'eventbrite',
        type: 'event',
        count: 0,
        success: false,
        error: error.message
      });
    }

    // 3. Instagram - Profissionais
    try {
      const instagramProfiles = await instagramScraper.searchProfessionals(targetCity, targetState, 23);
      const insertedCount = await this.insertProfessionals(instagramProfiles);
      
      results.push({
        source: 'instagram',
        type: 'professional',
        count: insertedCount,
        success: true
      });
    } catch (error: any) {
      results.push({
        source: 'instagram',
        type: 'professional',
        count: 0,
        success: false,
        error: error.message
      });
    }

    return results;
  }

  /**
   * Insere eventos no Supabase
   */
  private async insertEvents(events: any[]): Promise<number> {
    if (events.length === 0) return 0;

    try {
      // Verificar duplicatas por slug
      const slugs = events.map(e => e.slug);
      const { data: existing } = await supabase
        .from('events')
        .select('slug')
        .in('slug', slugs);

      const existingSlugs = new Set(existing?.map(e => e.slug) || []);
      const newEvents = events.filter(e => !existingSlugs.has(e.slug));

      if (newEvents.length === 0) {
        console.log('⚠️ Todos os eventos já existem no banco');
        return 0;
      }

      // Inserir novos eventos
      const { data, error } = await supabase
        .from('events')
        .insert(newEvents)
        .select();

      if (error) throw error;

      console.log(`✅ ${data?.length || 0} novos eventos inseridos`);
      return data?.length || 0;

    } catch (error) {
      console.error('Erro ao inserir eventos:', error);
      throw error;
    }
  }

  /**
   * Insere profissionais no Supabase
   */
  private async insertProfessionals(profiles: any[]): Promise<number> {
    if (profiles.length === 0) return 0;

    try {
      // Buscar categorias para vincular
      const { data: categories } = await supabase
        .from('service_categories')
        .select('id')
        .limit(10);

      if (!categories || categories.length === 0) {
        throw new Error('Nenhuma categoria encontrada. Execute migrations primeiro.');
      }

      // Adicionar category_id aleatória
      const profilesWithCategory = profiles.map(prof => ({
        ...prof,
        main_category_id: categories[Math.floor(Math.random() * categories.length)].id,
        is_claimed: false
      }));

      // Verificar duplicatas por email
      const emails = profilesWithCategory.map(p => p.email).filter(Boolean);
      const { data: existing } = await supabase
        .from('profiles')
        .select('email')
        .in('email', emails);

      const existingEmails = new Set(existing?.map(p => p.email) || []);
      const newProfiles = profilesWithCategory.filter(p => !existingEmails.has(p.email));

      if (newProfiles.length === 0) {
        console.log('⚠️ Todos os profissionais já existem no banco');
        return 0;
      }

      // Inserir
      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfiles)
        .select();

      if (error) throw error;

      console.log(`✅ ${data?.length || 0} novos profissionais inseridos`);
      return data?.length || 0;

    } catch (error) {
      console.error('Erro ao inserir profissionais:', error);
      throw error;
    }
  }

  /**
   * Verifica se deve executar auto-limpeza
   */
  async checkAndCleanFakeData(): Promise<{ cleaned: boolean; profilesRemoved: number; eventsRemoved: number }> {
    try {
      // Contar dados reais
      const { count: realProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'ai-scraper');

      const { count: realEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'ai-scraper');

      let profilesRemoved = 0;
      let eventsRemoved = 0;

      // Limpar se atingiu meta
      if (realProfiles && realProfiles >= 200) {
        const { count } = await supabase
          .from('profiles')
          .delete()
          .eq('source', 'admin-seeder')
          .select('*', { count: 'exact', head: true });
        
        profilesRemoved = count || 0;
      }

      if (realEvents && realEvents >= 200) {
        const { count } = await supabase
          .from('events')
          .delete()
          .eq('source', 'admin-seeder')
          .select('*', { count: 'exact', head: true });
        
        eventsRemoved = count || 0;
      }

      return {
        cleaned: profilesRemoved > 0 || eventsRemoved > 0,
        profilesRemoved,
        eventsRemoved
      };

    } catch (error) {
      console.error('Erro ao verificar auto-limpeza:', error);
      return { cleaned: false, profilesRemoved: 0, eventsRemoved: 0 };
    }
  }
}

export const aiSeedingService = new AISeedingService();
