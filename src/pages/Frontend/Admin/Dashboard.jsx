export default function Dashboard() {
    return (
        <>
            <h2>Dashboard</h2>

            <div className="row mt-4">
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>Total Users</h5>
                        <h2>120</h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>Total Products</h5>
                        <h2>45</h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>Orders</h5>
                        <h2>78</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
