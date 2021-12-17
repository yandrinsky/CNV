import {cssEngine} from "../cssEngine/cssEngine";
import {moveTo} from "../geometry/geometry";
import CNV from "../../library";
//props: link, css, context, shift
function lineRender(props){
    const style = cssEngine(props.css, props.link.classList, props.link.type);
    if(!(style.visibility === "hidden")){
        props.context.beginPath();
        props.context.moveTo(props.link.start.x + props.shift.x, props.link.start.y + props.shift.y);
        if(!props.link.pointer){
            props.context.lineTo(props.link.end.x + props.shift.x, props.link.end.y + props.shift.y);
            props.context.lineWidth = style.lineWidth;
            props.context.strokeStyle = style.color; //config.color;
            props.context.stroke();
        }else{
            const shape = CNV.getElementByUniqueId(props.link.id);
            const equation = shape.system.equation;
            const endPosition = moveTo(equation, -5);
            props.context.lineTo(endPosition.x + props.shift.x, endPosition.y + props.shift.y);
            props.context.lineWidth = style.lineWidth;
            props.context.strokeStyle = style.color; //config.color;
            props.context.stroke();
        }

    }
}

export default lineRender;