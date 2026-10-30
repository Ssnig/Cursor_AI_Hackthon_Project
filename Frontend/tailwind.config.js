/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Orbitron'", "'Share Tech Mono'", "ui-monospace", "monospace"],
        mono: ["'JetBrains Mono'", "'Share Tech Mono'", "ui-monospace", "monospace"],
        sans: ["'Rajdhani'", "'Segoe UI'", "sans-serif"]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        cyber: {
          cyan: "#00f0ff",
          magenta: "#ff0055",
          yellow: "#f59e0b",
          green: "#00ff66",
          dark: "#030712",
          surface: "#090d16",
          border: "rgba(0, 240, 255, 0.3)"
        }
      },
      boxShadow: {
        "cyan-glow": "0 0 20px rgba(0, 240, 255, 0.45)",
        "magenta-glow": "0 0 20px rgba(255, 0, 85, 0.45)",
        "green-glow": "0 0 20px rgba(0, 255, 102, 0.45)",
        "hud-card": "inset 0 0 15px rgba(0, 240, 255, 0.08), 0 0 20px rgba(0, 240, 255, 0.15)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: []
};
