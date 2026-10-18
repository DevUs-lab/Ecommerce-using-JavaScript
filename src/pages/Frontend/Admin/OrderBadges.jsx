import React from "react";

/** Colored badge for an order's status. */
export const StatusBadge = ({ status }) => (
    status === "delivered" ? (
        <span className="badge bg-success">Delivered</span>
    ) : (
        <span className="badge bg-warning text-dark">Pending</span>
    )
);

const PAYMENT_COLORS = {
    "Cash on Delivery": "secondary",
    "EasyPaisa": "success",
    "JazzCash": "danger",
    "Bank Transfer": "primary",
};

/** Colored badge for the payment method used on an order. */
export const PaymentBadge = ({ method }) => (
    <span className={`badge bg-${PAYMENT_COLORS[method] || "secondary"}`}>
        {method || "—"}
    </span>
);
