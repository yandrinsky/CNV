import CNV from "../CNV/library";
import Fraction from "../Fraction";
import state from "./analyzeState";
import findCycles from "./fincCycles";
import { collecting_statistics } from "./priority";
import {CONTROL_SUM_WARNING, LINE_DIVISION, LINE_WIDTH, NUMERIC_POWER, SHOW_CYCLES, START_POWER} from "../SETTINGS";
import Iteration from "../gause";
import text from "./text";




function analyze(lines) {
    CNV.combineRender(() => {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
        CNV.querySelectorAll(".finishText").forEach(item => item.remove());
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
    if (startLines.length > 1) {
        alert("Путь имеет разрывы. Анализ невозможен");
        console.log(startLines)
        return;
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
            if(line.line.style.lineWidth > 3){
                line.line.style.lineWidth = LINE_WIDTH / (LINE_DIVISION ** (double(line.power.getDet() - line.power.getNum())));
            }
        });
    })


    //АНАЛИЗ
    //console.log(collecting_statistics(lines, startLines[0]));

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
            alert("Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr());
        }
    }
}
export default analyze;