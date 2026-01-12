import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Admin from './Frontend/Admin'

const Index = () => {
    return (
        <Routes>
            <Route path="/*" element={<Frontend />} />
            <Route path="/admin/*" element={<Admin />} />
        </Routes>
    )
}

export default Index
