function uniqueId(){
    let id = String(Math.random())
    id.replace(".", "");
    return id;
}

class Shape{
    constructor(link, id) {
        this.link = link;
        this.id = id;
        this.isPointer = false;
    }

    get system(){
        const __this = this;
        return {
            get equation(){
                if(__this.link.type === "line"){
                    return getEquationFor2points(
                        __this.link.start.x,
                        __this.link.start.y,
                        __this.link.end.x,
                        __this.link.end.y,
                    )
                }
            }
        }

    }

    get classList(){
        let link = this.link;
        return {
            add(className){
                if(!link.classList.includes(className)){
                    link.classList.push(className)
                    CNV.render();
                }
            },
            remove(className){
                const index = link.classList.indexOf(className);
                if(index !== -1){
                    link.classList.splice(index, 1);
                    CNV.render();
                }
            },
            toggle(className){
                const index = link.classList.indexOf(className);
                if(index){
                    link.classList.splice(index, 1);
                    CNV.render();
                } else {
                    link.classList.push(className);
                    CNV.render();
                }
            },
            contains(className){
                return link.classList.includes(className);
            }
        }
    }


    get update(){
        const link = this.link;
        return {
            get startPosition (){
                return {
                    set x(x){
                        link.start.x = x;
                        CNV.render();
                    },
                    set y(y){
                        link.start.y = y;
                        CNV.render();
                    }
                }
            },
            get endPosition (){
                return {
                    set x(x){
                        link.end.x = x;
                        CNV.render();
                    },
                    set y(y){
                        link.end.y = y;
                        CNV.render();
                    }
                }
            }
        }
    }


    set pointer(bool){
        this.isPointer = !!bool;
        this.link.pointer = this.isPointer
    }

    set onmouseover(callback){
        CNV.state.mouseover[this.id] = callback;
        if(!CNV.state.__mouseMoveTargets.includes(this.id)){
            CNV.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseenter(callback){
        CNV.state.mouseenter[this.id] = callback;
        if(!CNV.state.__mouseMoveTargets.includes(this.id)){
            CNV.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseleave(callback){
        CNV.state.mouseleave[this.id] = callback;
        if(!CNV.state.__mouseMoveTargets.includes(this.id)){
            CNV.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onclick(callback){
        if(!CNV.state.__mouseClickTargets.includes(this.id)){
            CNV.state.__mouseClickTargets.push(this.id)
        }
        CNV.state.click[this.id] = callback;
    }

    remove(){
        //удаляем информацию
        delete CNV.state.__shapes[this.id];
        //удаляем инстанс класса
        delete CNV.state.shapes[this.id];
        //удаляем слушатели событий
        delete CNV.state.mouseenter[this.id];
        delete CNV.state.mouseleave[this.id];
        delete CNV.state.mouseenter[this.id];
        delete CNV.state.click[this.id];

        let MMT = CNV.state.__mouseMoveTargets;
        let MCT = CNV.state.__mouseClickTargets;

        if(MMT.indexOf(this.id) >= 0){
            MMT.splice(MMT.indexOf(this.id), 1);
        }
        if(MCT.indexOf(this.id) >= 0){
            MCT.splice(MCT.indexOf(this.id), 1);
        }
        CNV.render();
    }

}

const CNV = {
    state: {
        __shapes: {}, //id: {type: "line", start: {x, y}, end: {x, y}, classList: [], id},
        shapes: {}, //"id: ShapeInstance"
        mouseover: {},
        mouseleave: {},
        mouseenter: {},
        click: {},
        __mouseMoveTargets: [],
        __mouseClickTargets: [],
        shouldRenderUpdates: true,
        shift: {x: 0, y: 0},
        shift: {x: 0, y: 0},
        draggableCanvas: false,
    },
    context: undefined,
    canvas: undefined,
    css: undefined,


    setCanvas(canvas){
        this.canvas = canvas;
        canvas.addEventListener("mousemove", this.__mouseMove.bind(this));
        canvas.addEventListener("click", this.__mouseClick.bind(this));
    },

    setContext(context){
        this.context = context;
    },

    setCSS(css){
        this.css = css;
    },

    settings: {
        set draggableCanvas(flag){
            CNV.state.draggableCanvas = !!flag;
        }
    },

    __mouseMove(e){
        let needToRedraw = false;

        const successCallback = (link, e) => {
            let selfE = {...e, target: this.state.shapes[link.id]};
            if(this.state.mouseover[link.id]){
                this.state.mouseover[link.id](selfE)
                needToRedraw = true
            }
            if(this.state.mouseenter[link.id]){
                if(!link.events.mouseenter){
                    this.state.mouseenter[link.id](selfE)
                    link.events.mouseenter = true;
                    needToRedraw = true;
                }
            }
            if(this.state.mouseleave[link.id]){
                link.events.mouseleave = true;
            }
        }

        const failCallback = (link, e) => {
            let selfE = {...e, target: this.state.shapes[link.id]};
            if(this.state.mouseleave[link.id]){
                // console.log("here", link.events.mouseenter)
                if(link.events.mouseenter){
                    this.state.mouseleave[link.id](selfE)
                    link.events.mouseenter = false;
                    needToRedraw = true;
                }
            }
            if(this.state.mouseenter[link.id]){
                link.events.mouseenter = false;
            }
        }

        for(let i = 0; i < this.state.__mouseMoveTargets.length; i++){
            let link = this.state.__shapes[this.state.__mouseMoveTargets[i]];
            if(link.type === "line"){
                this.nearLine({
                        distance: 5,
                        userX: e.clientX,
                        userY: e.clientY,
                        x1: link.start.x + this.state.shift.x,
                        y1: link.start.y + this.state.shift.y,
                        x2: link.end?.x + this.state.shift.x || link.start.x + this.state.shift.x,
                        y2: link.end?.y + this.state.shift.y || link.start.y + this.state.shift.y,
                    }, successCallback.bind(this, link, e),
                    failCallback.bind(this, link, e)
                )
            } else if(link.type === "circle"){
                this.nearDot({
                        distance: 5,
                        userX: e.clientX,
                        userY: e.clientY,
                        x0: link.start.x + this.state.shift.x,
                        y0: link.start.y + this.state.shift.y,
                    }, successCallback.bind(this, link, e),
                    failCallback.bind(this, link, e)
                )
            }


        }
        if(needToRedraw){
            this.render();
        }
    },


    __mouseClick(e){
        let needToRedraw = false;
        for(let i = 0; i < this.state.__mouseClickTargets.length; i++){
            let link = this.state.__shapes[this.state.__mouseClickTargets[i]];
            if(link.type === "line"){
                this.nearLine({
                    distance: 5,
                    userX: e.clientX,
                    userY: e.clientY,
                    x1: link.start.x + this.state.shift.x,
                    y1: link.start.y + this.state.shift.y,
                    x2: link.end.x + this.state.shift.x,
                    y2: link.end.y + this.state.shift.y,
                    e: e,
                }, (e)=> {
                    let selfE = {...e, target: this.state.shapes[link.id]};

                    if(this.state.click[link.id]){
                        this.state.click[link.id](selfE)
                    }

                })
            } else if (link.type === "circle"){
                this.nearDot({
                    distance: 5,
                    userX: e.clientX,
                    userY: e.clientY,
                    x0: link.start.x + this.state.shift.x,
                    y0: link.start.y + this.state.shift.y,
                    e: e,
                }, (e)=> {
                    let selfE = {
                        clientY: e.clientY,
                        clientX: e.clientX,
                        altKey: e.altKey,
                        button: e.button,
                        ctrlKey: e.ctrlKey,
                        layerX: e.layerX,
                        layerY: e.layerY,
                        movementX: e.movementX,
                        movementY: e.movementY,
                        currentTarget: e.currentTarget,
                        offsetX: e.offsetX,
                        offsetY: e.offsetY,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        x: e.x,
                        y: e.y,
                        which: e.which,
                        target: this.state.shapes[link.id],
                        shiftKey: e.shiftKey,
                    };
                    if(this.state.click[link.id]){
                        this.state.click[link.id](selfE)
                    }

                })
            }


        }
        if(needToRedraw){
            console.log("redraw")
            this.render();
        }
    },

    __mouseMoveHandler(){
        canvas.addEventListener("mousemove", )
    },

    __clearCanvas(){
        context.beginPath();
        context.moveTo(0, 0);
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
    },

    querySelector(selector){
        for(let id in this.state.__shapes){
            const shape = this.state.__shapes[id];
            if(selector[0] === "."){
                if(shape.classList.includes(selector.slice(1))){
                    return this.state.shapes[id];
                }
            } else {
                if(shape.type === selector){
                    return this.state.shapes[id];
                }
            }
        }
    },

    querySelectorAll(selector){
        const result = [];
        for(let id in this.state.__shapes){
            const shape = this.state.__shapes[id];
            if(selector[0] === "."){
                if(shape.classList.includes(selector.slice(1))){
                    result.push(this.state.shapes[id]);
                }
            } else {
                if(shape.type === selector){
                    result.push(this.state.shapes[id]);
                }
            }
        }
        return result;
    },

    getElementByUniqueId(id){
        return this.state.shapes[id];
    },

    createLine(config){
        let id = uniqueId();
        this.state.__shapes[id] = {
            start: {
                x: config.x0,
                y: config.y0,
            },
            end: {
                x: config.x1,
                y: config.y1,
            },
            type: "line",
            id,
            classList: config.className ? [config.className] : [],
            events: {
                mouseenter: false,
            }
        }
        let link = this.state.__shapes[id]
        let shape = new Shape(link, id);
        this.state.shapes[id] = shape;

        this.line(link);
        return shape;
    },

    createCircle(config){
        let id = uniqueId();
        if(config.className){
            if(!config.className instanceof Array){
                config.className = [config.className]
            }
        }
        this.state.__shapes[id] = {
            start: {
                x: config.x0,
                y: config.y0,
            },
            type: "circle",
            id,
            classList: config.className ? config.className : [],
            events: {
                mouseenter: false,
            }
        }
        let link = this.state.__shapes[id]
        let shape = new Shape(link, id);
        this.state.shapes[id] = shape;

        this.circle(link);
        return shape;
    },

    line(link){
        const style = cssEngine(this.css, link.classList, link.type);
        if(!(style.visibility === "hidden")){
            this.context.beginPath();
            this.context.moveTo(link.start.x + this.state.shift.x, link.start.y + this.state.shift.y);
            if(!link.pointer){
                this.context.lineTo(link.end.x + this.state.shift.x, link.end.y + this.state.shift.y);
                this.context.lineWidth = style.lineWidth;
                this.context.strokeStyle = style.color; //config.color;
                this.context.stroke();
            }else{
                const shape = this.getElementByUniqueId(link.id);
                const equation = shape.system.equation;
                const endPosition = moveTo(equation, -5);
                this.context.lineTo(endPosition.x + this.state.shift.x, endPosition.y + this.state.shift.y);
                this.context.lineWidth = style.lineWidth;
                this.context.strokeStyle = style.color; //config.color;
                this.context.stroke();
            }

        }
    },

    circle(link){
        const style = cssEngine(this.css, link.classList, link.type);
        if(!(style.visibility === "hidden")){
            this.context.beginPath();
            this.context.fillStyle = style.color;
            this.context.arc(link.start.x + this.state.shift.x, link.start.y + this.state.shift.y, style.radius, style.startAngle, style.endAngle);
            this.context.fill();
        }
    },

    text(config){
        this.context.font = `${config.fontSize || 14}px serif`;
        this.context.fillStyle = config.color || "black";
        this.context.fillText(config.text, config.x, config.y);
    },

    smth(){
        const config = {
            x0: 300,
            y0: 10,
            x1: 150,
            y1: 150,
        }

        eqInit = getEquationFor2points(config.x0, config.y0, config.x1, config.y1);
        let linePosition = moveTo(eqInit, -15);

        equation = getEquationForLine(linePosition.x, linePosition.y, eqInit);


        CNV.createLine({
            x0: config.x0,
            y0: getCoordinates(eqInit, config.x0),
            x1: config.x1,
            y1: getCoordinates(eqInit, config.x1),
        });

        CNV.createCircle({
            x0: linePosition.x,
            y0: linePosition.y,
            radius: 5,
            className: ["smallCircle"]
        })

        let len = 10;
        const perp = CNV.createLine({
            x0: linePosition.x - len,
            y0: getCoordinates(equation, linePosition.x - len),
            x1: linePosition.x + len,
            y1: getCoordinates(equation, linePosition.x + len),
        })

        // console.log("prep equat", perp.system.equation);

        let startPoint = moveTo(perp.system.equation, -10, linePosition.x);
        let endPoint = moveTo(perp.system.equation, 10, linePosition.x);

        //console.log(equation, startPoint, endPoint)
        perp.update.startPosition.x = startPoint.x;
        perp.update.startPosition.y = startPoint.y;
        perp.update.endPosition.x = endPoint.x;
        perp.update.endPosition.y = endPoint.y;
    },

    pointer(line){
        const config = {
            x0: line.start.x + this.state.shift.x,
            y0: line.start.y + this.state.shift.y,
            x1: line.end.x + this.state.shift.x,
            y1: line.end.y + this.state.shift.y,
        }

        //Чтобы срелочки после выхода за границы экрана не творили дичь
        if(config.x1 < 3) return;

        let eqInit = getEquationFor2points(config.x0, config.y0, config.x1, config.y1);
        let linePosition = moveTo(eqInit, -10);
        let equation = getEquationForLine(linePosition.x, linePosition.y, eqInit);
        let len = 50;
        equation.x1 = linePosition.x - len;
        equation.y1 = getCoordinates(equation, linePosition.x - len);
        equation.x2 = linePosition.x + len;
        equation.y2 = getCoordinates(equation, linePosition.x + len);

        let startPoint = moveTo(equation, -5, linePosition.x);
        let endPoint = moveTo(equation, 5, linePosition.x);
        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.moveTo(startPoint.x, startPoint.y);
        this.context.lineTo(endPoint.x, endPoint.y);
        this.context.lineTo(config.x1,config.y1);
        this.context.fill();
    },

    nearLine(config, callbackSuccess = [], callbackFail = []){
        !config.distance ? config.distance = 1 : config

        if(callbackSuccess){
            if(callbackSuccess instanceof Function){
                callbackSuccess = [callbackSuccess];
            }
        }

        if(callbackFail){
            if(callbackFail instanceof Function){
                callbackFail = [callbackFail];
            }
        }

        const {userX, userY, x1, y1, y2, x2} = config;
        const x0 = userX;
        const y0 = userY;

        let res = this.isNearLineCalc({
            x0,
            y0,
            x1,
            y1,
            x2,
            y2,
        })

        if (res) {
            callbackSuccess.forEach((callback)=>{
                callback(config.e);
            })
        } else {
            callbackFail.forEach((callback)=>{
                callback(config.e);
            })
        }
        return res;
    },

    isNearLineCalc(config){
        function dist (x1,y1,x2,y2){
            return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        }
        const {x0,y0, x1, y1, x2, y2} = config;
        let r1 = dist(x0, y0, x1, y1);
        let r2 = dist(x0, y0, x2, y2);
        let r12 = dist(x1, y1, x2, y2);


        if(r1 < dist(r2, r12,0,0) && r2 < dist(r1,r12,0,0)){
            let a = y2 - y1;
            let b = x1 - x2;
            let c = -x1 * (y2 - y1) + y1 * (x2 - x1);
            let t = dist (a,b,0,0);
            if (c>0){
                a = -a;
                b = -b;
                c = -c;
            }
            let r0 =(a * x0 + b * y0 + c) / t;
            // console.log('Расстояние от точки до отрезка=',r0);
            if(r0 > -5 && r0 < 5){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },

    nearDot(config, callbackSuccess = [], callbackFail = []){
        !config.distance ? config.distance = 1 : config
        if(callbackSuccess){
            if(callbackSuccess instanceof Function){
                callbackSuccess = [callbackSuccess];
            } else {
                callbackSuccess = [()=>{}]
            }
        }
        if(callbackFail){
            if(callbackFail instanceof Function){
                callbackFail = [callbackFail];
            } else {
                callbackFail = [()=> {}];
            }
        }

        const {userX, userY, x0, y0} = config;

        if((userX < x0 + 10 && userX > x0 - 10) && (userY < y0 + 10 && userY > y0 - 10)) {
            callbackSuccess.forEach((callback)=>{
                callback(config.e);
            })
            return true;
        } else {
            callbackFail.forEach((callback)=>{
                callback(config.e);
            })
            return false
        }
    },

    __renderPointers(){
        this.querySelectorAll("line").forEach(shape => {
            if(shape.isPointer){
                this.pointer(shape.link);
            }
        })
    },

    render(){
        if(this.state.shouldRenderUpdates){
            this.__clearCanvas();
            for(let id in this.state.__shapes){
                let shape = this.state.__shapes[id];
                if(shape.type === "line") this.line(shape);
                else if(shape.type === "circle") this.circle(shape);
            }

            this.__renderPointers();
        }
    },

    preventRender(callback){
        this.state.shouldRenderUpdates = false;
        callback();
        this.state.shouldRenderUpdates = true;
    },

    combineRender(callback){
        this.state.shouldRenderUpdates = false;
        callback();
        this.state.shouldRenderUpdates = true;
        CNV.render();
    },

    save(){
        return JSON.stringify(this.state);
    },

    recover(data){
        this.state = JSON.parse(data);
        for(let key in this.state.shapes) {
            this.state.shapes[key] = new Shape(this.state.__shapes[key], key);
            this.state.shapes[key].pointer = this.state.__shapes[key].pointer;
        }
        this.render();
    }
}
function getCoordinates(equation, x, y){
    if(x !== undefined){
        return x * equation.k - equation.b;
        //return (x + equation.xTop) / (equation.xBottom) * (equation.yBottom) - equation.yTop;
    } else if(y !== undefined){
        return (y - equation.b) / equation.k
        //return (y + equation.yTop) / (equation.yBottom) * (equation.xBottom) - equation.xTop;
    }
}
function getEquationFor2points(x1, y1, x2, y2){
    let xTop = -x1
    let xBottom = (x2 - x1);
    let yTop = -y1
    let yBottom = (y2 - y1);

    return {
        x1, y1, x2, y2,
        xTop,
        xBottom,
        yTop,
        yBottom,
        k: (y2 - y1) / (x2 - x1),
        b: (x1 * (y2 - y1) / (x2 - x1) - y1),
    }
}


function getEquationForLine(x1, y1, equation){
    const k = -1 / equation.k;
    const a = Math.sqrt((equation.x1 - x1)**2 +  (equation.y1 - y1) ** 2);
    return  {
        xTop: -x1,
        xBottom: -(equation.xTop || 1) / equation.xBottom,
        yTop: -y1,
        yBottom: (equation.yTop  || 1) / equation.yBottom,
        k,
        //b: -Math.sqrt(x1 **2 +  y1 ** 2), //equation.b,
        //b: -Math.sqrt((a/ k) ** 2 + a **2),
        b: (equation.y2 - equation.y1 >= 0 ? -1 : 1) * Math.sqrt((a * k) ** 2 + a**2) - (equation.y1 + equation.x1 / equation.k),
    };

}

function moveTo(equation, move, x){
    let lenA = Math.sqrt((equation.x2 - equation.x1) ** 2 + (equation.y2 - equation.y1) ** 2);
    let lenX = Math.abs(equation.x2 - equation.x1);
    let lenY = Math.abs(equation.y2 - equation.y1);
    //Чтобы узнать знак сдвига. То есть убывает или возрастает прямая, от этого всё зависит
    //move = move * (equation.x2 - equation.x1 < 0 ? -1 : 1);
    const alfa = (equation.x2 - equation.x1) < 0 ? -1 : 1;
    let lenA2;

    if(x === undefined){
        lenA2 = lenA + move;
    } else if(x !== undefined){
        lenA2 = Math.sqrt((x - equation.x1) ** 2 + (getCoordinates(equation, x) - equation.y1) ** 2) + move
    }

    let k = lenA2 / lenA;
    let newX =  Math.abs(k * Math.abs(equation.x2 - equation.x1) + alfa * equation.x1);
    return {
        x: newX,
        y: getCoordinates(equation, newX),
    }
}
function dragCanvas(){
    function onMouseDown (e){
        if(CNV.state.draggableCanvas){
            for(let i = 0; i < CNV.state.__mouseClickTargets.length; i++){
                let link = CNV.state.__shapes[CNV.state.__mouseClickTargets[i]];
                let res = CNV.nearDot({
                    distance: 5,
                    userX: e.clientX,
                    userY: e.clientY,
                    x0: link.start.x + CNV.state.shift.x,
                    y0: link.start.y + CNV.state.shift.y,
                    e: e,
                })
                if(res) return;
            }
            canvas.style.cursor = "grab"
            canvas.addEventListener("mousemove", onMouseMove);
        }
    }

    function onMouseUp(e){
        canvas.style.cursor = "default"
        canvas.removeEventListener("mousemove", onMouseMove);
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
        canvas.style.cursor = "grabbing"
        if(CNV.state.draggableCanvas){
            CNV.state.shift.x += e.movementX;
            CNV.state.shift.y += e.movementY;
            CNV.render();
        }
    }
}

dragCanvas();

// canvas.onmousemove = e => {
//     console.log(e)
// }

