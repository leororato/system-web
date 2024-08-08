import logoImg from "../assets/logo.png"

const Logo = ({ width, height, backgroundColor, display, margin, borderRadius}) => {
    const style = {
        width: width,
        height: height,
        borderRadius: borderRadius,
        backgroundColor,
        margin: margin,
        display: display
    };

    return (
        <div>
            <img src={logoImg} alt="logo" style={style}/>
        </div>
    )
}

export default Logo;