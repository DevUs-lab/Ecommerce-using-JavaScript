import React from 'react'
import { message, Spin } from "antd";

const AntdSpin = ({ size = "default", tip, fullscreen = true }) => {
    return <Spin size={size} tip={tip} fullscreen={fullscreen} />;
};

export default AntdSpin;

/**
 * Show an Ant Design message notification.
 * Usage: AntdMess({ type: "success", messageText: "Done!" })
 * Valid types: "success" | "error" | "info" | "warning"
 */
export const AntdMess = ({ type, messageText }) => {
    if (typeof message[type] === "function") {
        message[type](messageText);
    } else {
        console.warn(`AntdMess: unknown type "${type}"`);
        message.info(messageText);
    }
};
