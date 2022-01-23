import {cssEngine} from "../cssEngine/cssEngine";

function textRender(props){

    let x = props.link.start.x + props.shift.x;
    let y = props.link.start.y + props.shift.y;
    const style = cssEngine(props.css, props.link.classList, props.link.type);
    props.context.font = `${style.fontSize} ${style.fontFamily}`;

    let info = props.context.measureText(props.link.text);
    let padding = Number(String(style.padding).split("px")[0]);

    if(style.backgroundColor){
        props.context.beginPath();
        props.context.fillStyle = style.backgroundColor;
        props.context.fillRect(x - padding, y + 2 + padding, info.width + padding * 2, -Number(style.fontSize.split("px")[0]) - padding * 2)
    }

    props.context.fillStyle = style.color;


    props.context.fillText(props.link.text, x, y);
}

export default textRender;