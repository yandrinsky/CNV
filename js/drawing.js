function drawLines(lines) {
    lines.forEach(line => {
        CNV.line({
            x0: line.start.x,
            y0: line.start.y,
            x1: line.end.x,
            y1: line.end.y,
            color: "red",
            lineWidth: 5,
        })

        if(line.circle){
            CNV.circle({
                x0: line.end.x,
                y0: line.end.y,
                color: "red",
                radius: 10,
            })
        }

    })
}
//пб добавить отрисовку и текущей рисуемой линии
function redraw(lines){
    console.log("redraw")
    context.beginPath();
    context.moveTo(0, 0);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawLines(lines);
}
let dev = 0;
function draw(e, start){
    console.log("draw")
    let {top, left} = window.canvas.getBoundingClientRect();
    const state = store.state
    if(dev){
        debugger
    }

    redraw(state.lines);

    //рисование так, без вызова лишней обёрточной функции будет быстрее. Потому оставлю так
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(e.clientX - left, e.clientY - top);
    context.strokeStyle = "red";
    context.stroke();

    state.lastDrewPoint.x = e.clientX - left;
    state.lastDrewPoint.y = e.clientY - top;
}

function addNewLine(start, end, parentLine){
    const line = {
        start,
        end,
        circle: false,
        parent: parentLine,
        children: [],
    }

    //доавбляем в список линий
    store.state.lines.push(line);
    //добавляем в дети родителя (у первого элемента нет родителя)
    if(parentLine){
        parentLine.children.push(line);
        parentLine.circle = true;
    }
}

function stopDrawing(){
    window.canvas.removeEventListener("mousemove", stickToHead);
    window.canvas.onmousemove = undefined;
    store.state.toggle = false;
    store.state.isDragging = false;
}
