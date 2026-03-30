// Vercel serverless function: proxies URL shortening via is.gd
// The base64 ?data= param is now properly encodeURIComponent'd by the client
// so is.gd correctly stores and redirects the full URL without mangling it.
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await fetch(
            `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
        );
        const short = await response.text();

        if (short && short.startsWith('https://is.gd/')) {
            const code = short.trim().replace('https://is.gd/', '');
            const host = req.headers.host || 'bloomforyou.vercel.app';
            // Use the is.gd URL directly (not a /s/ redirect) to avoid double-hop
            const branded = `https://is.gd/${code}`;
            return res.status(200).json({ short: short.trim(), branded, code });
        }

        // is.gd failed or rate-limited — return the long URL as fallback
        return res.status(200).json({ short: url, branded: url });
    } catch (e) {
        // Network error — return the long URL as fallback
        return res.status(200).json({ short: url, branded: url });
    }
}
