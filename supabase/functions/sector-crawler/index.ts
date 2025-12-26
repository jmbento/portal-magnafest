import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// =====================================================================
// TYPES
// =====================================================================

interface Profile {
  id?: string;
  name: string;
  description: string | null;
  website: string | null;
  category: string;
  is_claimed?: boolean;
  source?: string;
}

interface CrawlerResponse {
  success: boolean;
  term: string;
  inserted_count: number;
  error?: string;
}

// =====================================================================
// KEYWORDS POOL (Setor de Eventos)
// =====================================================================

const SECTOR_KEYWORDS = [
  "DJ profissional",
  "fotógrafo de eventos",
  "produtora de eventos",
  "iluminação cênica",
  "som e áudio profissional",
  "buffet para festas",
  "decoração de eventos",
  "segurança para eventos",
  "palco e estruturas",
  "locação de equipamentos",
  "filmagem de eventos",
  "animação de festas",
  "assessoria de eventos",
  "cerimonial e protocolo",
  "bartender profissional",
  "gerador de energia",
  "tendas e coberturas",
  "banheiros químicos VIP",
  "camarim móvel",
  "pista de dança iluminada"
];

// =====================================================================
// MOCK DATA GENERATOR
// =====================================================================

function fetchExternalData(keyword: string): Profile[] {
  const randomCount = Math.floor(Math.random() * 3) + 1; // 1-3 profiles
  const profiles: Profile[] = [];

  for (let i = 0; i < randomCount; i++) {
    const randomNumber = Math.floor(Math.random() * 10000);
    const companyName = `${keyword.split(" ")[0]} Premium ${randomNumber}`;
    const websiteDomain = companyName.toLowerCase().replace(/\s+/g, "");

    profiles.push({
      name: companyName,
      description: `Empresa especializada em ${keyword} com anos de experiência no mercado de eventos.`,
      website: `https://www.${websiteDomain}.com.br`,
      category: keyword,
      is_claimed: false,
      source: "auto-bot",
    });
  }

  return profiles;
}

// =====================================================================
// MAIN HANDLER
// =====================================================================

serve(async (req: Request): Promise<Response> => {
  try {
    // CORS headers
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Select random keyword
    const randomIndex = Math.floor(Math.random() * SECTOR_KEYWORDS.length);
    const selectedKeyword = SECTOR_KEYWORDS[randomIndex];

    // Fetch mock data
    const mockProfiles = fetchExternalData(selectedKeyword);

    // Upsert profiles (ignore duplicates based on website)
    let insertedCount = 0;

    for (const profile of mockProfiles) {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(profile, {
          onConflict: "website",
          ignoreDuplicates: true,
        })
        .select();

      if (!error && data && data.length > 0) {
        insertedCount++;
      }
    }

    const response: CrawlerResponse = {
      success: true,
      term: selectedKeyword,
      inserted_count: insertedCount,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Crawler error:", error);

    const errorResponse: CrawlerResponse = {
      success: false,
      term: "",
      inserted_count: 0,
      error: error.message || "Unknown error",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
