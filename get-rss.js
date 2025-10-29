const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
    try {
        // URL del feed RSS
        const feedUrl = 'https://www.google.com/alerts/feeds/16536343738982417073/13194083261960971336';

        // Recupera il feed RSS
        const response = await axios.get(feedUrl);
        
        // Verifica il tipo di contenuto restituito
        if (response.headers['content-type'].includes('text/html')) {
            console.log('Errore: ricevuto HTML invece di XML');
            return res.status(500).json({ error: 'Ricevuto contenuto HTML anziché XML' });
        }

        // Ottieni il contenuto XML
        const xml = response.data;

        // Converti il XML in JSON
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) {
                console.log('Errore nel parsing del feed XML:', err);
                return res.status(500).json({ error: 'Errore nel parsing del feed RSS' });
            }

            // Estrarre gli elementi del feed
            const items = result.feed.entry || [];
            const newsItems = items.map((entry) => ({
                title: entry.title || 'No title available',
                description: entry.content || 'No description available',
                link: entry.link.href || '#',
                date: entry.published || '',
                image: '' // Se c'è un'immagine, estrai l'URL (da aggiungere in futuro)
            }));

            // Restituisci i dati del feed in formato JSON
            return res.status(200).json(newsItems);
        });
    } catch (error) {
        // Log l'errore e restituisco un errore 500
        console.error('Errore durante il recupero del feed RSS:', error);
        return res.status(500).json({ error: 'Errore durante il recupero del feed RSS' });
    }
};
