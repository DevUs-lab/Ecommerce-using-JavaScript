import React from "react";
import { Route, Routes } from "react-router-dom";
import Frontend from "./Frontend";
import Admin from "./Frontend/Admin";
import Dashboard from "./Frontend/Admin/Dashboard";
import Users from "./Frontend/Admin/Users";
import AddProducts from "./Frontend/Admin/AddProducts";
import Settings from "./Frontend/Admin/Settings";
import ProductDetail from "../Components/ProductDetail";
import AdminLogin from "./Frontend/Admin/AdminLogin";

const Index = () => {
    return (
        <Routes>
            {/* Public Frontend */}
            <Route path="/*" element={<Frontend />} />
            <Route path="/product/:id" element={<ProductDetail />} />


            <Route path="/admin/*" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="users/" element={<Users />} />
                <Route path="add-products/" element={<AddProducts />} />
                <Route path="settings/" element={<Settings />} />
            </Route>


            <Route path="/adminlogin" element={<AdminLogin />} />
        </Routes>
    );
};

export default Index;
