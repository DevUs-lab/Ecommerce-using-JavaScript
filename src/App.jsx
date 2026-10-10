import React from 'react'
import Router from './pages/Router'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Router />
    </>
  )
}

export default App