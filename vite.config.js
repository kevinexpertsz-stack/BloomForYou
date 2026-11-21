import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function devApiPlugin() {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/shorten' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { url } = JSON.parse(body || '{}');
              if (!url) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'URL is required' }));
              }

              const publicUrl = url.replace(/^https?:\/\/localhost(:\d+)?/, 'https://bloomforyou.vercel.app');
              const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(publicUrl)}`);
              const text = await response.text();

              if (text && text.startsWith('https://is.gd/')) {
                const code = text.trim().replace('https://is.gd/', '');
                const branded = `https://bloomforyou.vercel.app/s/${code}`;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ branded, short: text, code }));
              }

              try {
                const tinyRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(publicUrl)}`);
                const tinyText = await tinyRes.text();
                if (tinyText && tinyText.startsWith('https://tinyurl.com/')) {
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ branded: tinyText, short: tinyText }));
                }
              } catch (_) {}

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ branded: publicUrl, short: publicUrl }));
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ branded: url, short: url }));
            }
          });
          return;
        }

        if (req.url && req.url.startsWith('/s/')) {
          const code = req.url.replace('/s/', '').split('?')[0];
          if (code) {
            res.statusCode = 302;
            res.setHeader('Location', `https://is.gd/${code}`);
            return res.end();
          }
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  base: process.env.VITE_BASE_PATH || "/",
})
