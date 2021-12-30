import CNV from "./CNV/library";
import store from "./Store";
import {addEdge, createEdge} from "./graphHandlers";
import drawingLine from "./drawingLine";
import {branches} from "./SETTINGS";

function resetAllEndCircleClick(){
    Object.keys(store.state.lines).forEach(key => {
        store.state.lines[key].endCircle.onclick = undefined;
    })
}

function setAllEndCircleClick(){
    Object.keys(store.state.lines).forEach(key => {
        store.state.lines[key].endCircle.onclick = e => endCircleClick(store.state.lines[key], e);
    })
}


function lineMouseEnter(data, e){
    e.target.classList.add("black");
    if(data.children.length === 0){
        data.endCircle.classList.remove("hidden");
    }
}

function lineMouseLeave(data, e){
    e.target.classList.remove("black");
    if(data.children.length === 0){
        data.endCircle.classList.add("hidden");
    }
}

function endCircleMouseEnter(e){
    e.target.classList.add("endCircleActive");
}

function endCircleMouseLeave(e){
    e.target.classList.remove("endCircleActive");
}

function endCircleClick(data, e){
    CNV.settings.draggableCanvas = false;
    CNV.querySelectorAll(".finishLine").forEach(el => el.classList.remove("finishLine"));

    //Против бага, что после нажатия линия остаётся чёрной
    data.line.classList.remove("black");

    //вести можно только 2 линии, не больше
    if(data.children.length < branches){
        //после того, как начали вести линию сбрасываем у всех круглешков событие нажатия
        resetAllEndCircleClick();
        //создаём новуб линию и указываем ей коорлинаты начала как у круга, по которому кликнули
        const newData = createEdge(e, {
            x0: data.endCircle.link.start.x,
            y0: data.endCircle.link.start.y,
        });
        newData.parents.push(data) ;
        addEdge(data, newData);

        newData.line.onmouseenter = undefined;
        newData.line.onmouseleave = undefined;
        //запускаем процесс построения линии за движением мыши;
        drawingLine(newData, ()=> {
            setAllEndCircleClick();
            newData.line.onmouseenter = e => lineMouseEnter(newData, e);
            newData.line.onmouseleave = e => lineMouseLeave(newData, e);
            setTimeout(()=> {
                CNV.settings.draggableCanvas = true;
            }, 100)
        });
    }
}
function resetStickToTailHandler(){
    for(let key in store.state.lines){
        let data = store.state.lines[key];
        data.line.onmouseenter = e => lineMouseEnter(data, e);
        data.line.onmouseleave = e => lineMouseLeave(data, e);
        //data.startCircle.classList.add("hidden");
        //data.startCircle.classList.remove("startCircleActive");
        data.line.onclick = e => undefined;
    }
}

function setStickToTailHandler(currentData){
    currentData.line.onmouseenter = undefined;
    currentData.line.onmouseleave = undefined;
    currentData.line.onclick = undefined;

    for(let key in store.state.lines){
        let data = store.state.lines[key];

        if(data.ids.line !== currentData.ids.line){
            data.line.onmouseenter = e => {
                e.target.classList.add("stickyLine");
            }
            data.line.onmouseleave = e => {
                e.target.classList.remove("stickyLine");
            }
            setTimeout(()=> {
                data.line.onclick = e => {
                    data.line.classList.remove("stickyLine");
                    currentData.line.update.endPosition.x = e.x;
                    currentData.line.update.endPosition.y = data.line.system.getCoordinatesY(e.x);
                    currentData.endCircle.update.startPosition.x = e.x;
                    currentData.endCircle.update.startPosition.y = data.line.system.getCoordinatesY(e.x);
                    currentData.endCircle.classList.add("hidden");
                    currentData.__NOT_CIRCLE = true;

                    data.parents.push(currentData);
                    addEdge(currentData, data);
                    // for(let key in store.state.lines){
                    //     let item = store.state.lines[key];
                    //     if(item.children.length > 0 && !item.__NOT_CIRCLE){
                    //         item.endCircle.classList.remove("hidden");
                    //     }
                    // }
                }
            }, 10);
        }
    }
}

export {
    lineMouseEnter, lineMouseLeave, endCircleMouseEnter, endCircleMouseLeave, setAllEndCircleClick,
    resetAllEndCircleClick, endCircleClick, setStickToTailHandler, resetStickToTailHandler
}