/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        container: { center: true, padding: { DEFAULT: "1rem", lg: "2rem" } },
        extend: {
        borderRadius: { xl: "1rem", "2xl": "1.25rem" },
        boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        },
        colors: {
        bg: "hsl(var(--background))",
        fg: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },

  plugins: [],
};
