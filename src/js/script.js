import "../css/style.css"
import css from "./css";
import CNV from "./CNV/library";
import uniqueId from "./CNV/uniqueId";

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



CNV.setContext(context);
CNV.setCanvas(canvas);
CNV.setCSS(css);
CNV.settings.draggableCanvas = false;

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
    CNV.settings.draggableCanvas = false;
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
    CNV.settings.draggableCanvas = true;
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
                    console.log("here!!");
                    currentData.line.update.endPosition.x = data.startCircle.link.start.x;
                    currentData.line.update.endPosition.y = data.startCircle.link.start.y;
                    currentData.endCircle.update.startPosition.x = data.startCircle.link.start.x;
                    currentData.endCircle.update.startPosition.y = data.startCircle.link.start.y;


                    currentData.endCircle.classList.add("hidden");

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
    CNV.settings.draggableCanvas = false;
    CNV.querySelectorAll(".finishLine").forEach(el => el.classList.remove("finishLine"));
    //вести можно только 2 линии, не больше
    if(data.children.length < 2){
        //после того, как начали вести линию сбрасываем у всех круглешков событие нажатия
        resetAllEndCircleClick();
        //создаём новуб линию и указываем ей коорлинаты начала как у круга, по которому кликнули
        const newData = createLine(e, {
            x0: data.endCircle.link.start.x,
            y0: data.endCircle.link.start.y,
        });
        newData.parents.push(data) ;
        addChildren(data, newData);

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
function a(){
    CNV.state.shift.x = 100;
    CNV.state.shift.y = 100;
    CNV.render();
}

function b(){
    CNV.querySelectorAll(".hidden").forEach(it => {
        it.classList.remove("hidden"); it.classList.add("startCircleActive")
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
        data.line.update.endPosition.x = e.clientX - CNV.state.shift.x;
        data.line.update.endPosition.y = e.clientY - CNV.state.shift.y;
        data.endCircle.update.startPosition.x = e.clientX - CNV.state.shift.x;
        data.endCircle.update.startPosition.y = e.clientY - CNV.state.shift.y;
    }


    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("click", stopDrawing);
    setStickToTailHandler(data);
}

function createLine(e, option = {}){
    let line = CNV.createLine({
        x0: option.x0 || e.clientX,
        y0: option.y0 || e.clientY,
        x1: option.x0 || e.clientX,
        y1: option.y0 || e.clientY,
        className: "red",
    })
    let startCircle = CNV.createCircle({
        x0: option.x0 || e.clientX,
        y0: option.y0 || e.clientY,
        className: ["red", "hidden"],
    })
    let endCircle = CNV.createCircle({
        x0: option.x0 || e.clientX,
        y0: option.y0 || e.clientY,
        className: ["endCircle", "hidden"],

    })

    line.pointer = true;

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



function firstDraw() {
    canvas.onclick = e => {
        const data = createLine(e);
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
    analyze();
}

function save(){
    //Убираем синие линии, чтобы сохранились стили без них
    CNV.preventRender(()=>{
        CNV.querySelectorAll(".finishLine").forEach((item) => {
            item.classList.remove("finishLine");
            item.classList.add("__PLACE_FOR_FINISH_LINE")
        })
    })

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

    //Восстанавливаем синие линии, чтобы продолжить разработку
    CNV.preventRender(()=>{
        CNV.querySelectorAll(".__PLACE_FOR_FINISH_LINE").forEach((item) => {
            item.classList.remove("__PLACE_FOR_FINISH_LINE");
            item.classList.add("finishLine")
        })
    })
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
        item.endCircle.onmouseenter = e => endCircleMouseEnter(e);
        item.endCircle.onmouseleave = e => endCircleMouseLeave(e);
        item.endCircle.onclick = e => endCircleClick(item, e);
    }
    if(Object.keys(script.lines).length > 0){
        canvas.onclick = undefined;
    }
    store.state = script;
    CNV.settings.draggableCanvas = true;
}

//power = {num, det}
class Fraction{
    constructor(num, det = 1) {
        let GCD = this.gcd(num, det);
        this.num = num / GCD;
        this.det = det / GCD;
    }

    gcd(n, m){
        return m === 0 ? n : this.gcd(m, n % m);
    }

    nok(n, m) {
        return n * m / this.gcd(n, m);
    }

    getNum(){
        return this.num;
    }
    getDet(){
        return this.det;
    }
    setNum(num){
        const GCD = this.gcd(num, this.det);
        this.num = num / GCD;
        this.det /= GCD;
        return this;
    }
    setDet(det){
        const GCD = this.gcd(det, this.det);
        this.det = det / GCD;
        this.num /= GCD;
        return this;
    }

    plus(num, det = 1){
        let NOK = this.nok(det, this.det);
        let NUM = this.num * NOK / this.det + num * NOK / det;
        let GCD = this.gcd(NOK, NUM);
        NOK /= GCD;
        NUM /= GCD;
        this.num = NUM;
        this.det = NOK;
        return this;
    }
    minus(num, det = 1){
        let NOK = this.nok(det, this.det);
        let NUM = this.num * NOK / this.det - num * NOK / det;
        let GCD = this.gcd(NOK, NUM);
        NOK /= GCD;
        NUM /= GCD;
        this.num = NUM;
        this.det = NOK;
        return this;
    }
    multiply(num, det = 1){
        let GCD = this.gcd(this.num * num, this.det * det);
        this.num = this.num * num / GCD;
        this.det = this.det * det / GCD;
        return this;
    }
    divide(num, det = 1){
        let GCD = this.gcd(this.num * det, this.det * num);
        this.num = this.num * det / GCD;
        this.det = this.det * num / GCD;
        return this;
    }
    getStr(){
        if(this.det === 1){
            return `${this.num}`;
        } else if(this.num === 0){
            return `0`;
        } else {
            return `${this.num}/${this.det}`;
        }
    }
    clone(){
        return new Fraction(this.num, this.det);
    }
}


function findCycles(start){
    const cycles = []; //[[line, line, line], [line, line, line], [line, line, line]];
    const curPath = [];
    function check(target, lastTarget){
        curPath.push(target);

        if(target.__CHECKED){
            lastTarget.__CYCLEEND = true;
            const index = curPath.indexOf(target);
            cycles.push(curPath.slice(index, curPath.length));

            //Не убираем checked, потому что у нас a1, a2, ...., a1 - мы на a1 и в конце, уберём, когда дойдём до начала
            curPath.pop();
            return;
        }
        target.__CHECKED = true;
        target.children.forEach(item => {
            check(item, target);
        })

        //После завершения вызова детей убираем из пути элемент
        curPath.pop();
        target.__CHECKED = false;
    }

    check(start);
    return cycles;
}
function CG(){
    let keys = Object.keys(store.state.lines);
    let line1 = store.state.lines[keys[0]];
    let line2 = store.state.lines[keys[keys.length - 1]];
    console.log("canGo", canGo(line1, line2));
}



function canGo(target, incoming){
    console.warn("start canGo")
    console.log("step")
    // console.log("target", target);
    // console.log("incoming", incoming);

    const toFix = []; //{was, link}
    const toFix2 = {}; //{was, link}

    function step(curTarget, lastTarget){

        // if(target.line.classList.contains("a7")) target.line.classList.add("a3");
        // target.line.classList.add("a7")

        curTarget.__CANGO__CHECKED = true;
        let res;
        let fullPower = new Fraction(0);

        if(curTarget === incoming){
            console.log("PREFOUND");
        }


        //Чтобы предотвратить зацикливаине. Этот флаг даёт функция findCycles;
        if(curTarget.__CYCLEEND) return false;

        //Считаем полную мощность
        for(let i = 0; i < curTarget.parents.length; i++){
            let item = curTarget.parents[i];
            if(!item.power){
                return false;
            } else{
                fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
            }
        }
        //
        if(!toFix2.hasOwnProperty(curTarget.id)){
            toFix2[curTarget.id] = {
                was: curTarget.power === undefined ? undefined : [curTarget.power.getNum(), curTarget.power.getDet()],
                link: curTarget,
            }
        }
        // toFix2[curTarget.id] = {
        //     was: curTarget.power === undefined ? undefined : [curTarget.power.getNum(), curTarget.power.getDet()],
        //     link: curTarget,
        // }
        toFix.push({
            was: curTarget.power === undefined ? undefined : [curTarget.power.getNum(), curTarget.power.getDet()],
            link: curTarget,
        });

        curTarget.power = fullPower;


        if(curTarget === incoming){
            console.log("found!!!");
            return true;
        }
        for (let i = 0; i < curTarget.children.length; i++) {
            let item = curTarget.children[i];
            //item !== lastTarget чтобы не попасть на элемент, по которому уже проходили, то есть не пробешать целую ветку снова
            if(item !== lastTarget){
                if(step(item, curTarget)){
                    return true;
                }
            }
        }
        return false;
    }

    function root(target){
        //Старая версия
        // for(let i = 0; i < target.parents.length; i++) {
        //     let item = target.parents[i];
        //     if(item.power && item !== incoming){
        //         if(step(item, target)){
        //             isPossible = true;
        //             return;
        //         }
        //     }
        //     return root(item);
        // }



        //Новая версия


        // if(target === incoming){
        //     console.log("FOUND!");
        //     isPossible = true;
        //     return;
        // }
        //
        /*if(!target.__CANGO__CHECKED)*/

        for(let i = 0; i < target.parents.length; i++) {
            let item = target.parents[i];
            if(item === incoming) console.log("root PREFOUND", item.power)
            //item.power && item !== incoming
            if(item.power && item !== incoming){
                if(step(item, target)){
                    isPossible = true;
                    console.log("IS POSSIBLE")
                    return;
                }
            }
            if(!item.__CYCLEEND) root(item)

        }
    }

    let isPossible = false;


    root(target);

    for(let key in toFix2){
        toFix2[key].link.power = toFix2[key].was === undefined ? undefined : new Fraction(toFix2[key].was[0], toFix2[key].was[1]);
    }

    console.warn("end canGo", isPossible)
    return isPossible;
}

function showCycles(start){
    const cycles = findCycles(start);
    let colors = ["a1", "a2","a3","a4","a5","a6","a7","a8", "a9"];
    colors.forEach(color => {
        CNV.querySelectorAll("." + color).forEach(item => {
            item.classList.remove(color);
        })
    })
    cycles.forEach((cycle, index) => {
        cycle.forEach(target => {
            target.line.classList.add("a" + (index + 1));
        })
    })
}




function analyze(){
    CNV.combineRender(()=> {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
    })

    let startLines = [];
    let results = {};
    let controlSum = new Fraction(0);
    let path = undefined;
    let isPathMode = false;

    for(let key in store.state.lines){
        if(store.state.lines[key].parents.length === 0){
            startLines.push(store.state.lines[key])
        }
    }
    if(startLines.length > 1){
        alert("Путь имеет разрывы. Анализ невозможен");
        console.log(startLines)
        return;
    }

    const cycles = findCycles(startLines[0]);
    console.log(cycles);

    //showCycles(startLines[0]);

    function follow(path, power){
        path.forEach(pathStep => {
            step(pathStep);
        })
    }


    let count = 0;
    function step(target, power, lastTarget){
        let canGOres;

        console.log("incoming power", power.getStr(), power);
        console.log("lastTarget power", lastTarget?.power.getStr(), lastTarget?.power);
        target.power = power;


        //target.line.classList.add("orange");
        //Если этот элемент является циклом и мы уже о нём знаем - игнорируем.
        if(target.cycle) return;


        let fullPower = new Fraction(0);

        //Выделение пути обхода

        // setTimeout(()=>{
        //     for (let i = 1; i < 10; i++) {
        //         if(!target.line.classList.contains("a" + i)){
        //             target.line.classList.add("a" + i);
        //             break;
        //         }
        //     }
        // }, 1000 * count);



        count += 1;


        //Считаем полную мощность
        for(let i = 0; i < target.parents.length; i++){
            let item = target.parents[i];
            if(!item.power){
                canGOres = canGo(target, item);
                if(canGOres){
                    return;
                }else{
                    cycles.forEach(cycle=> {
                        if(cycle[0] === target && cycle[cycle.length - 2] === item){
                            path = cycle;
                        }
                    })
                }
            }
            if(item.power) {
                fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
            }
        }

        if(fullPower.getNum() !== 0){

            target.power = fullPower;
        }

        console.log("counted power (fullPower)", target.power.getStr(), target.power);

        //Уравнение арнольда
        if(target.already && power.getStr() !== fullPower.getStr()) {
            console.log("!!!АРНОЛЬД!!!");
            console.log("In Arnold power incoming", "fullpower", power.getStr(), fullPower.getStr());
            lastTarget.cycle = true;
            fullPower.minus(power.getNum(), power.getDet());

            let kx = target.power.clone().divide(power.getNum(), power.getDet());
            console.log("kx here", kx.getStr());
            kx.minus(1);
            let x = fullPower.clone().divide(kx.getNum(), kx.getDet());
            console.log("x here", x.getStr());
            target.power.plus(x.getNum(), x.getDet());
            console.log("fullPower here", fullPower.getStr());

            console.log("x, kx, fullPower is", x.getStr(), kx.getStr(), fullPower.getStr());
        }

        console.log("myPower after Arnold", target.power.getStr());

        target.already = true;


        if(target.children.length === 0){
            CNV.preventRender(() => target.line.classList.add("finishLine"));
            results[target.ids.line] = {
                text: target.power.getStr(),
                x: target.endCircle.link.start.x + 10 + CNV.state.shift.x,
                y: target.endCircle.link.start.y - 10 + CNV.state.shift.y,
                fontSize: "14",
                color: "green",
                data: {num: target.power.getNum(), det: target.power.getDet()}
            }
        }

        if(canGOres === false && path){
            let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
            //follow(path, target.power);
            console.warn("change path", "transmitting power", transmittingPower.getStr(), "target.children.length", target.children.length);
            console.log(path);
            // CNV.querySelectorAll(".a2").forEach((item)=> {
            //     item.classList.remove("a5");
            // })
            // CNV.querySelectorAll(".a1").forEach((item)=> {
            //     item.classList.remove("a1");
            // })
            //
            // path.forEach((item, index)=>{
            //     console.log(index);
            //     if(index === 1){
            //         item.line.classList.add("a5");
            //     }else {
            //         item.line.classList.add("a1");
            //     }
            // })
            step(path[1], transmittingPower, target);
        } else {
            target.children.forEach(item => {
                let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
                console.log("transmitting power", transmittingPower.getStr());
                step(item, transmittingPower, target);
            })
        }

        // target.children.forEach(item => {
        //     step(item, new Fraction(target.power.getNum(), target.power.getDet() * target.children.length), target);
        // })

        setTimeout(()=>{
            target.line.classList.remove("a5");
        }, 1000 * (count - 1) + 500);

        target.already = false;
    }
    try{
        step(startLines[0], new Fraction(1));
        // step(startLines[0], 1);
        CNV.render();
        for(let key in results){
            controlSum.plus(results[key].data.num, results[key].data.det);
            CNV.text(results[key])
        }
        for(let key in store.state.lines){
            store.state.lines[key].power = undefined;
            store.state.lines[key].already = undefined;
            store.state.lines[key].cycle = undefined;
        }

        if(controlSum.getStr() !== "1"){
            alert("Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr());
        }
    } catch (e){
        for(let key in store.state.lines){
            store.state.lines[key].power = undefined;
            store.state.lines[key].already = undefined;
            store.state.lines[key].cycle = undefined;
        }
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


const shiftDownHandler = (e) => {
    if(e.key === "Shift"){
        CNV.settings.draggableCanvas = false;

        window.removeEventListener("keydown", shiftDownHandler);
        window.addEventListener("keyup", shiftUpHandler);
        console.log("This is shift");

        for(let key in store.state.lines){
            let obj = store.state.lines[key];
            let item = obj.endCircle;
            item.onclick = undefined;

            function onMouseMove3(event, obj) {
                //setStickToTailHandler(obj);
                const item = obj.endCircle;
                CNV.combineRender(() => {
                    item.update.startPosition.x = event.clientX - CNV.state.shift.x;
                    item.update.startPosition.y = event.clientY - CNV.state.shift.y;

                    obj.line.update.endPosition.x = item.link.start.x;
                    obj.line.update.endPosition.y = item.link.start.y;

                    obj.children.forEach(children => {
                        // obj.line.update.startPosition.x = item.link.start.x  - CNV.state.shift.x;
                        // obj.line.update.startPosition.y = item.link.start.y - CNV.state.shift.y;
                        // obj.startCircle.update.startPosition.x = item.link.start.x  - CNV.state.shift.x;
                        // obj.startCircle.update.startPosition.y = item.link.start.y - CNV.state.shift.y;
                        children.line.update.startPosition.x = item.link.start.x;
                        children.line.update.startPosition.y = item.link.start.y;
                        children.startCircle.update.startPosition.x = item.link.start.x;
                        children.startCircle.update.startPosition.y = item.link.start.y;

                        children.parents.forEach(parent => {
                            if(parent !== obj){
                                parent.line.update.endPosition.x = item.link.start.x;
                                parent.line.update.endPosition.y = item.link.start.y;
                                parent.endCircle.update.startPosition.x = event.clientX - CNV.state.shift.x;
                                parent.endCircle.update.startPosition.y = event.clientY - CNV.state.shift.y;
                            }
                        })

                    })

                    // obj.parents.forEach(parent => {
                    //     parent.line.update.endPosition.x = item.link.start.x;
                    //     parent.line.update.endPosition.y = item.link.start.y;
                    //     parent.startCircle.update.startPosition.x = item.link.start.x;
                    //     parent.startCircle.update.startPosition.y = item.link.start.y;
                    // })
                })
            }


            function mouseLeave(e){
                canvas.style.cursor = "default";
                document.onmousemove = undefined;
                //resetStickToTailHandler();

                canvas.onmousedown = undefined;
                canvas.onmouseup = undefined;
            }

            item.onmouseenter = (e) => {
                canvas.style.cursor = "move";

                canvas.onmousedown = e => {
                    document.onmousemove = (e) => onMouseMove3(e, obj);

                    item.onmouseleave = undefined;
                }

                canvas.onmouseup = e => {
                    if(e.button === 0) {
                        document.onmousemove = undefined;
                        //resetStickToTailHandler();

                        item.onmouseleave = mouseLeave;
                    }
                };
            }

            item.onmouseleave = mouseLeave;
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove3);
            canvas.onmousedown = undefined;
            canvas.onmouseup = undefined;
        }
    }
}

const shiftUpHandler = (e) => {
    if(e.key === "Shift"){
        CNV.settings.draggableCanvas = true;

        canvas.style.cursor = "default";
        window.removeEventListener("keyup", shiftUpHandler);
        window.addEventListener("keydown", shiftDownHandler);
        //resetStickToTailHandler();

        canvas.onmousedown = undefined;
        canvas.onmouseup = undefined;
        document.onmousemove = undefined;

        for(let key in store.state.lines) {
            let obj = store.state.lines[key];
            let item = obj.endCircle;
            item.onmouseenter = endCircleMouseEnter;
            item.onmouseleave = endCircleMouseLeave;
            item.onclick = (e) => endCircleClick(obj, e);
        }
    }
}

window.addEventListener("keydown", shiftDownHandler);
