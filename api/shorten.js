// Vercel serverless function: POST /api/shorten
// Stores bouquet JSON in dpaste.com (free, no auth, short IDs ~5 chars)
// Returns: bloomforyou.vercel.app/bouquet/XXXXX  (~42 chars total)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data is required' });

    try {
        // dpaste.com: free paste API, no auth, 10-year expiry, short alphanumeric IDs
        const body = new URLSearchParams({
            content: JSON.stringify(data),
            syntax: 'text',
            expiry_days: '3650',   // 10 years
        });

        const response = await fetch('https://dpaste.com/api/v2/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        if (!response.ok) throw new Error(`dpaste error: ${response.status}`);

        // dpaste returns plain text: "https://dpaste.com/XXXXX\n"
        const text = await response.text();
        const pasteUrl = text.trim(); // e.g. https://dpaste.com/7KPBT
        const pasteId = pasteUrl.split('/').filter(Boolean).pop();

        if (!pasteId) throw new Error('No paste ID returned');

        const host = req.headers.host || 'bloomforyou.vercel.app';
        const branded = `https://${host}/bouquet/${pasteId}`;
        return res.status(200).json({ branded, pasteId });

    } catch (e) {
        // Storage failed — signal client to use long ?data= fallback
        return res.status(500).json({ error: e.message });
    }
}
