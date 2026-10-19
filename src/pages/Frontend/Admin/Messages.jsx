import React, { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Spin } from "antd";
import { AntdMess } from "../../../Components/Antd";
import { formatDateTime, toDate } from "../../../utils/format";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const snapshot = await getDocs(collection(db, "contacts"));
                setMessages(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
            } catch (error) {
                console.error("Error fetching messages:", error);
                AntdMess({ type: "error", messageText: "Failed to fetch messages" });
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const isUnread = (message) => message.read !== true;

    const toggleRead = async (message) => {
        const newReadState = isUnread(message);
        setBusyId(message.id);
        try {
            await updateDoc(doc(db, "contacts", message.id), { read: newReadState });
            setMessages((prev) =>
                prev.map((item) => (item.id === message.id ? { ...item, read: newReadState } : item))
            );
        } catch (error) {
            console.error("Failed to update message:", error);
            AntdMess({ type: "error", messageText: "Failed to update message" });
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (message) => {
        if (!window.confirm(`Delete the message from "${message.name}"? This cannot be undone.`)) return;

        setBusyId(message.id);
        try {
            await deleteDoc(doc(db, "contacts", message.id));
            setMessages((prev) => prev.filter((item) => item.id !== message.id));
            AntdMess({ type: "success", messageText: "Message deleted" });
        } catch (error) {
            console.error("Failed to delete message:", error);
            AntdMess({ type: "error", messageText: "Failed to delete message" });
        } finally {
            setBusyId(null);
        }
    };

    const visibleMessages = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return messages
            .filter((message) => (showUnreadOnly ? isUnread(message) : true))
            .filter(
                (message) =>
                    !term
                    || String(message.name || "").toLowerCase().includes(term)
                    || String(message.email || "").toLowerCase().includes(term)
                    || String(message.message || "").toLowerCase().includes(term)
            )
            .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0));
    }, [messages, searchTerm, showUnreadOnly]);

    const unreadCount = messages.filter(isUnread).length;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spin />
            </div>
        );
    }

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                    <h1 className="h2 mb-1">Messages</h1>
                    <p className="text-muted mb-0">
                        {messages.length} message{messages.length === 1 ? "" : "s"}
                        {unreadCount > 0 && (
                            <>
                                {" • "}
                                <span className="text-danger fw-semibold">{unreadCount} unread</span>
                            </>
                        )}
                    </p>
                </div>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div className="form-check form-switch mb-0">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="unreadOnly"
                            checked={showUnreadOnly}
                            onChange={(event) => setShowUnreadOnly(event.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="unreadOnly">
                            Unread only
                        </label>
                    </div>
                    <input
                        type="search"
                        className="form-control"
                        style={{ maxWidth: "280px" }}
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
            </div>

            {visibleMessages.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <p className="text-muted p-5 mb-0 text-center">
                        {messages.length === 0
                            ? "No messages yet. Messages sent from the Contact page will appear here."
                            : "No messages match your search."}
                    </p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {visibleMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`card border-0 shadow-sm ${isUnread(message) ? "border-start border-4 border-primary" : ""}`}
                        >
                            <div className="card-body">
                                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            {message.name || "—"}
                                            {isUnread(message) && <span className="badge bg-primary ms-2">New</span>}
                                        </p>
                                        <p className="mb-0 small">
                                            <a href={`mailto:${message.email}`} className="text-decoration-none">
                                                <i className="fa-solid fa-envelope me-1" aria-hidden="true"></i>
                                                {message.email || "—"}
                                            </a>
                                        </p>
                                    </div>
                                    <span className="text-muted small">{formatDateTime(message.createdAt, "N/A")}</span>
                                </div>

                                <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>{message.message}</p>

                                <div className="d-flex flex-wrap gap-2">
                                    <a
                                        className="btn btn-sm btn-primary"
                                        href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message to Need Buy Store")}`}
                                    >
                                        <i className="fa-solid fa-reply me-1" aria-hidden="true"></i>
                                        Reply by Email
                                    </a>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => toggleRead(message)}
                                        disabled={busyId === message.id}
                                    >
                                        <i
                                            className={`fa-solid ${isUnread(message) ? "fa-envelope-open" : "fa-envelope"} me-1`}
                                            aria-hidden="true"
                                        ></i>
                                        {isUnread(message) ? "Mark as Read" : "Mark as Unread"}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(message)}
                                        disabled={busyId === message.id}
                                    >
                                        <i className="fa-solid fa-trash-can me-1" aria-hidden="true"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Messages;
