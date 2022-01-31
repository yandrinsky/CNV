import CNV from "../CNV/library";
import Fraction from "../Fraction";
import state from "./analyzeState";
import findCycles from "./fincCycles";
import { collecting_statistics } from "./priority";
import {
    CONTROL_SUM_WARNING, FINISH_LIMITS,
    LINE_DIVISION,
    LINE_WIDTH,
    LINE_WIDTH_MIN, LOOPS, MERGES,
    NUMERIC_POWER,
    SHOW_CYCLES,
    START_POWER
} from "../SETTINGS";
import Iteration from "../gause";
import text from "./text";

const warning = document.querySelector(".warning");


function show_warning(text, duration = false){
    warning.innerHTML = text;
    warning.classList.remove("hidden");
    if(duration !== false){
        if(duration === 0){
            warning.classList.add("hidden");
        } else {
            setTimeout(() => {
                warning.classList.add("hidden");
            }, duration);
        }
    }
}

function analyze(lines) {
    CNV.combineRender(() => {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
        CNV.querySelectorAll(".finishText").forEach(item => item.remove());
        CNV.querySelectorAll(".red").forEach(item => item.classList.remove("red"));
    })

    state.results = {};
    let newLines = Object.keys(lines).map(key => {
        return lines[key];
    });

    let startLines = [];
    let finishLines = [];
    let controlSum = new Fraction(0);


    for (let key in lines) { //Считаем количество точек входа
        if (lines[key].parents.length === 0) {
            startLines.push(lines[key])
        }
        if (lines[key].children.length === 0) {
            finishLines.push(lines[key]);
        }
    }
    state.startLines = startLines;
    if (startLines.length > 1) {
        show_warning("Путь имеет разрывы. Анализ невозможен");
        startLines.forEach(item => {
            item.line.classList.add("red");
        })
        // warning.innerHTML = "Путь имеет разрывы. Анализ невозможен";
        // warning.classList.remove("hidden");
        // console.log(startLines)
        return;
    } else {
        show_warning("", 0);
        //warning.classList.add("hidden");
    }



    let m = [];

    newLines.forEach((item, index) => {
        let arr = [];
        for (let i = 0; i <= newLines.length; i++) {
            arr.push(new Fraction(0));
        }
        item.parents.forEach(parent => {
            arr[newLines.indexOf(parent)] = new Fraction(1, -parent.children.length);
        })
        arr[newLines.indexOf(item)] = new Fraction(1);
        if (item === startLines[0]) {
            arr[arr.length - 1] = new Fraction(1);
        }
        m.push(arr);
    })

    let answers = Iteration(m);

    function double(int){
        let count = 0;
        while (int / 2 >= 1){
            int /= 2;
            count += 1;
        }
        return count;
    }

    CNV.combineRender(() => {
        newLines.forEach((line, index) => {
            line.power = answers[index];

            let newWidth = LINE_WIDTH / (LINE_DIVISION ** (double(line.power.getDet() / line.power.getNum())));
            if(newWidth >= LINE_WIDTH_MIN){
                line.line.style.lineWidth = newWidth;
                //line.endCircle.style.radius = newWidth / 2;
            } else {
                line.line.style.lineWidth = LINE_WIDTH_MIN;
            }
        });
    })


    //АНАЛИЗ
    state.analyzeInfo = collecting_statistics(lines, startLines[0], finishLines.length);
    //console.log(collecting_statistics(lines, startLines[0]));

    if(LOOPS === false){
        if(state.analyzeInfo.number_of_loops > 0){
            show_warning("Присутвует недопустимый элемент: петля. Анализ невозможен");
            return;
        }
    }
    if(MERGES === false){
        if(state.analyzeInfo.number_of_mergers > 0){
            show_warning("Присутвует недопустимый элемент: слияние. Анализ невозможен");
            return;
        }
    }

    if(FINISH_LIMITS){
        if(FINISH_LIMITS instanceof Array){
            if(!(finishLines.length >= FINISH_LIMITS[0] && finishLines.length <= FINISH_LIMITS[1])){
                show_warning(
                    `Недопустимое количество стоков: ${finishLines.length}. 
                          Требуется от ${FINISH_LIMITS[0] } до ${FINISH_LIMITS[1]}
                `);
            }
        }else if (Number.isInteger(FINISH_LIMITS)){
            console.log("in FINISH_LIMITS number")
            if(finishLines.length !== FINISH_LIMITS){
                show_warning(
                    `Недопустимое количество стоков: ${finishLines.length}. 
                          Требуется ${FINISH_LIMITS}
                `);
            }
        }
    }

    finishLines.forEach(line => {
        //line.line.classList.add("finishLine");
        text({target: line, output: state.results});
    })


    CNV.render(); //Отрисовываем изменения, проишедшие во время анализа графа
    for (let key in state.results) { //Отрисовываем значения у выходов графа
        if (!state.results[key].auxiliary) {
            controlSum.plus(state.results[key].data.num, state.results[key].data.det);
        }
        CNV.createText({
            ...state.results[key],
            className: "finishText",
            id: key + "_finishText",
        })
        CNV.render();
        //CNV.text(state.results[key])

    }
    if ((NUMERIC_POWER && controlSum.getStr() !== String(START_POWER)) || (!NUMERIC_POWER && controlSum.getStr() !== "1")) {
        if (CONTROL_SUM_WARNING) {
            warning.innerHTML = "Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr();
            warning.classList.remove("hidden");
        } else {
            warning.classList.add("hidden");
        }
    }
}
export default analyze;