import React from 'react'
import Router from './pages/Router'
import { Analytics } from "@vercel/analytics/react"
const App = () => {
  return (
    <>
      <Analytics />
      <Router />
    </>
  )
}

export default App