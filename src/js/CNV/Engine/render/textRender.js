import {cssEngine} from "../cssEngine/cssEngine";

function textRender(props){
    const style = cssEngine(props.css, props.link.classList, props.link.type);
    props.context.font = `${style.fontSize} ${style.fontFamily}`;
    props.context.fillStyle = style.color;
    props.context.fillText(props.link.text, props.link.start.x + props.shift.x, props.link.start.y + props.shift.y);
}

export default textRender;