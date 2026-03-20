import nativewindPreset from "nativewind/preset";

/** @type {import('tailwindcss').Config} */
export default {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        background: "#020203",
        surface: {
          dark: "#0D0D10",
          light: "#1E1E22",
        },
        primary: "#25D366",    // WhatsApp Green (Global Primary)
        secondary: "#075E54",  // Dark WhatsApp Green
        accent: "#FF007F",     // Neon Magenta
        foreground: "#F7FAFC",
        "muted-foreground": "#718096",
        whatsapp: {
          green: "#25D366",
          dark: "#075E54",
          bg: "#0B141A",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.15)",
        },
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
      },
      aspectRatio: {
        "4/3": "4 / 3",
      },
      fontFamily: {
        Outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
