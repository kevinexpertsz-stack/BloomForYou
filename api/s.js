export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { id } = req.query;

    if (!id) {
        return res.status(400).send('Missing short code');
    }

    res.redirect(302, `https://is.gd/${id}`);
}
