import { Link, Outlet } from "react-router-dom";

export default function AppRouter() {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">

                {/* Sidebar */}
                <div className="col-3 col-md-3 bg-dark text-white p-4">
                    <h3 className="text-center mb-4">Admin Panel</h3>

                    <Link to="" className="d-block py-2 text-white text-decoration-none">
                        Dashboard
                    </Link>

                    <Link to="users" className="d-block py-2 text-white text-decoration-none">
                        Users
                    </Link>

                    <Link to="add-products" className="d-block py-2 text-white text-decoration-none">
                        Add-Products
                    </Link>

                    <Link to="settings" className="d-block py-2 text-white text-decoration-none">
                        Settings
                    </Link>
                </div>

                {/* Content */}
                <div className="col-9 col-md-9 p-4 bg-light">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}
