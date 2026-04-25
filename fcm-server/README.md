# FCM Server

Firebase Cloud Messaging server for sending push notifications.

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and set the **Root Directory** to `fcm-server`
4. Add environment variable:
   - Go to Variables tab
   - Add ONE of the following:
     - `FIREBASE_SERVICE_ACCOUNT`: entire JSON content (string)
     - `FIREBASE_SERVICE_ACCOUNT_PATH`: path to the JSON file (if you upload it as a secret file)
5. Railway will auto-deploy. You'll get a URL like `https://your-app.railway.app`
6. Copy that URL - that's your FCM Server URL!

### Option 2: Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Set:
   - **Root Directory**: `fcm-server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add environment variable:
   - Either `FIREBASE_SERVICE_ACCOUNT` (raw JSON string) **or**
   - `FIREBASE_SERVICE_ACCOUNT_PATH` / `GOOGLE_APPLICATION_CREDENTIALS` pointing to an uploaded JSON file
6. Deploy. You'll get a URL like `https://your-app.onrender.com`

### Option 3: Heroku

1. Install Heroku CLI
2. In the `fcm-server` directory:
   ```bash
   heroku create your-fcm-server-name
   heroku config:set FIREBASE_SERVICE_ACCOUNT="$(cat castedwebsite-firebase-adminsdk-fbsvc-18163fe0f1.json)"
   git subtree push --prefix fcm-server heroku main
   ```

## After Deployment

1. Copy your deployed server URL (e.g., `https://your-app.railway.app`)
2. Go to your Vercel project settings
3. Add environment variable:
   - **Name**: `VITE_FCM_SERVER_URL`
   - **Value**: Your deployed FCM server URL
4. Redeploy your Vercel site

## Testing

Visit your deployed FCM server URL in a browser. You should see:
"FCM Server is running! Ready to receive tokens and send notifications."

