const express = require('express');
const cors = require('cors');
const scraping_Exito = require('./scraping/scraping-Exito.js');
const scraping_MercadoLibre = require('./scraping/scraping-MercadoLibre.js');
const scraping_Alkosto = require('./scraping/scraping-Alkosto.js');
const scraping_Falabella = require('./scraping/scraping-Falabella.js');
const scraping_Olimpica = require('./scraping/scraping-Olimpica.js');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public')); // Sirve los archivos estáticos

async function runParallelSearchesAndSave(searchTerm) {
    const alkosto = await scraping_Alkosto(searchTerm);
    const exito = await scraping_Exito(searchTerm);
    const falabella = await scraping_Falabella(searchTerm);
    const mercadolibre = await scraping_MercadoLibre(searchTerm);
    const olimpica = await scraping_Olimpica(searchTerm);
    return [].concat(mercadolibre, alkosto, exito, olimpica, falabella);
}

app.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        res.status(400).send("El término de búsqueda está vacío.");
        return;
    }
    try {
        const results = await runParallelSearchesAndSave(searchTerm);
        res.json(results);
    } catch (error) {
        console.error("Error durante la búsqueda:", error);
        res.status(500).send("Error al procesar su solicitud. Inténtalo de nuevo más tarde.");
    }

});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

