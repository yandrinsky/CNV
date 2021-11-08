const canvas = document.querySelector("#canvas");
const delLineBtn = document.querySelector("#delLine");
const modeField = document.querySelector("#mode");
canvas.width = 500;
canvas.height = 500;
let context = canvas.getContext("2d");
context.strokeStyle = "red"

const shift = {
    top: window.canvas.getBoundingClientRect().top,
    left: window.canvas.getBoundingClientRect().left
}

function deleting(){
    const state = store.state;

    const line = state.lines[state.deletingIndex];
    const parent = line.parent;

    if(parent && parent !== "deleted"){
        const parentIndex = parent.children?.indexOf(line);
        //убираем элемент из детей отца
        parent.children?.splice(parentIndex, 1);
        //если у родителя нет детей, убираем его круг
        if(parent.children.length === 0){
            parent.circle = false;
        }
    }

    //убираем элемент из родителя детей
    line.children.forEach(line => {
        if(line) line.parent = "deleted";
    })

    //вырезаем сам элемент
    state.lines.splice(state.deletingIndex,1);



    //перерисовываем холст
    redraw(state.lines);

}


//вызывается по нажатию кнопки удаления. Переход в режим удаления: по наведению и клику по линии произойдёт delete.
function delLine(e){
    return isInLine(e, (line)=>{
        store.state.deletingIndex = store.state.lines.indexOf(line)
        canvas.addEventListener("click", deleting);
    })
}

function delLineHandler(){
    if(store.state.mode === "draw"){
        store.changeMode("del");
        document.body.style.cursor = "crosshair"
        window.canvas.onclick = undefined;
        canvas.addEventListener("mousemove",  delLine)
    } else {
        store.changeMode("draw");
        document.body.style.cursor = "default"
        canvas.removeEventListener("click", deleting);
        window.canvas.onclick = click;
        canvas.removeEventListener("mousemove",  delLine)
    }

}


function isInLine(e, callbackSuccess, callbackFail){
    const state = store.state;
    let x0 = e.clientX
    let y0 = e.clientY

    let successHandlers = [];
    let failHandlers = [];

    for(let i = 0; i < state.lines.length; i++){
        //заполняем хендлеры
        successHandlers = [];
        failHandlers = [];

        if(callbackSuccess) successHandlers.push(callbackSuccess.bind(this, state.lines[i]));

        //при наведении на линию, она всегда должна подсвечиваться. Потому выновим отдельно этот handler
        successHandlers.push(CNV.line.bind(CNV, {
            x0: state.lines[i].start.x,
            y0: state.lines[i].start.y,
            x1: state.lines[i].end.x,
            y1: state.lines[i].end.y,
            color: "black"
        }));


        if(callbackFail) failHandlers.push(callbackFail.bind(this, state.lines[i]));

        let result = CNV.nearLine(
            {
                distance: 10,
                userX: x0,
                userY: y0,
                x1: state.lines[i].start.x,
                y1: state.lines[i].start.y,
                x2: state.lines[i].end.x,
                y2: state.lines[i].end.y,
            },
            successHandlers,
            failHandlers,
        )


        if(result) break;
    }

}

function stickToHead(e){
    let x = e.clientX
    let y = e.clientY
    const state = store.state;

    for(let i = 0; i < state.lines.length; i++){
        // let headX = state.lines[i].end.x;
        // let headY = state.lines[i].end.y;
        let headX = state.lines[i].start.x;
        let headY = state.lines[i].start.y;

        let distance = 10;
        if(state.lines[i] !== state.startLine[2]){ //state.lines[i] !== state.startLine
            if((x < headX + distance && x > headX - distance) && (y < headY + distance && y > headY - distance) && state.lines[i].children.length < 2){
                console.log("i is ", i);
                console.log("stickToHead", headX, headY, x, y)
                CNV.circle({
                    x0: headX,
                    y0: headY,
                    radius: 10,
                })

                console.log("stickToHead");

                // state.startLine[1].x = headX
                // state.startLine[1].y = headY

                console.log("----")
                state.lines.forEach(line => {
                    console.log("sX, sY, eX, eY", line.start.x, line.start.y, line.end.x, line.end.y)
                })
                addNewLine({x: state.startLine[0].x, y: state.startLine[0].y}, {x: headX, y: headY}, state.startLine[2]);
                console.log(state.lines);
                state.lines.forEach(line => {
                    console.log("sX, sY, eX, eY", line.start.x, line.start.y, line.end.x, line.end.y)
                })
                console.log("----")
                stopDrawing();


                redraw(state.lines);

                break;
            }
        }

    }

}



// let line1 = CNV.createLine({
//     x0: 0,
//     y0: 0,
//     x1: 100,
//     y1: 100,
//     className: "red",
// })
//
// let line2 = CNV.createLine({
//     x0: 0,
//     y0: 150,
//     x1: 100,
//     y1: 150,
//     className: "red",
// })
//
// line1.onmouseenter = (e) => {
//     circle1.classList.remove("hidden");
//     e.target.classList.add("black");
// }
// //
// line1.onmouseleave = (e) => {
//     circle1.classList.add("hidden");
//     e.target.classList.remove("black");
// }
//
//
// line2.onmouseenter = (e) => {
//     e.target.classList.add("green")
//     canvas.style.cursor = "pointer"
// }
// //
// line2.onmouseleave = (e) => {
//     e.target.classList.remove("green")
//     canvas.style.cursor = "default"
// }
//
// line1.onclick = e => {
//     console.log("click line 1");
// }
//
// let circle1 = CNV.createCircle({
//     x0: 100,
//     y0: 100,
//     className: ["hidden", "red"]
// })
//
// circle1.onmouseenter = e => {
//     e.target.classList.add("black");
// }
//
// circle1.onmouseleave = e => {
//     e.target.classList.remove("black");
// }
// let line3;
// circle1.onclick = e => {
//     line3 = CNV.createLine({
//         x0: circle1.link.start.x,
//         y0: circle1.link.start.y,
//         x1: circle1.link.start.x,
//         y1: circle1.link.start.y,
//     })
//     canvas.onmousemove = e => {
//         line3.update.endPosition.x = e.clientX;
//         line3.update.endPosition.y = e.clientY;
//     }
//     canvas.onclick = e => {
//         canvas.onmousemove = undefined;
//         canvas.onclick = undefined;
//     }
// }


CNV.setContext(context);
CNV.setCanvas(canvas);
CNV.setCSS(css);

const store = {
    state: {
        delMode: false,
        mode: "draw",
        deletingIndex: undefined, //индекс текущего удаляемого элемента (обновляется при наведении)
        isDragging: false,
        lines: {},  //id: {line, startCircle, endCircle, children: [], parent}
        lastDrewPoint: {x: 10 - shift.left, y: 10 - shift.top}, //координаты последней отрисованной точки (для рисования новой линии)
        toggle: false, //флаг для клика рисования. false - если линия сейчас не рисуется
        startLine: [{}, {}], //массив содержит координаты начала и конца линии, которая сейчас,
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

function drawingLine(data, finishCallback = () => {}){
    function stopDrawing(e){
        e.preventDefault();
        //убирает событие рисования
        canvas.removeEventListener("mousemove", drawing);
        //самоуничножается
        canvas.removeEventListener("click", stopDrawing);
    }
    function drawing(e){
        data.line.update.endPosition.x = e.clientX;
        data.line.update.endPosition.y = e.clientY;
        data.endCircle.update.startPosition.x = e.clientX;
        data.endCircle.update.startPosition.y = e.clientY;
    }
    finishCallback();
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("click", stopDrawing);
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
        className: ["red", "hidden"],
    })

    line.onmouseenter = e => {
        console.log("line.onmouseenter")
        e.target.classList.add("black");
        endCircle.classList.remove("hidden");
    }
    line.onmouseleave = e => {
        console.log("line.onmouseleave")
        e.target.classList.remove("black");
        endCircle.classList.add("hidden");
    }
    endCircle.onmouseenter = e => {
        console.log("endCircle.onmouseenter")
        e.target.classList.add("black");
    }
    endCircle.onmouseleave = e => {
        console.log(" endCircle.onmouseleave")
        e.target.classList.remove("black");
    }

    endCircle.onclick = e => {
        console.log("endCircle.onclick")
        const data = createLine(e);
        drawingLine(data);
    }

    let data = {
        line,
        startCircle,
        endCircle,
        parent: null,
        children: [],
    }
    store.state.lines[line.id] = data;
    return data;
}


canvas.onclick = e => {
    const data = createLine(e);
    drawingLine(data, ()=> {
        canvas.onclick = undefined;
    })

}