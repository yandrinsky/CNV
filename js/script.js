const canvas = document.querySelector("#canvas");
const delLineBtn = document.querySelector("#delLine");
const recoverBtn = document.querySelector("#recover");
const analyzeBtn = document.querySelector("#analyze");
const modeField = document.querySelector("#mode");
const savedCodeField = document.querySelector(".saved_code");
const saveBtn = document.querySelector("#save");
canvas.width = 700;
canvas.height = 700;
let context = canvas.getContext("2d");



CNV.setContext(context);
CNV.setCanvas(canvas);
CNV.setCSS(css);

const store = {
    state: {
        delMode: false,
        mode: "draw", //draw, del
        deletingIndex: undefined, //индекс текущего удаляемого элемента (обновляется при наведении)
        isDragging: false,
        lines: {},  //id: {line, startCircle, endCircle, children: [], parents: [], ids: {line, startCircle, endCircle}}
    },
    changeMode(mode){
        if(mode === "draw" || mode === "del"){
            this.state.mode = mode;
            modeField.innerHTML = "Mode: " + mode;

        } else {
            throw new Error("can't set mode " + mode);
        }
    }
}

function setDelMode(){
    store.state.mode = "del";
    resetAllEndCircleClick();
    canvas.style.cursor = "crosshair";
    modeField.innerHTML = "Mode: deleting";

    for(let key in store.state.lines){
        store.state.lines[key].line.onclick = e => {
            let data = store.state.lines[key]
            //при удалении элемента CNV удаляет и его слушатели событий
            data.line.remove();
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
                data.children.forEach(item => item.parents.splice(item.parents.indexOf(data), 1))
            }


            delete store.state.lines[key];
        }
    }

    canvas.onclick = undefined;
}

function setDrawingMode(){

    if(Object.keys(store.state.lines).length === 0){
        console.log("full dell")
        firstDraw();
    }

    store.state.mode = "draw";
    setAllEndCircleClick();
    canvas.style.cursor = "default";
    modeField.innerHTML = "Mode: drawing";

    for(let key in store.state.lines){
        store.state.lines[key].line.onclick = e => undefined;
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
                CNV.querySelectorAll(".endCircle").forEach(item => {
                    item.classList.add("hidden");
                })
            }
            data.startCircle.onmouseleave = e => {
                e.target.classList.remove("red");
                e.target.classList.add("hidden");
                for(let key in store.state.lines){
                    let item = store.state.lines[key];
                    if(item.children.length > 0){
                        item.endCircle.classList.remove("hidden");
                    }
                }
            }
            setTimeout(()=> {
                data.startCircle.onclick = e => {
                    currentData.line.update.endPosition.x = currentData.endCircle.link.start.x;
                    currentData.line.update.endPosition.y = currentData.endCircle.link.start.y;
                    data.parents.push(currentData);
                    addChildren(currentData, data);
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

//функция для добавбления ребёнка к родителю
function addChildren(parent, children){
    parent.children.push(children);
    parent.endCircle.classList.remove("hidden");
}


//событие нажатия на круглешок линии - чтобы повести новую линию
function endCircleClick(data, e){
    CNV.querySelectorAll(".finishLine").forEach(el => el.classList.remove("finishLine"));
    //вести можно только 2 линии, не больше
    if(data.children.length < 2){
        //после того, как начали вести линию сбрасываем у всех круглешков событие нажатия
        resetAllEndCircleClick();
        //создаём новуб линию
        const newData = createLine(e);
        newData.parents.push(data) ;
        addChildren(data, newData);

        newData.line.onmouseenter = undefined;
        newData.line.onmouseleave = undefined;
        //запускаем процесс построения линии за движением мыши;
        drawingLine(newData, ()=> {
            setAllEndCircleClick();
            newData.line.onmouseenter = e => lineMouseEnter(newData, e);
            newData.line.onmouseleave = e => lineMouseLeave(newData, e);
        });
    }
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

function endCircleMouseEnter(data, e){
    e.target.classList.add("endCircleActive");
}

function endCircleMouseLeave(data, e){
    e.target.classList.remove("endCircleActive");
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

function drawingLine(data, finishCallback = () => {}){
    function stopDrawing(e){
        e.preventDefault();
        //убирает событие рисования
        canvas.removeEventListener("mousemove", drawing);
        //самоуничножается
        canvas.removeEventListener("click", stopDrawing);


        data.endCircle.onclick = e => endCircleClick(data, e);
        finishCallback();
        resetStickToTailHandler();
    }

    function drawing(e){
        data.line.update.endPosition.x = e.clientX;
        data.line.update.endPosition.y = e.clientY;
        data.endCircle.update.startPosition.x = e.clientX;
        data.endCircle.update.startPosition.y = e.clientY;
    }


    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("click", stopDrawing);
    setStickToTailHandler(data);
}

function createLine(e){
    let line = CNV.createLine({
        x0: e.clientX,
        y0: e.clientY,
        x1: e.clientX,
        y1: e.clientY,
        className: "red",
    })
    let startCircle = CNV.createCircle({
        x0: e.clientX,
        y0: e.clientY,
        className: ["red", "hidden"],
    })
    let endCircle = CNV.createCircle({
        x0: e.clientX,
        y0: e.clientY,
        className: ["endCircle", "hidden"],

    })

    let data = {
        line,
        startCircle,
        endCircle,
        parents: [],
        children: [],
        ids: {
            line: line.id,
            endCircle: endCircle.id,
            startCircle: startCircle.id,
        }
    }


    line.onmouseenter = e => lineMouseEnter(data, e);
    line.onmouseleave = e => lineMouseLeave(data, e);
    endCircle.onmouseenter = e => endCircleMouseEnter(data, e);
    endCircle.onmouseleave = e => endCircleMouseLeave(data, e);

    store.state.lines[line.id] = data;
    return data;
}



function firstDraw() {
    canvas.onclick = e => {
        const data = createLine(e);
        canvas.onclick = undefined;
        drawingLine(data, () => {
            canvas.onclick = undefined;
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
    analyze();
}
function save(){
    const prepData = {...store.state, lines: {}};
    for(let key in store.state.lines){
        let data = store.state.lines[key];
        let children = [];
        let parents = [];
        data.children.forEach(item => {
            children.push(item.line.id);
        })
        data.parents.forEach(item => {
            parents.push(item.line.id);
        })
        prepData.lines[key] = {
            ...data,
            line: data.line.id,
            endCircle: data.endCircle.id,
            startCircle: data.startCircle.id,
            children,
            parents,
        }
    }

    const saved = JSON.stringify({
        SCRIPT: JSON.stringify(prepData),
        CNV: CNV.save(),
    });
    localStorage.setItem("__saved", saved);
    return saved;
}

function recover(data){
    const disk = JSON.parse(data || localStorage.getItem("__saved"));
    CNV.recover(disk.CNV);
    let script = JSON.parse(disk.SCRIPT);
    for(let key in script.lines){
        let item = script.lines[key];
        item.line = CNV.getElementByUniqueId(item.line);
        item.endCircle = CNV.getElementByUniqueId(item.endCircle);
        item.startCircle = CNV.getElementByUniqueId(item.startCircle);
        item.children = item.children.map(id => {
            return script.lines[id];
        })
        item.parents = item.parents.map(id => {
            return script.lines[id];
        })

        item.line.onmouseenter = e => lineMouseEnter(item, e);
        item.line.onmouseleave = e => lineMouseLeave(item, e);
        item.endCircle.onmouseenter = e => endCircleMouseEnter(item, e);
        item.endCircle.onmouseleave = e => endCircleMouseLeave(item, e);
        item.endCircle.onclick = e => endCircleClick(item, e);
    }
    if(Object.keys(script.lines).length > 0){
        canvas.onclick = undefined;
    }
    store.state = script;
}

function analyze(){
    CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
    let startLines = [];
    let results = {};

    for(let key in store.state.lines){
        if(store.state.lines[key].parents.length === 0){
            startLines.push(store.state.lines[key])
        }
    }
    if(startLines.length > 1){
        console.error("Граф имеет разрывы. Анализ невозможен");
        console.log(startLines)
        return;
    }
    function step(target, power){
        target.power = power;
        let fullPower = 0;

        for(let i = 0; i < target.parents.length; i++){
            let item = target.parents[i];
            if(item.power) {
                fullPower += item.power / item.children.length;
            }
            // } else {
            //     console.log("returned")
            //     return;
            // }
        }

        if(fullPower){
            target.power = fullPower;
        }


        if(target.children.length === 0){
            CNV.preventRender(() => target.line.classList.add("finishLine"));
            results[target.ids.line] = {
                text: 1 + "/" + 1 / (fullPower || target.power),
                x: target.endCircle.link.start.x + 10,
                y: target.endCircle.link.start.y - 10,
                fontSize: "14",
                color: "green",
            }
            // results.push({
            //     text: 1 + "/" + 1 / (fullPower || target.power),
            //     x: target.endCircle.link.start.x + 10,
            //     y: target.endCircle.link.start.y - 10,
            //     fontSize: "14",
            //     color: "green",
            // });
            console.log("finishZone", fullPower || target.power);
        }
        target.children.forEach(item => {
            step(item, power / target.children.length)
        })
    }
    try{
        step(startLines[0], 1);
        CNV.render();
        for(let key in results){
            CNV.text(results[key])
        }
        // results.forEach(result => CNV.text(result));
        for(let key in store.state.lines){
            store.state.lines[key].power = undefined;
        }
    } catch (e){
        console.error("Граф замкнут. Анализ невозможен", e);
    }

}

saveBtn.onclick = e => {
    saveBtn.classList.remove("saveOk");
    const CNVrecoveryData = CNV.save();
    const SCRIPTrecoveryData = save();
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


smth();