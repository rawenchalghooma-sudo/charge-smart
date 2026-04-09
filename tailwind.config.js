/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        mutedFg: "hsl(var(--muted-foreground))",

        primary: "hsl(var(--primary))",
        primaryFg: "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        secondaryFg: "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        accentFg: "hsl(var(--accent-foreground))",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
      },
    },
  },
  plugins: [],
};