import React from "react";
import './ErrorNotification.css';

const ErrorNotification = ({ message, onClose }) => {
    if (!message) return null;

    // Se message for um objeto, converta para uma string
    const displayMessage = typeof message === 'object' ? JSON.stringify(message) : message;

    return (
        <div className="error-notification">
            <div className="error-message">
                {displayMessage}
            </div>
            <button className="error-close" onClick={onClose}>X</button>
        </div>
    );
}

export default ErrorNotification;
