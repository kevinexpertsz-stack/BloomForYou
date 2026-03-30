// Vercel serverless function: POST /api/shorten
// Proxies URL shortening via is.gd
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
        const text = await response.text();

        if (text && text.startsWith('https://is.gd/')) {
            const code = text.trim().replace('https://is.gd/', '');
            const host = req.headers.host || 'bloomforyou.vercel.app';
            // Branded short URL: bloomforyou.vercel.app/s/CODE
            const branded = `https://${host}/s/${code}`;
            return res.status(200).json({ branded, short: text, code });
        }

        // If is.gd fails, return the long URL as fallback
        return res.status(200).json({ branded: url, short: url });
    } catch (e) {
        return res.status(200).json({ branded: url, short: url });
    }
}
