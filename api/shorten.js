// Vercel serverless function: /api/shorten
// Previously used is.gd which was mangling the ?data= param causing blank links.
// Now we simply return the full URL as-is — reliable, no third-party dependency.
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL is required' });

    // Return the full URL directly — short links via is.gd were stripping the
    // ?data= query param and causing blank bouquet pages.
    return res.status(200).json({ short: url, branded: url });
}
