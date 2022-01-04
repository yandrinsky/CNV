import CNV from "../CNV/library";
import Fraction from "../Fraction";
import findCycles from "./fincCycles";
import Store from "../Store";
import cyclesOptimize from "./cyclesOptimize";
import state from "./analyzeState";
import step from "./step";
import { primary_bypass } from "./priority";
import {CONTROL_SUM_WARNING, SHOW_CYCLES} from "../SETTINGS";
import showCycles from "./showCycles";
import { forming_paths } from "./formingPaths";
import follow from "./follow";
import go from "./go";



function analyze(lines){
    CNV.combineRender(()=> {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
    })
    
    state.results = {};

    let startLines = [];
    let controlSum = new Fraction(0);


    for(let key in lines){ //Считаем количество точек входа
        if(lines[key].parents.length === 0){
            startLines.push(lines[key])
        }
    }
    if(startLines.length > 1){
        alert("Путь имеет разрывы. Анализ невозможен");
        console.log(startLines)
        return;
    }

    Store.state.cycles = findCycles(startLines[0]); //находим циклы
    state.cycles = Store.state.cycles;

    cyclesOptimize(startLines[0]) //Оптимизируем циклы (подробнее в файле)

    if(SHOW_CYCLES){
        showCycles(startLines[0]); //Показываем циклы цветами - по желанию
    }
    let test = [];
    primary_bypass(lines);
    test = forming_paths(lines);
    try{
        //follow(test[0].path)
        go(test);
        //Запускаем анализ входной точки (грани, у которой нет родителя)
        //step(startLines[0], new Fraction(1));
        CNV.render(); //Отрисовываем изменения, проишедшие во время анализа графа
        for(let key in state.results){ //Отрисовываем значения у выходов графа
            if(!state.results[key].auxiliary){
                controlSum.plus(state.results[key].data.num, state.results[key].data.det);
            }
            CNV.text(state.results[key])

        }
        for(let key in lines){
            //Чистим за собой после окончания работы
            lines[key].power = undefined;
            lines[key].already = undefined;
            lines[key].cycle = undefined;
            lines[key].__BREAK = undefined;
            lines[key].__GET_POWER_FOR = undefined;
            lines[key].__CYCLEEND = undefined;
            lines[key].__NOT_CIRCLE = undefined;
            lines[key].__CHECKED = undefined;
            Store.state.cycles = undefined;
        }

        if(controlSum.getStr() !== "1"){
            if(CONTROL_SUM_WARNING){
                //alert("Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr());
            }
        }
    } catch (e){
        for(let key in lines){
            //Чиститим за собой даже если что-то пошло не так.
            lines[key].power = undefined;
            lines[key].already = undefined;
            lines[key].cycle = undefined;
            lines[key].__BREAK = undefined;
            lines[key].__CYCLEEND = undefined;
            lines[key].__GET_POWER_FOR = undefined;
            lines[key].__NOT_CIRCLE = undefined;
            lines[key].__CHECKED = undefined;
            Store.state.cycles = undefined;
        }
        console.error("Граф замкнут. Анализ невозможен", e);
    }
}

export default analyze;