import {cssIndex} from "../cssEngine/cssEngine";
import clearCanvas from "./clearCanvas";
import lineRender from "./lineRender";
import circleRender from "./circleRender";
import pointersRender from "./pointersRender";

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
            if(shape.type === "line") lineRender({
                link: shape,
                context: props.context,
                css: props.css,
                shift: props.shift,
            });
            else if(shape.type === "circle") circleRender({
                link: shape,
                context: props.context,
                css: props.css,
                shift: props.shift,
            });
        })
    })



    pointersRender({
        context: props.context,
        shift: props.shift,
    });

}

export default render;