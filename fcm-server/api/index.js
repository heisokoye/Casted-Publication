import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import { loadJSON } from '../load-json.js';

const app = express();

// Enable JSON parsing
app.use(express.json());

// CORS — only allow your website
app.use(cors({
  origin: ["https://casted.blog", "https://www.casted.blog"]
}));

// Load Firebase service account
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = loadJSON('./castedwebsite-firebase-adminsdk-fbsvc-18163fe0f1.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const tokensCollection = db.collection('fcmTokens');
const postsCollection = db.collection('posts');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const htmlToPlainText = (html = '') =>
  String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// GET endpoint for testing
app.get('/', (req, res) => {
  res.send('FCM Server is running!');
});

// Share endpoint for social crawlers (WhatsApp/Facebook/X/LinkedIn)
app.get('/share/post/:id', async (req, res) => {
  const { id } = req.params;
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'casted.blog';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}`;
  const appPostUrl = `${baseUrl}/post/${id}`;
  const shareUrl = `${baseUrl}/share/post/${id}`;

  try {
    const postSnap = await postsCollection.doc(id).get();
    if (!postSnap.exists) {
      return res.status(404).send('Post not found');
    }

    const post = postSnap.data() || {};
    const title = post.title || 'Casted! Publications';
    const description = htmlToPlainText(post.content || '').slice(0, 180) || 'Read this post on Casted! Publications.';
    const image = post.fileUrl || `${baseUrl}/logo.png`;

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | Casted! Publications</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Casted! Publications" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${escapeHtml(shareUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(appPostUrl)}" />
    <link rel="canonical" href="${escapeHtml(appPostUrl)}" />
  </head>
  <body>
    <p>Redirecting to <a href="${escapeHtml(appPostUrl)}">${escapeHtml(appPostUrl)}</a>...</p>
    <script>window.location.replace(${JSON.stringify(appPostUrl)});</script>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Failed to render share page:', error);
    return res.status(500).send('Failed to render share page');
  }
});

// GET endpoint to retrieve all tokens
app.get('/tokens', async (req, res) => {
  try {
    const tokensSnapshot = await tokensCollection.get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data());
    res.status(200).send(tokens);
  } catch (error) {
    console.error('Failed to retrieve tokens:', error);
    res.status(500).send({ error: 'Failed to retrieve tokens.' });
  }
});

// STORE TOKEN endpoint
app.post('/store-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send({ error: 'No token provided.' });

  try {
    await tokensCollection.doc(token).set({
      token,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Token stored: ${token}`);
    res.status(200).send({ message: 'Token stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to store token.' });
  }
});

// SEND TO ALL endpoint — fully server-driven
app.post('/send-to-all', async (req, res) => {
  const { title, body, image, url } = req.body || {};

  const tokensSnapshot = await tokensCollection.get();
  const tokens = tokensSnapshot.docs.map(doc => doc.id);

  if (!tokens.length) return res.status(400).send({ error: 'No registered tokens.' });

  const message = {
    notification: {
      title: title || "Casted Update",
      body: body || "Open the app to learn more.",
    },
    data: {
      url: url || "/"
    },
    tokens
  };

  if (image) {
    message.notification.image = image;
  }

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`${response.successCount} messages sent successfully`);

    const failed = response.responses
      .map((r, i) => (!r.success ? { token: tokens[i], error: r.error?.message } : null))
      .filter(Boolean);

    // Remove invalid tokens
    for (const failure of failed) {
      const msg = failure.error || '';
      if (
        /not registered/i.test(msg) ||
        /invalid-registration-token/i.test(msg) ||
        /requested entity was not found/i.test(msg)
      ) {
        await tokensCollection.doc(failure.token).delete();
        console.log('Removed invalid token:', failure.token);
      }
    }

    res.status(207).send({
      message: failed.length ? 'Some notifications failed' : 'Notifications sent successfully',
      summary: { successCount: response.successCount, failureCount: response.failureCount },
      failed
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to send notifications', details: error.message || String(error) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FCM server running on port ${PORT}`));
