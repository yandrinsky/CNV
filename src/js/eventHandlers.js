import CNV from "./CNV/library";
import store from "./Store";
import {addEdge, createEdge} from "./graphHandlers";
import drawingLine from "./drawingLine";
import {BRANCHES} from "./SETTINGS";

function getBlackPointCoord(line){
    let t = 0.5;
    let x = 0;
    let y = 0;
    let black_point_coord = {
        x: undefined,
        y:undefined,
    }
    x = Math.pow((1 - t), 2)*line.start.x + 2*(1 - t)*t*line.check.x + Math.pow(t, 2)*line.end.x;
    y = Math.pow((1 - t), 2)*line.start.y + 2*(1 - t)*t*line.check.y + Math.pow(t, 2)*line.end.y;
    x = Math.round(x)
    y = Math.round(y)
    black_point_coord.x = x;
    black_point_coord.y = y;
    return black_point_coord;
}

function getCheckCoords(line, mouse){
    let t = 0.5;
    let x = 0;
    let y = 0;
    let check_line_coord = {
        x: undefined,
        y:undefined,
    }
    let flag = false;
    x = (mouse.x - Math.pow((1 - t), 2)*line.start.x - Math.pow(t, 2)*line.end.x)/(2*(1-t)*t);
    y = (mouse.y - Math.pow((1 - t), 2)*line.start.y - Math.pow(t, 2)*line.end.y)/(2*(1-t)*t);
    x = Math.round(x)
    y = Math.round(y)
    check_line_coord.x = x;
    check_line_coord.y = y;
    return check_line_coord;
}

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
    let coordinates = e.target.system.moveTo(e.target.system.length / 2, e.target.system.coordinates.x1);
    CNV.createText({
        x0: coordinates.x,
        y0: coordinates.y,
        text: store.state.lines[e.target.id]?.power?.getStr(),
        id: e.target.id + "_text",
        className: "finishText2",
    })
}

function lineMouseLeave(data, e){
    e.target.classList.remove("black");
    if(data.children.length === 0){
        data.endCircle.classList.add("hidden");
    }
    CNV.querySelector("#" + e.target.id + "_text")?.remove();
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
    if(data.children.length < BRANCHES){
        CNV.querySelectorAll(".finishText").forEach(el => el.remove());
        CNV.querySelectorAll(".finishText2").forEach(el => el.remove());

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

    currentData.startCircle.onmouseenter = undefined;
    currentData.startCircle.onmouseleave = undefined;
    currentData.startCircle.onclick = undefined;

    for(let key in store.state.lines){
        let data = store.state.lines[key];


        if(data.ids.line !== currentData.ids.line){
            if(data.parents.length > 0){
                data.line.onmouseenter = e => {
                    e.target.classList.add("stickyLine");
                }
                data.line.onmouseleave = e => {
                    e.target.classList.remove("stickyLine");
                }
                setTimeout(()=> {
                    data.line.onclick = e => {
                        data.line.classList.remove("stickyLine");

                        let coords;
                        if(data.line.link.start.x === data.line.link.check.x && data.line.link.start.y === data.line.link.check.y){
                            coords = data.line.system.moveTo(data.line.system.length / 2, data.line.system.coordinates.x1);
                        } else {
                            coords = getBlackPointCoord({
                                start: data.line.link.start,
                                end: data.line.link.end,
                                check: data.line.link.check,
                            })
                        }

                        currentData.line.update.endPosition.x = coords.x;
                        currentData.line.update.endPosition.y = coords.y;
                        currentData.endCircle.update.startPosition.x = coords.x;
                        currentData.endCircle.update.startPosition.y = coords.y;



                        currentData.endCircle.classList.add("hidden");
                        currentData.__NOT_CIRCLE = true;

                        data.parents.push(currentData);
                        data.sideIn.push(currentData);
                        addEdge(currentData, data);
                    }
                }, 10);
            } else {
                data.startCircle.onmouseenter = e => {
                    e.target.classList.add("startCircleActive");
                    e.target.classList.remove("hidden");
                }
                data.startCircle.onmouseleave = e => {
                    e.target.classList.remove("startCircleActive");
                    e.target.classList.add("hidden");
                }
                setTimeout(()=> {
                    data.line.onclick = e => {
                        data.line.classList.remove("stickyLine");
                        const coords = data.line.system.coordinates;
                        currentData.line.update.endPosition.x = coords.x1;
                        currentData.line.update.endPosition.y = coords.y1;
                        currentData.endCircle.update.startPosition.x = coords.x1;
                        currentData.endCircle.update.startPosition.y = coords.y1;
                        currentData.endCircle.classList.remove("hidden");

                        data.parents.push(currentData);
                        addEdge(currentData, data)

                    }
                }, 10);
            }
        }

    }
}

export {
    lineMouseEnter, lineMouseLeave, endCircleMouseEnter, endCircleMouseLeave, setAllEndCircleClick,
    resetAllEndCircleClick, endCircleClick, setStickToTailHandler, resetStickToTailHandler, getCheckCoords, getBlackPointCoord
}