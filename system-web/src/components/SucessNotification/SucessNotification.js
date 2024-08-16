import React from "react";
import './SucessNotification.css';

const SucessNotification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="sucess-notification">
            <div className="sucess-message">
                {message}
            </div>
            <button className="sucess-close" onClick={onClose}>X</button>
        </div>
    )
}

export default SucessNotification;