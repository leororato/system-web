import React from "react";
import './SucessNotification.css';

const SucessNotification = ({ message, onClose }) => {
    if (!message) return null;

    // Se message for um objeto converte ela para uma string
    const displayMessage = typeof message === 'object' ? JSON.stringify(message) : message;

    return (
        <div className="sucess-notification">
            <div className="sucess-message">
                {displayMessage}
            </div>
            <button className="sucess-close" onClick={onClose}>X</button>
        </div>
    );
}

export default SucessNotification;
