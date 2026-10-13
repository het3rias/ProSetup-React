// Babel se usa solo para las pruebas: Karma empaqueta los archivos .spec con webpack + babel.
// (Vite usa su propio compilador para "npm run dev" y "npm run build").
module.exports = (api) => {
    const enPruebas = api.env("test");
    return {
        presets: [
            ["@babel/preset-env", { targets: { chrome: "100" } }],
            ["@babel/preset-react", { runtime: "automatic" }]
        ],
        // istanbul instrumenta el código para medir la cobertura (no instrumenta las pruebas)
        plugins: enPruebas ? [["istanbul", { exclude: ["**/*.spec.js", "**/*.spec.jsx", "src/test/**"] }]] : []
    };
};
