import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
// import "ckeditor5/ckeditor5.css";
// import "@ckeditor/ckeditor5-build-classic/build/ckeditor.css";
import './index.css'
import App from './App.tsx'



// 🆕 ID của bạn từ Google Cloud Console
// Thay thế YOUR_GOOGLE_CLIENT_ID bằng ID thực tế từ .env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <App key="app-root"/>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)