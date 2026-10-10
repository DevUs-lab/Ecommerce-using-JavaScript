import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import Frontend from "./Frontend";
import ProductDetail from "../Components/ProductDetail";
import FAQs from "./Frontend/FAQs";
import PrivacyPolicy from "./Frontend/PrivacyPolicy";
import Terms from "./Frontend/Terms";
import AdminLogin from "./Frontend/Admin/AdminLogin";

// Admin pages are only needed by the admin, so split them out of the
// main bundle to keep the customer-facing download small.
const Admin = lazy(() => import("./Frontend/Admin"));
const Dashboard = lazy(() => import("./Frontend/Admin/Dashboard"));
const Users = lazy(() => import("./Frontend/Admin/Users"));
const AddProducts = lazy(() => import("./Frontend/Admin/AddProducts"));
const Settings = lazy(() => import("./Frontend/Admin/Settings"));
const OrderDelivered = lazy(() => import("./Frontend/Admin/OrderDelivered"));
const OrdersPending = lazy(() => import("./Frontend/Admin/OrdersPeding"));

const PageLoader = () => (
    <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
    >
        <Spin size="large" />
    </div>
);

const Index = () => {
    return (
        <Suspense fallback={<PageLoader />}>
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
                    <Route path="users" element={<Users />} />
                    <Route path="add-products" element={<AddProducts />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/*" element={<Frontend />} />
            </Routes>
        </Suspense>
    );
};

export default Index;
