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
    let test = false;
    const input = [];
    const select = document.createElement('select');
    const option = [];
    const ul = document.createElement('ul');
    ul.id = "setting_list";
    document.querySelector(".setting_warning").prepend(ul);
    select.name = 'FINISH_LIMITS'
    select.classList.add("select");
    for(let i = 0; i < 3; i++) option[i] = document.createElement('option');
    option[0].value = 'No';
    option[1].value = 'Number';
    option[2].value = 'Arr';
    option[0].innerHTML = 'Нет';
    option[1].innerHTML = 'Число';
    option[2].innerHTML = 'Диапазон';
    if(FINISH_LIMITS === false) option[0].selected = true;
    else if(FINISH_LIMITS.length > 1) option[2].selected = true;
    else option[1].selected = true;

    for(let i = 0; i < 8; i++) {
        input[i] = document.createElement('input');
        input[i].classList.add("input_setting");
        li[i] = document.createElement('li');
        li[i].classList.add("list");
    }

    input[0].type = "checkbox";
    input[4].type = "checkbox";
    input[5].type = "checkbox";
    input[1].type = "text";
    input[2].type = "text";
    input[3].type = "text";
    input[6].type = "text";
    input[7].type = "text";

    if(document.querySelectorAll('.list').length === 0){
        li[0].innerHTML = `Выводить предупреждение о контрольной сумме: `;
        setting_list.append(li[0]);
        if (CONTROL_SUM_WARNING) input[0].checked = true;
        li[0].append(input[0]);
        li[1].innerHTML = `Минимальная ширина линии: `;
        setting_list.append(li[1]);
        input[1].value = LINE_WIDTH_MIN;
        li[1].append(input[1]);
        li[2].innerHTML = `Ширина линии: `;
        setting_list.append(li[2]);
        input[2].value = LINE_WIDTH;
        li[2].append(input[2]);
        li[3].innerHTML = `Коэффициент уменьшения ширины линии: `;
        setting_list.append(li[3]);
        input[3].value = LINE_DIVISION;
        li[3].append(input[3]);
        li[4].innerHTML = `Петли разрешены: `;
        setting_list.append(li[4]);
        if (LOOPS) input[4].checked = true;
        li[4].append(input[4]);
        li[5].innerHTML = `Слияния разрешены: `;
        setting_list.append(li[5]);
        if (MERGES) input[5].checked = true;
        li[5].append(input[5]);
        li[6].innerHTML = `Количество стоков: `;
        setting_list.append(li[6]);
        li[6].append(select);
        select.append(option[0]);
        select.append(option[1]);
        select.append(option[2]);
    }
    select.onclick= () => {
        input[6].remove();
        input[7].remove();
        if(option[1].selected){
            if(FINISH_LIMITS !== false && FINISH_LIMITS.length !== 2)input[6].value = FINISH_LIMITS;
            else input[6].value = "";
            input[6].classList.add("input_select");
            li[6].append(input[6]);
        }
        else if(option[2].selected){
            input[6].value = FINISH_LIMITS[0];
            input[7].value = FINISH_LIMITS[1];
            input[6].classList.add("input_select");
            li[6].append(input[6]);
            input[7].classList.add("input_select");
            li[6].append(input[7]);
        }
    }
    save_setting.onclick = (e) => {
        CONTROL_SUM_WARNING = input[0].checked;
        LINE_WIDTH_MIN = input[1].value;
        LINE_WIDTH = input[2].value;
        LINE_DIVISION = input[3].value;
        LOOPS = input[4].checked;
        MERGES = input[5].checked;
        if(option[0].selected) FINISH_LIMITS = false;
        else if(option[1].selected) FINISH_LIMITS = input[6].value;
        else if(option[2].selected) FINISH_LIMITS = [input[6].value, input[7].value];
    }

    reset.onclick = (e) =>{
        if(FINISH_LIMITS === false) option[0].selected = true;
        else if(FINISH_LIMITS.length > 1) option[2].selected = true;
        else option[1].selected = true;
        input[6].remove();
        input[7].remove();
        if (CONTROL_SUM_WARNING) input[0].checked = true;
        else input[0].checked = false;
        if (LOOPS) input[4].checked = true;
        else input[4].checked = false;
        if (MERGES) input[5].checked = true;
        else input[5].checked = false;
        input[1].value = LINE_WIDTH_MIN;
        input[2].value = LINE_WIDTH;
        input[3].value = LINE_DIVISION;
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


