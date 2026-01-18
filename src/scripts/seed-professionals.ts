/**
 * Seed Professionals - 30 realistic mock profiles
 *
 * Usage:
 * 1. Create a .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. npx ts-node src/scripts/seed-professionals.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// Percentual de perfis registrados (0..1). Pode ser sobrescrito via env: SEED_PERCENT_REGISTERED
const PERCENT_REGISTERED = process.env.SEED_PERCENT_REGISTERED ? Number(process.env.SEED_PERCENT_REGISTERED) : 0.7;
console.log(`Seed: PERCENT_REGISTERED = ${PERCENT_REGISTERED}`);

// Taxonomia e skills solicitados
const CATEGORIES = {
  'Casting & Recepção': {
    roles: ['Recepcionista Bilíngue', 'Modelo Promocional', 'Hostess', 'Promotor de Vendas'],
    skills: ['Inglês Fluente', 'Simpatia', 'Experiência em Feiras', 'Recepção VIP']
  },
  'Técnica de Palco': {
    roles: ['Técnico de PA (Sistema)', 'Operador de Luz (GrandMA)', 'Rigger (NR-35)', 'Roadie de Bateria'],
    skills: ['Dante Level 3', 'NR-10', 'NR-35', 'Console Yamaha', 'Avolites']
  },
  'Logística & Produção': {
    roles: ['Produtor de Campo', 'Runner', 'Carregador (Loader)', 'Motorista Executivo'],
    skills: ['CNH B', 'Organização de Backstage', 'Gestão de Logística', 'Coordenação de Equipe']
  }
};

const FIRST = ['Juliana','Carlos','Mariana','Felipe','André','Lucas','Gabriel','Rafael','Fernanda','Diego','Thiago','Beatriz','Camila','Ana','Paulo','Renata','Luiz','Marcelo','Patrícia','Roberto','Sérgio','Marcos','Érica','Natália','Bruno'];
const LAST = ['Mendes','Silva','Santos','Oliveira','Souza','Costa','Pereira','Alves','Ferreira','Rodrigues','Martins','Araújo','Melo','Barbosa','Ribeiro','Carvalho'];

function pick<T>(arr:T[]) { return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min; }
function slugify(s:string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

function makeName(){
  const first = pick(FIRST);
  const last = pick(LAST);
  if (Math.random() < 0.15) return `${first} "${pick(['Magrão','Neto','Zé','Bento','Lima'])}" ${last}`;
  return `${first} ${last}`;
}

function makeBio(role:string){
  const years = randInt(2,18);
  return `${years} anos de experiência como ${role}. Atuou em festivais, shows e eventos corporativos. Disponibilidade para viagens.`;
}

function makeAvatar(name:string){
  // Unsplash random by keywords
  const q = encodeURIComponent('portrait,worker,concert');
  return `https://source.unsplash.com/random/200x200/?${q}&sig=${encodeURIComponent(name)}`;
}

async function tableExists(table:string){
  try{
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && /does not exist/.test(error.message)) return false;
    return true;
  }catch(e){
    return false;
  }
}

async function seed(){
  console.log('🚀 Seed: iniciando geração de 30 perfis mock (StaffPro-style)');

  const exists = await tableExists('professionals');
  if (!exists) {
    console.error('❌ Tabela `professionals` não encontrada. Execute migrations primeiro.');
    process.exit(1);
  }

  // Remove apenas seeds anteriores geradas por este script
  await supabase.from('professionals').delete().in('source', ['seed-script','admin-seeder']).catch(()=>null);

  const profiles:any[] = [];
  const states = ['SP','RJ','MG','BA','PR','RS','SC','DF','PE','CE'];
  const cities = ['São Paulo','Rio de Janeiro','Belo Horizonte','Salvador','Curitiba','Porto Alegre','Florianópolis','Brasília','Recife','Fortaleza'];

  // Build 30 profiles distributed across categories
  const target = 30;
  for (let i=0;i<target;i++){
    const catKey = pick(Object.keys(CATEGORIES));
    const cat = (CATEGORIES as any)[catKey];
    const role = pick(cat.roles);
    const skillCount = randInt(2,4);
    const tags:Set<string> = new Set();
    // always include 1 category-specific skill
    tags.add(pick(cat.skills));
    while(tags.size < skillCount){ tags.add(pick(cat.skills)); }
    // occasional English
    if (Math.random() > 0.6) tags.add('Inglês Fluente');

    const name = makeName();
    const city = pick(cities);
    const state = pick(states);
    const avatar = makeAvatar(name + i);
    const slug = slugify(`${name} ${role}`) + '-' + String(randInt(1000,9999));

    profiles.push({
      user_id: null,
      name,
      slug,
      niche: role,
      category: catKey,
      bio: makeBio(role),
      tags: Array.from(tags),
      contact_info: { email: `${name.toLowerCase().replace(/[^a-z]+/g,'')}@example.com`, phone: `+55${randInt(1100000000,1199999999)}` },
      location: { city, state },
      avatar_url: avatar,
      average_rating: Number((Math.random()*2 + 3).toFixed(1)),
      is_verified: Math.random() > 0.75,
      source: 'seed-script',
      created_at: new Date().toISOString()
    });
  }

  console.log(`📥 Inserindo ${profiles.length} perfis em 'professionals'...`);
  const { data, error } = await supabase.from('professionals').insert(profiles).select('id,name,slug');
  if (error) {
    console.error('❌ Erro ao inserir profissionais:', error);
    process.exit(1);
  }

  console.log('✅ Perfis inseridos:', data?.length || 0);
  console.log('🎉 Seed finalizado.');
}

seed().then(()=>process.exit(0)).catch(err=>{ console.error(err); process.exit(1); });
