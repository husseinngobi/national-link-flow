module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  // Safelist common dynamic utility patterns used by the site
  safelist: [
    { pattern: /^(sm:|md:|lg:|xl:)?text-/, variants: ["sm", "md", "lg", "xl"] },
    { pattern: /^(sm:|md:|lg:|xl:)?max-w-/, variants: ["sm", "md", "lg", "xl"] },
    { pattern: /^(sm:|md:|lg:|xl:)?mt-/, variants: ["sm", "md", "lg", "xl"] },
    { pattern: /^(sm:|md:|lg:|xl:)?leading-/, variants: ["sm", "md", "lg", "xl"] },
  ],
  plugins: [],
};
