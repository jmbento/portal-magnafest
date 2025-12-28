/**
 * Seed Professionals - Super Perfis (50)
 *
 * Gera 50 perfis fictícios de alta qualidade seguindo a taxonomia solicitada
 * Uso:
 * 1. crie um arquivo .env com:
 *    SUPABASE_URL=... 
 *    SUPABASE_SERVICE_ROLE_KEY=...
 *    FORCE_CLEAN=false (opcional; true para truncar tabela inteira)
 * 2. npx ts-node src/scripts/seed-professionals.ts
 */

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const FORCE_CLEAN = (process.env.FORCE_CLEAN || 'false').toLowerCase() === 'true';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Taxonomia exata solicitada
const TAXONOMY = [
  // Casting & Recepção
  'Recepcionista Bilíngue (Inglês/Espanhol)',
  'Modelo Promocional',
  'Promotor de Vendas',
  'Hostess para Camarote',

  // Técnica & Backstage (A Elite MagnaFest)
  'Técnico de PA (Line Array System)',
  'Operador de Luz (GrandMA/Avolites)',
  'Rigger (Trabalho em Altura)',
  'Roadie de Bateria/Guitarra',
  'Stage Manager',

  // Operacional & Logística
  'Produtor de Campo',
  'Carregador (Loader)',
  'Segurança VIP / Controlador de Acesso',
  'Motorista Executivo (Van/Sedan)'
];

const SKILL_BADGES = ['DRT', 'NR-35', 'Inglês Fluente', 'CNH B', 'CNH D', 'Certificado NR10'];

const AVATAR_SETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1545996124-1b8a6a2ad3d8',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c'
];

const FIRST_NAMES = ['Juliana','Carlos','Mariana','Felipe','André','Lucas','Gabriel','Rafael','Fernanda','Diego','Thiago','Beatriz','Camila','Ana','Paulo','Renata','Luiz','Marcelo','Patrícia','Roberto'];
const LAST_NAMES = ['Mendes','Silva','Santos','Oliveira','Souza','Costa','Pereira','Alves','Ferreira','Rodrigues','Martins','Araújo','Melo','Barbosa','Ribeiro','Carvalho'];

function randomInt(min:number, max:number){ return Math.floor(Math.random()*(max-min+1))+min; }
function pick<T>(arr:T[]) { return arr[Math.floor(Math.random()*arr.length)]; }
function slugify(s:string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

function makeName(){
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  // 20% chance to add nickname
  if (Math.random() < 0.2) return `${first} "${pick(['Magrão','Neto','Zé','Bento','Lima'])}" ${last}`;
  return `${first} ${last}`;
}

function makeBio(niche:string){
  const years = randomInt(3,15);
  const examples = [
    `${years} anos de experiência em eventos (festivais e shows). Especialista em ${niche}. Disponibilidade nacional.`,
    `Atuação em grandes produções e turnês. ${niche}. DRT/Certificados atualizados.`,
    `Trabalhos em Lollapalooza, Rock in Rio e eventos corporativos. ${niche}. Flexibilidade para viagens.`
  ];
  return pick(examples);
}

function makePhone(state:string){
  const ddds:Record<string,string> = {SP:'11',RJ:'21',MG:'31',BA:'71',PR:'41',RS:'51',SC:'48',DF:'61',CE:'85',PE:'81',GO:'62',ES:'27'};
  const ddd = ddds[state] || '11';
  return `${ddd}9${String(randomInt(10000000,99999999))}`;
}

function makeEmail(name:string){
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g,'');
  return `${clean}${randomInt(1,99)}@${pick(['gmail.com','hotmail.com','outlook.com','mail.com'])}`;
}

async function seedDatabase(){
  console.log('🚀 Seed: iniciando geração de 50 super-perfis (profissionais)');

  // 1) Limpar tabela de seeds anteriores (somente registros marcados como seed-script ou admin-seeder)
  if (FORCE_CLEAN) {
    console.log('⚠️ FORCE_CLEAN=true → truncando tabela `professionals` (CUIDADO)');
    const { error: truncErr } = await supabase.rpc('exec_sql', { sql: `TRUNCATE TABLE public.professionals RESTART IDENTITY CASCADE;` }).catch(()=>({ error: null }));
    if (truncErr) console.warn('Não foi possível truncar com RPC (pode ser permission). Seguindo com remoção por source.');
  }

  const { error: delErr } = await supabase
    .from('professionals')
    .delete()
    .in('source', ['seed-script','admin-seeder'])
    .match({});

  if (delErr) {
    console.warn('⚠️ Aviso: não foi possível remover apenas registros seed; tentando remoção ampla...');
    // tentativa ampla: remover onde source IS NULL ou seed-script
    await supabase.from('professionals').delete().or(`source.is.null,source.eq.seed-script`).catch(()=>null);
  }

  // 2) Gerar 50 perfis
  const profiles:any[] = [];
  const states = ['SP','RJ','MG','BA','PR','RS','SC','DF','PE','CE'];

  for (let i=0;i<50;i++){
    const niche = pick(TAXONOMY);
    const name = makeName();
    const city = pick(['São Paulo','Rio de Janeiro','Belo Horizonte','Salvador','Curitiba','Porto Alegre','Florianópolis','Brasília','Recife','Fortaleza']);
    const state = pick(states);
    const avatar = `${pick(AVATAR_SETS)}?fit=crop&w=400&h=400&q=80&u=${encodeURIComponent(name)}`;
    const tags = new Set<string>();
    tags.add(pick(SKILL_BADGES));
    if (niche.includes('Rigger') || niche.includes('Rigger')) tags.add('NR-35');
    if (niche.includes('Técnico') || niche.includes('Operador') || niche.includes('Roadie')) tags.add('DRT');
    if (Math.random() > 0.6) tags.add('Inglês Fluente');
    if (Math.random() > 0.8) tags.add('CNH B');

    const bio = makeBio(niche);
    const email = makeEmail(name);
    const phone = makePhone(state);
    const slug = slugify(`${name} ${niche}`) + '-' + uuidv4().slice(0,6);

    profiles.push({
      user_id: null,
      name,
      slug,
      niche,
      bio,
      tags: Array.from(tags),
      contact_info: { email, phone },
      location: { city, state },
      avatar_url: avatar,
      average_rating: Number((Math.random()*2 + 3).toFixed(1)),
      is_verified: Math.random() > 0.7,
      source: 'seed-script',
      created_at: new Date().toISOString()
    });
  }

  // 3) Inserir em batch (50)
  console.log(`📥 Inserindo ${profiles.length} perfis em professionals...`);
  const { data, error } = await supabase
    .from('professionals')
    .insert(profiles)
    .select('id, name, slug');

  if (error) {
    console.error('❌ Erro ao inserir profiles:', error);
    process.exit(1);
  }

  console.log('✅ Perfis inseridos:', data?.length || 0);
  console.log('🎉 Seed finalizado.');
}

// Execute
seedDatabase().then(()=>process.exit(0)).catch(err=>{ console.error(err); process.exit(1); });
