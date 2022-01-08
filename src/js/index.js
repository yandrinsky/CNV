import "../css/style.css"
import css from "./css";
import CNV from "./CNV/library";
import analyze from "./analyzeGraph/analyze";
import save from "./storage/save";
import {
     setAllEndCircleClick,
    resetAllEndCircleClick,
} from "./eventHandlers";
import {removeEdge, createEdge} from "./graphHandlers";
import drawingLine from "./drawingLine";
import {shiftDownHandler} from "./shiftHandlers";

import store from "./Store";
import recover from "./storage/recover";
import zHandlers from "./zHandlers";

const canvas = document.querySelector("#canvas");
const delLineBtn = document.querySelector("#delLine");
const recoverBtn = document.querySelector("#recover");
const analyzeBtn = document.querySelector("#analyze");
const modeField = document.querySelector("#mode");
const savedCodeField = document.querySelector(".saved_code");
const saveBtn = document.querySelector("#save");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 100;



let context = canvas.getContext("2d");

//Инициализация библиотеки CNV
CNV.setContext(context);
CNV.setCanvas(canvas);
CNV.setCSS(css);
CNV.settings.draggableCanvas = false;
CNV.start();

//Инициализация store
store.setCanvas(canvas);
store.setContext(context);

function setDelMode(){
    CNV.settings.draggableCanvas = false;
    store.state.mode = "del";
    resetAllEndCircleClick();
    canvas.style.cursor = "crosshair";
    modeField.innerHTML = "Режим: удаление";

    for(let key in store.state.lines){
        store.state.lines[key].line.onclick = e => {
            removeEdge(key);
        }
    }

    canvas.onclick = undefined;
}

function setDrawingMode(){
    CNV.settings.draggableCanvas = true;
    if(Object.keys(store.state.lines).length === 0){
        firstDraw();
    }

    store.state.mode = "draw";
    setAllEndCircleClick();
    canvas.style.cursor = "default";
    modeField.innerHTML = "Режим: рисование";

    for(let key in store.state.lines){
        store.state.lines[key].line.onclick = e => undefined;
    }
}

function firstDraw() {
    canvas.onclick = e => {
        const data = createEdge(e);
        canvas.onclick = undefined;
        drawingLine(data, () => {
            canvas.onclick = undefined;
            CNV.settings.draggableCanvas = true;
        })
    }
}

firstDraw();


delLineBtn.onclick = e => {
    if(store.state.mode === "draw"){
        setDelMode();
    } else if(store.state.mode === "del"){
        setDrawingMode();
    }
}

recoverBtn.onclick = e => {
    recover();
}

analyzeBtn.onclick = e => {
    analyze(store.state.lines);
}


saveBtn.onclick = e => {
    saveBtn.classList.remove("saveOk");
    const CNVrecoveryData = CNV.save();
    const SCRIPTrecoveryData = save({});
    const disk = JSON.stringify({
        CNV: CNVrecoveryData,
        SCRIPT: SCRIPTrecoveryData,
    })
    savedCodeField.value = disk;
    savedCodeField.select();

    document.execCommand("copy");
    saveBtn.classList.add("saveOk");
    setTimeout(()=> {
        saveBtn.classList.remove("saveOk");
    }, 1000)
}

window.addEventListener("keydown", shiftDownHandler);

window.onresize = (e) => {
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 100;
    CNV.render();
}
zHandlers();

CNV.curve("black");


window.addEventListener("mousemove", e => {
    let mouse = {x: e.clientX, y: e.clientY};
    let line = {
        start: {x: 188, y: 150},
        end: {x: 388, y: 200},
        check: {x: 10, y: 10}
    }
    if(inInLine(line, mouse)){
        CNV.curve("red");
    } else {
        CNV.curve("black");
    }
})


function inInLine(){

}