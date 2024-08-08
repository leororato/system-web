

const Input = ({ type, placeholder, backgroundColor, fontSize, padding, name, onChange, title, value, readOnly }) => {
    return (
            <input 
            type={type} 
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            title= {title}
            readOnly={readOnly}
            style={{
            backgroundColor: backgroundColor, 
            fontSize: fontSize, 
            padding: padding,
            }}
            />
    )
}

export default Input;