// Vercel serverless function: proxies URL shortening via is.gd
// No CORS issues since this runs server-side.
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await fetch(
            `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
        );
        const short = await response.text();

        if (short && short.startsWith('https://is.gd/')) {
            const code = short.trim().replace('https://is.gd/', '');
            // Return both the is.gd URL and the branded bloomforyou URL
            const host = req.headers.host || 'bloomforyou.vercel.app';
            const branded = `https://${host}/s/${code}`;
            return res.status(200).json({ short: short.trim(), branded, code });
        }
        return res.status(500).json({ error: 'Shortener failed', raw: short });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
