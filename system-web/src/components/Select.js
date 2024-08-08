
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
    cursor
}) => {
    const style = {
        padding,
        cursor
    }

    return (
        <div className={`select-container ${className}`}>
            <label>{label}{required && <span className="required-field"></span>}</label>
            <select
                disabled={disabled}
                value={value}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
};

export default Select;
