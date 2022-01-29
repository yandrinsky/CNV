import {cssEngine} from "../cssEngine/cssEngine";

function textRender(props){
    const style = cssEngine({
        css: props.css,
        classes: props.link.classList,
        type: props.link.type,
        ownStyle: props.link.style,
    });

    let coords = props.link.getCoords();
    let x = coords.start.x;
    let y = coords.start.y;

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