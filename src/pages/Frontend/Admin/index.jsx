import {
    Routes, Route, Link
} from "react-router-dom"
import Dashboard from "./Dashboard"
import Users from "./Users"
import Products from "./Products"
import Settings from "./Settings"

export default function AppRouter() {
    return (
        <>
            <div className=".container">
                <div className="row">
                    <div className="col-4 d-flex min-vh-100  bg-dark flex-column text-white">

                        <h3 className="mt-5 text-center">Admin Panel</h3>
                        <Link to="/admin" className="py-3 ms-4 text-decoration-none hover:dark">Dashboard</Link>
                        <Link to="/admin/users" className="py-3 text-decoration-none ms-4 hover:dark">Users</Link>
                        <Link to='/admin/products' className="py-3 text-decoration-none ms-4 hover:dark">Products</Link>
                        <Link to="/admin/settings" className="py-3 text-decoration-none ms-4 hover:dark">Setting</Link>

                    </div>
                    <div className="col-8">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>

                    </div>
                </div>
            </div>
        </>
    )
}
