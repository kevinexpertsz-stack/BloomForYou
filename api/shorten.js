// Vercel serverless function: POST /api/shorten
// Stores bouquet JSON in pastefy.app (free, no auth, short IDs ~5-8 chars)
// Returns: bloomforyou.vercel.app/blooms/XXXXX  (~40 chars total)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data is required' });

    try {
        const response = await fetch('https://pastefy.app/api/v2/paste', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: JSON.stringify(data),
                type: 'text',
                title: 'bloomforyou_bouquet',
                expiry: null,  // never expires
            }),
        });

        if (!response.ok) throw new Error(`pastefy error: ${response.status}`);

        const json = await response.json();
        const pasteId = json?.paste?.id;

        if (!pasteId) throw new Error('No paste ID in response');

        const host = req.headers.host || 'bloomforyou.vercel.app';
        const branded = `https://${host}/blooms/${pasteId}`;
        return res.status(200).json({ branded, pasteId });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
