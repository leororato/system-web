import React, { useState, useRef } from 'react';

const Select = ({
    options,
    value,
    name,
    onChange,
    disabled,
    label,
    placeholder,
    className,
    required,
    padding,
    cursor,
    title // Adicionado para passar o texto do tooltip
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const selectRef = useRef(null);

    const handleMouseEnter = (e) => {
        setTooltipVisible(true);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    const style = {
        padding,
        cursor
    };

    const tooltipStyle = {
        position: 'fixed',
        top: tooltipPosition.y + 20 + 'px', // Ajusta a posição vertical para ficar um pouco abaixo do cursor
        left: tooltipPosition.x + 15 + 'px', // Ajusta a posição horizontal para ficar à direita do cursor
        backgroundColor: '#1780e2',
        color: '#fff',
        borderRadius: '2px',
        padding: '5px 10px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        zIndex: 10,
        pointerEvents: 'none' // Impede que o tooltip interfira com a interação do mouse
    };

    return (
        <div className={`select-container ${className}`} ref={selectRef}>
            <label>{label}{required && <span className="required-field"></span>}</label>
            <select
                disabled={disabled}
                value={value}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {tooltipVisible && (
                <div className="tooltip" style={tooltipStyle}>
                    {title} {/* Exibindo o texto do tooltip passado via title */}
                </div>
            )}
        </div>
    );
};

export default Select;














// const Select = ({
//     options,
//     value,
//     name,
//     onChange,
//     disabled,
//     label,
//     placeholder,
//     className,
//     required,
//     padding,
//     cursor
// }) => {
//     const style = {
//         padding,
//         cursor
//     }

//     return (
//         <div className={`select-container ${className}`}>
//             <label>{label}{required && <span className="required-field"></span>}</label>
//             <select
//                 disabled={disabled}
//                 value={value}
//                 name={name}
//                 onChange={onChange}
//                 placeholder={placeholder}
//                 style={style}
//             >
//                 <option value="">{placeholder}</option>
//                 {options.map((option, index) => (
//                     <option key={index} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     )
// };

// export default Select;
