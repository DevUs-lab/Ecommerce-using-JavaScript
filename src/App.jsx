import React from 'react'
import Router from './pages/Router'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { isFirebaseConfigured } from './firebase/config'

const ConfigMissingNotice = () => (
  <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
    <div className="text-center border rounded-3 p-4 p-md-5 shadow-sm bg-white" style={{ maxWidth: 640 }}>
      <h1 className="h4 fw-bold mb-3">Store configuration required</h1>
      <p className="text-muted mb-3">
        This store is missing its Firebase environment variables, so it cannot
        load products, orders or settings.
      </p>
      <p className="small text-muted mb-0">
        Site owner: add the <code>VITE_FIREBASE_*</code>, <code>VITE_CLOUDINARY_*</code> and{' '}
        <code>VITE_EMAILJS_*</code> variables in Vercel → Project → Settings → Environment
        Variables, then redeploy.
      </p>
    </div>
  </div>
)

const App = () => {
  if (!isFirebaseConfigured) {
    return <ConfigMissingNotice />
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Router />
    </>
  )
}

export default App
