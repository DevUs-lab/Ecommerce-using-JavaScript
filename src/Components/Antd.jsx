import React from 'react'
import { message, Spin } from "antd";

// const AntdSpin = ({ size = "default", fullscreen = false, tip = "" }) => {
//     return (
//         <div
//             className={`flex justify-center items-center ${fullscreen ? "min-h-screen" : ""
//                 }`}
//         >
//             <Spin size={size} tip={tip} fullscreen={fullscreen} />
//         </div>
//     )
// }

const AntdSpin = ({ size = "default", tip }) => {
    return <Spin size={size} tip={tip} fullscreen={true} />;
};

export default AntdSpin;



export const AntdMess = ({ type, messageText }) => {
    message[type](messageText)
}
