import CNV from "./CNV/library";
import store from "./Store";
import {addEdge, createEdge} from "./graphHandlers";
import drawingLine from "./drawingLine";

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
    //вести можно только 2 линии, не больше
    if(data.children.length < 2){
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
        data.startCircle.onmouseenter = e => undefined;
        data.startCircle.onmouseleave = e => undefined
        data.startCircle.classList.add("hidden");
        data.startCircle.classList.remove("startCircleActive");
        data.startCircle.onclick = e => undefined;
    }
}

function setStickToTailHandler(currentData){
    currentData.startCircle.onmouseenter = undefined;
    currentData.startCircle.onmouseleave = undefined;
    currentData.startCircle.onclick = undefined;
    currentData.endCircle.classList.add("hidden");

    for(let key in store.state.lines){
        let data = store.state.lines[key];

        if(data.ids.line !== currentData.ids.line){
            data.startCircle.onmouseenter = e => {
                e.target.classList.add("startCircleActive");
                e.target.classList.remove("hidden");
                CNV.combineRender(() => {
                    CNV.querySelectorAll(".endCircle").forEach(item => {
                        item.classList.add("hidden");
                    })
                })
            }
            data.startCircle.onmouseleave = e => {
                e.target.classList.remove("red");
                e.target.classList.add("hidden");
                CNV.combineRender(() => {
                    for(let key in store.state.lines){
                        let item = store.state.lines[key];
                        if(item.children.length > 0){
                            item.endCircle.classList.remove("hidden");
                        }
                    }
                })
            }
            setTimeout(()=> {
                data.startCircle.onclick = e => {
                    currentData.line.update.endPosition.x = data.startCircle.link.start.x;
                    currentData.line.update.endPosition.y = data.startCircle.link.start.y;
                    currentData.endCircle.update.startPosition.x = data.startCircle.link.start.x;
                    currentData.endCircle.update.startPosition.y = data.startCircle.link.start.y;


                    currentData.endCircle.classList.add("hidden");

                    data.parents.push(currentData);
                    addEdge(currentData, data);
                    for(let key in store.state.lines){
                        let item = store.state.lines[key];
                        if(item.children.length > 0){
                            item.endCircle.classList.remove("hidden");
                        }
                    }
                }
            }, 10);
        }
    }
}

export {
    lineMouseEnter, lineMouseLeave, endCircleMouseEnter, endCircleMouseLeave, setAllEndCircleClick,
    resetAllEndCircleClick, endCircleClick, setStickToTailHandler, resetStickToTailHandler
}