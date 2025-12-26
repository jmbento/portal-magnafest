import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Paleta Oficial Portal MagnaFest
        magna: {
          black: '#000000',    // Deep Black (Fundo Principal)
          dark: '#0A0A0A',     // Surface (Cards)
          violet: '#8A2BE2',   // Electric Violet (Primária)
          cyan: '#00FFFF',     // Cyber Cyan (Secundária)
          magenta: '#FF00FF',  // Hot Magenta (Acento)
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
      },
    },
  },
  plugins: [],
};
export default config;
