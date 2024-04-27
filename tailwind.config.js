import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4f46e5",
          secondary: "#d1d5db",
          accent: "#e5e7eb",
          neutral: "#c7d2fe",
          "base-100": "#FDFCF7",
          info: "#bae6fd",
          success: "#d9f99d",
          warning: "#fde68a",
          error: "#fca5a5",
        },
      },
    ],
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    daisyui,
  ],
};
