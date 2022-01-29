import CNV from "./CNV/library";
import {endCircleClick, resetStickToTailHandler, setStickToTailHandler} from "./eventHandlers";
import store from "./Store";
import save from "./storage/save";
import {STACK} from "./SETTINGS";
import Store from "./Store";
import analyze from "./analyzeGraph/analyze";
import innerLine from "./innerLine";


function drawingLine(data, finishCallback = () => {}){
    function stopDrawing(e){
        let isCollision = false;
        CNV.querySelectorAll(".line").forEach(line => {
            if(data.line !== line){
                if(CNV.lineCollision(data.line, line)) isCollision = true;
            }
        })
        if(isCollision) return;
        e.preventDefault();
        //убирает событие рисования
        store.canvas.removeEventListener("mousemove", drawing);
        //самоуничножается
        store.canvas.removeEventListener("click", stopDrawing);


        data.endCircle.onclick = e => endCircleClick(data, e);
        finishCallback();
        resetStickToTailHandler();
        if(STACK){
            //Сохраняем изменения в стек
            store.addToStack(save({dont_save: true}));
        }

        innerLine(data.line);

        analyze(Store.state.lines);
        CNV.querySelectorAll(".black").forEach(item => {
            item.classList.remove("black");
        })

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