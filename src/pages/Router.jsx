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
import Orders from "./Frontend/Admin/Orders";
import FAQs from "./Frontend/FAQs";
import PrivacyPolicy from "./Frontend/PrivacyPolicy";
import Terms from "./Frontend/Terms";

const Index = () => {
    return (
        <Routes>
            {/* Public Frontend */}
            <Route path="/*" element={<Frontend />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/faq" element={<FAQs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />


            <Route path="/admin/*" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users/" element={<Users />} />
                <Route path="add-products/" element={<AddProducts />} />
                <Route path="settings/" element={<Settings />} />
            </Route>

            <Route path="/adminlogin" element={<AdminLogin />} />
        </Routes>
    );
};

export default Index;
