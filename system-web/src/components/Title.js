

const Title = ({text, color, fontSize, classname, id}) => {
    return (
      <h1 style={{ color: color, fontSize: fontSize}} className={classname} id={id}>{text} </h1>
    )
};

export default Title;