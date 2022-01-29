import store from "./Store";
import CNV from "./CNV/library";
import uniqueId from "./CNV/uniqueId";
import {endCircleMouseEnter, endCircleMouseLeave, lineMouseEnter, lineMouseLeave} from "./eventHandlers";
import {LINE_WIDTH} from "./SETTINGS";

//функция для добавбления ребёнка к родителю
function addEdge(parent, children){
    parent.children.push(children);
    if(!parent.__NOT_CIRCLE){
        parent.endCircle.classList.remove("hidden");
    } else {
        parent.endCircle.classList.remove("hidden");
        parent.endCircle.classList.add("stickyCircle");
    }
}


function removeEdge(key){
    let data = store.state.lines[key]
    //при удалении элемента CNV удаляет и его слушатели событий
    data.line.remove()
    CNV.querySelector("#" + data.line.id + "_innerLine")?.remove();
    data.startCircle.remove();
    data.endCircle.remove();

    //удаляем у родителей в детях этот элемент
    if(data.parents.length > 0){
        data.parents.forEach(item => {
            item.children.splice(item.children.indexOf(data), 1)
            if(item.children.length === 0){  //если у родителя кончились дети, скрываем его кружочек
                item.endCircle.classList.add("hidden");
            }
        })
    }
    //удаляем у детей в родителях этот элемент
    if(data.children.length > 0){
        data.children.forEach(item => {
            item.parents.splice(item.parents.indexOf(data), 1);
            if(item.sideIn.includes(data)){
                item.sideIn.splice(item.sideIn.indexOf(data), 1);
            }
        })
    }

    delete store.state.lines[key];
}

function createEdge(e, option = {}){
    let line = CNV.createLine({
        x0: option.x0 || e.clientX,
        y0: option.y0 || e.clientY,
        x1: option.x0 || e.clientX,
        y1: option.y0 || e.clientY,
        className: "line",
    })
    line.style.lineWidth = LINE_WIDTH;


    let startCircle = CNV.createCircle({
        x0: option.x0 || e.clientX,
        y0: option.y0 || e.clientY,
        className: ["startCircle", "hidden"],
    })
    let endCircle = CNV.createCircle({
        x0: option.x0 || e.clientX,
        y0: option.y0 || e.clientY,
        className: ["endCircle", "hidden"],

    })
    endCircle.style.radius = line.style.lineWidth / 2;
    startCircle.style.radius = line.style.lineWidth / 2;

    //line.pointer = true;

    let data = {
        line,
        startCircle,
        endCircle,
        parents: [],
        children: [],
        sideIn: [],
        ids: {
            line: line.id,
            endCircle: endCircle.id,
            startCircle: startCircle.id,
        },
        id: uniqueId(),
    }

    line.onmouseenter = e => lineMouseEnter(data, e);
    line.onmouseleave = e => lineMouseLeave(data, e);
    endCircle.onmouseenter = e => endCircleMouseEnter(e);
    endCircle.onmouseleave = e => endCircleMouseLeave(e);

    store.state.lines[line.id] = data;
    return data;
}

export {addEdge, removeEdge, createEdge}