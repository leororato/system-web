import React from "react";
import './ErrorNotification.css';
import { Icon } from '@iconify/react';

const ErrorNotification = ({ message, onClose }) => {
    if (!message) return null;

    const displayMessage = typeof message === 'object' ? JSON.stringify(message) : message;

    return (
        <div className="error-notification">
            <div className="error-message">
                {displayMessage}
            </div>
            <button className="error-close" onClick={onClose}><Icon icon="ep:close-bold" id="icone-fechar-message"/></button>
        </div>
    );
}

export default ErrorNotification;
