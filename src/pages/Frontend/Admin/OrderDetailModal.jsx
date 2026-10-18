import React from "react";
import { formatPrice, formatDateTime } from "../../../utils/format";
import { AntdMess } from "../../../Components/Antd";
import { StatusBadge, PaymentBadge } from "./OrderBadges";

/** Builds a wa.me link from a local Pakistani number (0319... -> 92319...). */
const whatsappLink = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "").replace(/^0/, "92");
    return digits ? `https://wa.me/${digits}` : null;
};

/**
 * Read-only modal with the full details of one order.
 * `order` = null keeps it closed. Optionally pass `onMarkDelivered(orderId)`
 * to show the "Mark as Delivered" action for pending orders.
 */
const OrderDetailModal = ({ order, onClose, onMarkDelivered }) => {
    if (!order) return null;

    const items = order.items || [];
    const wa = whatsappLink(order.phone);

    const copyOrderId = async () => {
        try {
            await navigator.clipboard.writeText(order.id);
            AntdMess({ type: "success", messageText: "Order ID copied" });
        } catch {
            AntdMess({ type: "error", messageText: "Could not copy the order ID" });
        }
    };

    return (
        <>
            <div
                className="modal fade show d-block"
                role="dialog"
                aria-modal="true"
                onClick={onClose}
            >
                <div
                    className="modal-dialog modal-lg modal-dialog-scrollable"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title d-flex align-items-center gap-2">
                                Order Details <StatusBadge status={order.status} />
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <p className="text-muted small text-uppercase mb-1">Customer</p>
                                    <p className="mb-1 fw-semibold">{order.customerName || "—"}</p>
                                    {order.phone && (
                                        <p className="mb-1">
                                            <a href={`tel:${order.phone}`} className="text-decoration-none me-3">
                                                <i className="fa-solid fa-phone me-1" />
                                                {order.phone}
                                            </a>
                                            {wa && (
                                                <a
                                                    href={wa}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none text-success"
                                                >
                                                    <i className="fa-brands fa-whatsapp me-1" />
                                                    WhatsApp
                                                </a>
                                            )}
                                        </p>
                                    )}
                                    <p className="mb-0 text-muted">{order.address || "—"}</p>
                                </div>

                                <div className="col-md-6">
                                    <p className="text-muted small text-uppercase mb-1">Order</p>
                                    <p className="mb-1">
                                        <span className="font-monospace">{order.id}</span>{" "}
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary py-0 px-1 ms-1"
                                            onClick={copyOrderId}
                                            title="Copy order ID"
                                        >
                                            <i className="fa-regular fa-copy" />
                                        </button>
                                    </p>
                                    <p className="mb-1 text-muted">
                                        Placed: {formatDateTime(order.createdAt, "N/A")}
                                    </p>
                                    {order.deliveredAt && (
                                        <p className="mb-1 text-muted">
                                            Delivered: {formatDateTime(order.deliveredAt, "N/A")}
                                        </p>
                                    )}
                                    <p className="mb-0">
                                        Payment: <PaymentBadge method={order.paymentMethod} />
                                    </p>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-sm align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Product</th>
                                            <th className="text-center">Qty</th>
                                            <th className="text-end">Unit Price</th>
                                            <th className="text-end">Line Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id || index}>
                                                <td>{item.productName || "—"}</td>
                                                <td className="text-center">{Number(item.quantity) || 0}</td>
                                                <td className="text-end">{formatPrice(item.sellPrice)}</td>
                                                <td className="text-end">
                                                    {formatPrice((Number(item.quantity) || 0) * (Number(item.sellPrice) || 0))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <dl className="row mb-0 justify-content-end">
                                <dt className="col-6 col-md-4 text-muted fw-normal">Items total</dt>
                                <dd className="col-6 col-md-3 text-end mb-1">{formatPrice(order.total)}</dd>
                                <dt className="col-6 col-md-4 text-muted fw-normal">Delivery charge</dt>
                                <dd className="col-6 col-md-3 text-end mb-1">{formatPrice(order.deliveryCharge)}</dd>
                                {Number(order.discount) > 0 && (
                                    <>
                                        <dt className="col-6 col-md-4 text-muted fw-normal">Online payment discount</dt>
                                        <dd className="col-6 col-md-3 text-end mb-1 text-success">- {formatPrice(order.discount)}</dd>
                                    </>
                                )}
                                <dt className="col-6 col-md-4 fs-5">Grand total</dt>
                                <dd className="col-6 col-md-3 text-end fs-5 fw-bold mb-0">{formatPrice(order.grandTotal)}</dd>
                            </dl>
                        </div>

                        <div className="modal-footer justify-content-between">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Close
                            </button>
                            {onMarkDelivered && order.status === "pending" && (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => onMarkDelivered(order.id)}
                                >
                                    <i className="fa-solid fa-check me-1" /> Mark as Delivered
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </>
    );
};

export default OrderDetailModal;
