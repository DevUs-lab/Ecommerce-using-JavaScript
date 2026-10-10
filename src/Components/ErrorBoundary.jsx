import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log to console; replace with a reporting service (Sentry etc.) if needed
        console.error("Unhandled app error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center"
                    style={{ minHeight: "100vh", padding: "24px" }}
                >
                    <h2 className="mb-3">Something went wrong</h2>
                    <p className="text-muted mb-4">
                        An unexpected error occurred. Please try again.
                    </p>
                    <button className="btn btn-primary" onClick={this.handleReload}>
                        Back to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
