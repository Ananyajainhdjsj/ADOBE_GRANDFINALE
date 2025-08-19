# Quick Setup: Adobe PDF Embed API with Ngrok

## 🚀 Method 1: Ngrok Tunneling (Fastest)

### Step 1: Install ngrok
```bash
# Option A: Using npm
npm install -g ngrok

# Option B: Download from https://ngrok.com/download
```

### Step 2: Start your React app
```bash
cd frontend
npm run dev
# Your app runs on http://localhost:3000
```

### Step 3: Create ngrok tunnel (in new terminal)
```bash
ngrok http 3000
```

### Step 4: Get your public URL
```
ngrok will show you a URL like:
https://abc123.ngrok.io -> http://localhost:3000
```

### Step 5: Configure Adobe with this URL
1. Go to Adobe Developer Console
2. Add `https://abc123.ngrok.io` as allowed domain
3. Get your Client ID
4. Add to your .env file

---

## ✅ Method 2: Adobe Console Configuration

### Step 1: Adobe Developer Console Setup
1. Go to https://developer.adobe.com/console
2. Create new project or select existing
3. Add "PDF Embed API" service

### Step 2: Configure Allowed Domains
In Adobe Console, add these domains:
```
http://localhost:3000
https://localhost:3000
localhost:3000
127.0.0.1:3000
```

### Step 3: Get Client ID and Configure
1. Copy your Client ID
2. Create frontend/.env:
```env
VITE_ADOBE_CLIENT_ID=your_client_id_here
```

---

## 🌐 Method 3: Local HTTPS Setup

### Step 1: Install mkcert
```bash
# Windows (using Chocolatey)
choco install mkcert

# Or download from: https://github.com/FiloSottile/mkcert
```

### Step 2: Create local certificates
```bash
mkcert -install
mkcert localhost 127.0.0.1
```

### Step 3: Configure Vite for HTTPS
Update your `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost+1-key.pem'),
      cert: fs.readFileSync('./localhost+1.pem'),
    },
    port: 3000
  }
})
```

### Step 4: Access via HTTPS
Your app will be available at: `https://localhost:3000`

---

## ⚡ Method 4: Alternative PDF Viewer for Development

### React-PDF Setup
```bash
npm install react-pdf
```

### Create a development fallback viewer
```javascript
// In ViewerPage.jsx - add this as fallback for localhost
import { Document, Page, pdfjs } from 'react-pdf';

// Use this for localhost development
const LocalPDFViewer = ({ pdfUrl, filename }) => {
  return (
    <div className="w-full h-full">
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};
```

---

## 🎯 Which Method to Choose?

**For Quick Testing:** Use Method 1 (ngrok)
**For Development:** Use Method 3 (local HTTPS) 
**For Production:** Use Method 2 (proper Adobe config)
**For Fallback:** Use Method 4 (React-PDF)
