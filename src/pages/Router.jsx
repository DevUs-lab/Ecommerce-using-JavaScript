import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'

const Index = () => {
    return (
        <Routes>
            <Route path="/*" element={<Frontend />} />
            {/* <Route path="/admin/*" element={<h1>Admin Router</h1>} /> */}
        </Routes>
    )
}

export default Index
