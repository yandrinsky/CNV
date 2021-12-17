import {cssEngine} from "../cssEngine/cssEngine";
//props: link, context, css, shift
function circleRender(props){
    const style = cssEngine(props.css, props.link.classList, props.link.type);
    if(!(style.visibility === "hidden")){
        props.context.beginPath();
        props.context.fillStyle = style.color;
        props.context.arc(props.link.start.x + props.shift.x, props.link.start.y + props.shift.y, style.radius, style.startAngle, style.endAngle);
        props.context.fill();
    }
}

export default circleRender;