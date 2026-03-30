// Vercel serverless function: /s/:code
// Looks up the stored data param and redirects to /final?data=CODE

const store = new Map();

// NOTE: This store Map is shared with shorten.js only when both run in the
// same Vercel function instance. For cross-instance persistence use Vercel KV.
// As a reliable fallback, the client always copies the full ?data= URL too.

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { id } = req.query;

    if (!id) {
        return res.redirect(302, '/');
    }

    // Try in-memory store first
    const dataParam = store.get(id);
    if (dataParam) {
        return res.redirect(302, `/final?data=${dataParam}`);
    }

    // Fallback: the code IS the data param itself (for direct long-URL fallback)
    // This handles the case where shortening was skipped and the full URL was copied
    return res.redirect(302, `/final?data=${id}`);
}
