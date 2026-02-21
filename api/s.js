// Vercel serverless function: /api/s
// Redirects bloomforyou.vercel.app/s/CODE → is.gd/CODE → final bouquet page
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Extract code from query: /api/s?id=lwbutq
    const { id } = req.query;

    if (!id) {
        return res.status(400).send('Missing short code');
    }

    // Redirect to the is.gd short URL which will then redirect to the bouquet
    res.redirect(302, `https://is.gd/${id}`);
}
