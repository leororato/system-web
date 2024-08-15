import React from "react";
import './ErrorNotification.css';

const ErrorNotification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="error-notification">
            <div className="error-message">
                {message}
            </div>
            <button className="error-close" onClick={onClose}>X</button>
        </div>
    )
}

export default ErrorNotification;