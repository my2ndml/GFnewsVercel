const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
    try {
        // URL del feed RSS
        const feedUrl = 'https://www.google.com/alerts/feeds/16536343738982417073/13194083261960971336';

        // Recupera il feed RSS
        const response = await axios.get(feedUrl);
        const xml = response.data;

        // Converti il XML in JSON
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Errore nel parsing del feed RSS' });
            }

            const items = result.feed.entry || [];
            const newsItems = items.map((entry) => ({
                title: entry.title || 'No title available',
                description: entry.content || 'No description available',
                link: entry.link.href || '#',
                date: entry.published || '',
                image: '' // Inserisci qui la logica per estrarre le immagini se esistono
            }));

            // Ritorna i dati del feed in formato JSON
            return res.status(200).json(newsItems);
        });
    } catch (error) {
        console.error('Errore durante il recupero del feed:', error);
        res.status(500).json({ error: 'Errore durante il recupero del feed RSS' });
    }
};
