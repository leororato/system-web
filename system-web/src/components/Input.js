import React, { useState } from 'react';

const Input = ({ 
    type, 
    placeholder, 
    backgroundColor, 
    fontSize, 
    padding, 
    name, 
    onChange, 
    title, 
    value, 
    readOnly, 
    min 
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} id='div-input-customizado'>
            <input 
                type={type} 
                placeholder={placeholder}
                name={name}
                value={value}
                min={min}
                onChange={onChange}
                readOnly={readOnly}
                style={{
                    backgroundColor: backgroundColor, 
                    fontSize: fontSize, 
                    padding: padding,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            />
            {tooltipVisible && title && (
                <div 
                    style={{
                        position: 'fixed',
                        top: tooltipPosition.y + 'px',
                        left: tooltipPosition.x + 15 + 'px', // 15px à direita do cursor
                        backgroundColor: 'rgba(0, 87, 179, 0.644)',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 1000,
                    }}
                >
                    {title}
                </div>
            )}
        </div>
    );
};

export default Input;












// const Input = ({ type, placeholder, backgroundColor, fontSize, padding, name, onChange, title, value, readOnly, min }) => {
//     return (
//             <input 
//             type={type} 
//             placeholder={placeholder}
//             name={name}
//             value={value}
//             min={min}
//             onChange={onChange}
//             title= {title}
//             readOnly={readOnly}
//             style={{
//             backgroundColor: backgroundColor, 
//             fontSize: fontSize, 
//             padding: padding,
//             }}
//             />
//     )
// }

// export default Input;