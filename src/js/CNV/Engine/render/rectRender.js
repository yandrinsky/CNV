import {cssEngine} from "../cssEngine/cssEngine";
function rectRender(props){
    const style = cssEngine({
        css: props.css,
        classes: props.link.classList,
        type: props.link.type,
        ownStyle: props.link.style,
    });
    let coords = style.position === "fixed" ? props.link.getOwnCoords() : props.link.getCalcCoords();
    props.context.beginPath();
    props.context.fillStyle = style.backgroundColor;
    props.context.fillRect(coords.start.x, coords.start.y, props.link.width, props.link.height);
}

export default rectRender;