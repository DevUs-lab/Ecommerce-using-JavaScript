import React from 'react';
const Login = () => {
    return (
        <>
            <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 className="text-center mb-4">Login</h2>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <p className="mt-3 text-center">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </main>
        </>
    );
};

export default Login;
