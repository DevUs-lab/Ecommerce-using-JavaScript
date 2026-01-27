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
import FAQs from "./Frontend/FAQs";
import PrivacyPolicy from "./Frontend/PrivacyPolicy";
import Terms from "./Frontend/Terms";
import OrderDelivered from "./Frontend/Admin/OrderDelivered";
import OrdersPending from "./Frontend/Admin/OrdersPeding";

const Index = () => {
    return (
        <Routes>
            {/* Public Frontend */}

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/faq" element={<FAQs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />


            <Route path="/admin/*" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="orders-pending" element={<OrdersPending />} />
                <Route path="order-delivered" element={<OrderDelivered />} />
                <Route path="users/" element={<Users />} />
                <Route path="add-products/" element={<AddProducts />} />
                <Route path="settings/" element={<Settings />} />
            </Route>

            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/*" element={<Frontend />} />
        </Routes>
    );
};

export default Index;
