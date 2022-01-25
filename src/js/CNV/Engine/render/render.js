import {cssIndex} from "../cssEngine/cssEngine";
import clearCanvas from "./clearCanvas";
import lineRender from "./lineRender";
import circleRender from "./circleRender";
import pointersRender from "./pointersRender";
import textRender from "./textRender";
import rectRender from "./rectRender";



//props: elements, css, context, canvas, shift
function render(props){
    clearCanvas({
        backgroundColor: "white",
        context: props.context,
        canvas: props.canvas,
    })

    const preRender = cssIndex(props.css, props.elements);

    preRender.keys.forEach(key => {
        let shapes = preRender.shapes[key];
        shapes.forEach(shape => {
            let config = {
                link: shape,
                context: props.context,
                css: props.css,
                shift: props.shift,
                zoom: props.zoom,
            }
            if(shape.type === "line") lineRender(config);
            else if(shape.type === "circle") circleRender(config);
            else if(shape.type === "text") textRender(config);
            else if (shape.type === "rect") rectRender(config)
            else if(shape.type === "__POINTERS_RENDER") pointersRender(config);
        })
    })





}

export default render;