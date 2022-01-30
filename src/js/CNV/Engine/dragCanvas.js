import CNV from "../library";
import {nearDot} from "./geometry/geometry";
import Store from "../Store";

function dragCanvas(){
    function onMouseDown (e){
        if(CNV.state.draggableCanvas){
            for(let i = 0; i < CNV.state.__mouseClickTargets.length; i++){
                let link = CNV.state.__shapes[CNV.state.__mouseClickTargets[i]];
                let res = nearDot({
                    distance: 5,
                    userX: e.clientX,
                    userY: e.clientY,
                    x0: link.start.x + CNV.state.shift.x,
                    y0: link.start.y + CNV.state.shift.y,
                    e: e,
                })
                if(res) return;
            }
            CNV.canvas.style.cursor = "grab"
            CNV.canvas.addEventListener("mousemove", onMouseMove);
        }
    }

    function onMouseUp(e){
        if(CNV.state.draggableCanvas){
            CNV.canvas.style.cursor = "default"
            CNV.canvas.removeEventListener("mousemove", onMouseMove);
        }
    }

    CNV.canvas.addEventListener("mousedown", onMouseDown);
    CNV.canvas.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
        CNV.canvas.style.cursor = "grabbing"
        if(CNV.state.draggableCanvas){
            CNV.state.shift.x += e.movementX;
            CNV.state.shift.y += e.movementY;
            if(Store.draggableCanvasObserver) {
                Store.draggableCanvasObserver(CNV.state.shift.x, CNV.state.shift.y);
            }
            CNV.render();
        }
    }
}

export default dragCanvas;
