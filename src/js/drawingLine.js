import CNV from "./CNV/library";
import {endCircleClick, resetStickToTailHandler, setStickToTailHandler} from "./eventHandlers";
import store from "./Store";

function drawingLine(data, finishCallback = () => {}){
    function stopDrawing(e){
        e.preventDefault();
        //убирает событие рисования
        store.canvas.removeEventListener("mousemove", drawing);
        //самоуничножается
        store.canvas.removeEventListener("click", stopDrawing);


        data.endCircle.onclick = e => endCircleClick(data, e);
        finishCallback();
        resetStickToTailHandler();
    }

    function drawing(e){
        data.line.update.endPosition.x = e.clientX - CNV.state.shift.x;
        data.line.update.endPosition.y = e.clientY - CNV.state.shift.y;
        data.endCircle.update.startPosition.x = e.clientX - CNV.state.shift.x;
        data.endCircle.update.startPosition.y = e.clientY - CNV.state.shift.y;
    }

    store.canvas.addEventListener("mousemove", drawing);
    store.canvas.addEventListener("click", stopDrawing);
    setStickToTailHandler(data);
}

export default drawingLine;