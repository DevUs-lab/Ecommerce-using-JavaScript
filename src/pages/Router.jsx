import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Admin from './Frontend/Admin'
import Dashboard from './Frontend/Admin/Dashboard'
import Users from './Frontend/Admin/Users'
import AddProducts from './Frontend/Admin/AddProducts'
import Settings from './Frontend/Admin/Settings'

const Index = () => {
    return (
        <Routes>
            <Route path="/*" element={<Frontend />} />

            <Route path="/admin" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="add-products" element={<AddProducts />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}

export default Index
