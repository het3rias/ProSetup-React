/* ============================================
   Configuración de Karma (ejecutor de pruebas) + Jasmine (framework de pruebas)
   - Karma abre un navegador real sin interfaz (Chrome o Edge en modo headless)
     y ejecuta ahí todos los archivos *.spec.js / *.spec.jsx
   - webpack + babel compilan el JSX de los componentes React
   - karma-coverage genera el reporte de cobertura en la carpeta /coverage
   ============================================ */
const fs = require("fs");

process.env.BABEL_ENV = "test";

// Si no se indicó CHROME_BIN, se busca Chrome y, si no está, Microsoft Edge (viene con Windows)
if (!process.env.CHROME_BIN) {
    const candidatos = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        process.env.LOCALAPPDATA && process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium"
    ].filter(Boolean);
    const encontrado = candidatos.find(ruta => fs.existsSync(ruta));
    if (encontrado) process.env.CHROME_BIN = encontrado;
}

module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "webpack"],

        files: [
            "src/test/setup.js",
            { pattern: "src/**/*.spec.js", watched: false },
            { pattern: "src/**/*.spec.jsx", watched: false },
            // imágenes de /public para que los <img> no den 404 durante las pruebas
            { pattern: "public/img/**/*", watched: false, included: false, served: true }
        ],

        proxies: { "/img/": "/base/public/img/" },

        preprocessors: {
            "src/test/setup.js": ["webpack"],
            "src/**/*.spec.js": ["webpack"],
            "src/**/*.spec.jsx": ["webpack"]
        },

        webpack: {
            mode: "development",
            devtool: "inline-source-map",
            module: {
                rules: [{ test: /\.(js|jsx)$/, exclude: /node_modules/, use: { loader: "babel-loader" } }]
            },
            resolve: { extensions: [".js", ".jsx"] }
        },

        // progress: avance en la terminal · kjhtml: resultados en el navegador · coverage: cobertura
        reporters: ["progress", "kjhtml", "coverage"],

        coverageReporter: {
            dir: "coverage/",
            reporters: [
                { type: "html", subdir: "html" },
                { type: "text-summary" },
                { type: "text", subdir: ".", file: "cobertura.txt" }
            ]
        },

        client: {
            jasmine: { random: false },
            clearContext: false
        },

        browsers: ["ChromeHeadlessSinSandbox"],
        customLaunchers: {
            ChromeHeadlessSinSandbox: { base: "ChromeHeadless", flags: ["--no-sandbox"] }
        },

        browserNoActivityTimeout: 60000,
        singleRun: false,
        autoWatch: true
    });
};
