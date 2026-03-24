import React, { useState } from 'react';

const ImageMagnifier = ({
    src,
    width = "100%",
    height = "auto",
    magnifierHeight = 150,
    magnifierWidth = 150,
    zoomLevel = 2.5,
    alt = "Product image"
}) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

    return (
        <div
            style={{
                position: "relative",
                height: height,
                width: width
            }}
        >
            <img
                src={src}
                style={{ height: height, width: width, objectFit: "cover" }}
                onMouseEnter={(e) => {
                    // Update image size and turn on magnifier
                    const elem = e.currentTarget;
                    const { width, height } = elem.getBoundingClientRect();
                    setSize([width, height]);
                    setShowMagnifier(true);
                }}
                onMouseMove={(e) => {
                    // Update cursor position
                    const elem = e.currentTarget;
                    const { top, left } = elem.getBoundingClientRect();

                    // calculate cursor position on the image
                    const x = e.pageX - left - window.pageXOffset;
                    const y = e.pageY - top - window.pageYOffset;
                    setXY([x, y]);
                }}
                onMouseLeave={() => {
                    // Close magnifier
                    setShowMagnifier(false);
                }}
                alt={alt}
            />

            <div
                style={{
                    display: showMagnifier ? "" : "none",
                    position: "absolute",

                    // prevent magnifier blocks the mousemove event of img
                    pointerEvents: "none",
                    // set size of magnifier
                    height: `${magnifierHeight}px`,
                    width: `${magnifierWidth}px`,
                    // move element center to cursor pos
                    top: `${y - magnifierHeight / 2}px`,
                    left: `${x - magnifierWidth / 2}px`,
                    opacity: "1", // reduce opacity so you can verify position
                    border: "1px solid lightgray",
                    backgroundColor: "white",
                    backgroundImage: `url('${src}')`,
                    backgroundRepeat: "no-repeat",

                    //calculate zoomed image size
                    backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,

                    //calculate position of zoomed image.
                    backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                    backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,

                    borderRadius: "50%", // Circular magnifier for "lens" effect
                    boxShadow: "0 0 10px rgba(0,0,0,0.25)",
                    zIndex: 10
                }}
            />
        </div>
    );
}

export default ImageMagnifier;
