/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["lilliput", "monospace"],
      },
      keyframes: {
        pixelMove: {
          "0%": { backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" },
          "100%": {
            backgroundPosition: "20px 0, 20px 10px, 30px -10px, 10px 0px",
          },
        },
      },
      animation: {
        pixelMove: "pixelMove 20s linear infinite",
      },
    },
  },
  plugins: [],
};
