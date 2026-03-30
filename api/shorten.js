// Vercel serverless function: POST /api/shorten
// Stores bouquet JSON in JSONBlob (free, no auth, returns UUIDs)
// Returns a clean branded URL: bloomforyou.vercel.app/bouquet/UUID
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data is required' });

    try {
        // Store the compact bouquet JSON in JSONBlob
        const response = await fetch('https://jsonblob.com/api/jsonBlob', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`JSONBlob error: ${response.status}`);

        // JSONBlob returns the ID in the Location header:
        // e.g. https://jsonblob.com/api/jsonBlob/353317f1-5b05-41d4-a9f9-8ad6fef2e74c
        const location = response.headers.get('location') || '';
        const blobId = location.split('/').pop();

        if (!blobId) throw new Error('No blob ID returned');

        const host = req.headers.host || 'bloomforyou.vercel.app';
        const branded = `https://${host}/bouquet/${blobId}`;
        return res.status(200).json({ branded, blobId });

    } catch (e) {
        // JSONBlob failed — signal client to fall back to long ?data= URL
        return res.status(500).json({ error: e.message });
    }
}
