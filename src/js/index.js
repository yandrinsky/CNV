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
import Store from "./Store";
import state from "./analyzeGraph/analyzeState";
import { BRANCHES, LINE_WIDTH, STACK_LIMIT, SHOW_PATH,
    CONTROL_SUM_WARNING, STACK, SHOW_CYCLES, SHOW_PRIORITIES,
    START_POWER, NUMERIC_POWER, LINE_DIVISION, LINE_WIDTH_MIN,
    LOOPS, MERGES, FINISH_LIMITS  } from "./SETTINGS";

const canvas = document.querySelector("#canvas");
const delLineBtn = document.querySelector("#delLine");
const recoverBtn = document.querySelector("#recover");
const analyzeBtn = document.querySelector("#analyze");
const modeField = document.querySelector("#mode");
const savedCodeField = document.querySelector(".saved_code");
const saveBtn = document.querySelector("#save");
const stackBtn = document.querySelector("#stack");
const info = document.querySelector("#info");
const settings = document.querySelector("#settings");

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 100;



let context = canvas.getContext("2d");

//Инициализация библиотеки CNV

//Базовая настройка
CNV.setContext(context);
CNV.setCanvas(canvas);
CNV.setCSS(css);
CNV.settings.draggableCanvas = false;
CNV.settings.draggableCanvasObserver = (x, y) => {
    canvas.style.backgroundPositionY = y + "px";
    canvas.style.backgroundPositionX = x + "px";
};

//запуск
CNV.start();

// let background = CNV.createRect({
//     x0: 0,
//     y0: 0,
//     width: canvas.getBoundingClientRect().width,
//     height: canvas.getBoundingClientRect().height,
//     className: "background",
// })


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
            CNV.querySelectorAll(".finishText").forEach(item => item.remove());
            CNV.querySelector("#" + e.target.id + "_text").remove();
            removeEdge(key);
            //охраняем изменения в стек
            store.addToStack(save({dont_save: true}));

            analyze(store.state.lines);
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
    analyze(store.state.lines);
}

analyzeBtn.onclick = e => {
    analyze(store.state.lines);
}

"Object { number_of_branches: 0, number_of_plots: 0, number_of_mergers: 0, number_of_loops: 0 }"

info.onclick = (e) => {
    let i = state.analyzeInfo;
    document.querySelector(".warning").innerHTML = `
        Количество делений: ${i.number_of_branches}, 
        Количество петель: ${i.number_of_loops},
        Количество слияний: ${i.number_of_mergers},
        Количество прямолинейных участков: ${i.number_of_plots},
    `
    document.querySelector(".warning").classList.remove('hidden');
    setTimeout(()=> {
        document.querySelector(".warning").classList.add('hidden');
    }, 7000)
}

settings.onclick = (e) => {
    const li = [];

    for(let i = 0; i < 7; i++) {
        li[i] = document.createElement('li');
        li[i].classList.add("list")
    }

    if(document.querySelectorAll('.list').length === 0){
        li[0].innerHTML = `Выводить предупреждение о контрольной сумме: ${CONTROL_SUM_WARNING}`;
        setting_list.append(li[0]);
        li[1].innerHTML = `Минимальная ширина линии: ${LINE_WIDTH_MIN}`;
        setting_list.append(li[1]);
        li[2].innerHTML = `Ширина линии: ${LINE_WIDTH}`;
        setting_list.append(li[2]);
        li[3].innerHTML = `Коэффициент уменьшения ширины линии: ${LINE_DIVISION}`;
        setting_list.append(li[3]);
        li[4].innerHTML = `Петли разрешены: ${LOOPS}`;
        setting_list.append(li[4]);
        li[5].innerHTML = `Слияния разрешены: ${MERGES}`;
        setting_list.append(li[5]);
        li[6].innerHTML = `Сохранения изменений: ${STACK}`;
        setting_list.append(li[6]);
    }

    document.querySelector(".setting_warning").classList.toggle('hidden');
}

stackBtn.onclick = e => {
    console.log({
        len: Store.stack.len,
        saves: Object.keys(Store.stack),
        current: Store.stack.current,
        stack_limit: Store.stack.stack_limit,
    })
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


