import CNV from "../CNV/library";
import Fraction from "../Fraction";
import findCycles from "./fincCycles";
import canGo from "./canGo";
import Store from "../Store";
import cyclesOptimize from "./cyclesOptimize";

function text(options){
    options.auxiliary = options.aux || options.auxiliary;
    options.aux = options.auxiliary || options.aux;
    options.output[options.target.ids.line] = {
        text: options.auxiliary ? options.text : options.target.power.getStr(),
        x: options.target.endCircle.link.start.x + 10 + CNV.state.shift.x,
        y: options.target.endCircle.link.start.y - 10 + CNV.state.shift.y,
        fontSize: "14",
        color: "green",
        data: options.auxiliary ? undefined : {num: options.target.power.getNum(), det: options.target.power.getDet()},
        auxiliary: options.auxiliary || false,
    }
}


//props: lines,
function analyze(lines){
    CNV.combineRender(()=> {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
    })

    let startLines = [];
    let results = {};
    let controlSum = new Fraction(0);
    let path = undefined;


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
    const cycles = Store.state.cycles;

    cyclesOptimize(startLines[0]) //Оптимизируем циклы (подробнее в файле)


    //showCycles(startLines[0]); //Показываем циклы цветами - по желанию

    let count = 0;
    function step(target, power, lastTarget){
        let canGOres;

        //Логи дебага
        //console.log("incoming power", power.getStr(), power);
        //console.log("lastTarget power", lastTarget?.power.getStr(), lastTarget?.power);

        target.power = power;

        //Если этот элемент является циклом и мы уже о нём знаем - игнорируем.
        if(target.cycle) return;


        let fullPower = new Fraction(0);

        //Выделение пути обхода - раскоменти и увидишь, как шёл обход по графу

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
            if(!item.power){ //Если у входной грани нет мощности, проверяем, возможно ли в него попасть из этой грани
                canGOres = canGo(target, item);
                if(canGOres){ //Если да, то сворачиваем лавочку и идём другим путём
                    return;
                }else{ // Если нет, значит мы наткнулись на цикл и нам нужно его обойти как можно скорее
                    cycles.forEach(cycle=> {
                        if(cycle[0] === target && cycle[cycle.length - 2] === item){
                            path = cycle; //Находим нужный нам цикл и сохраняем его
                        }
                    })
                }
            }
            //Флаг break нужен для того, чтобы обратывать множественные Арнольды. Ставится в функции optimizeCycles
            if(item.power && !item.__BREAK) { //Если мощность была, складываем её
                fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
            }
        }

        if(target.__GET_POWER_FOR){ //Если есть этот массив, значит заберём все мощности из элементов массива (подробнее в файле)
            target.__GET_POWER_FOR.forEach(item => {
                console.log("ITEM FROM __GET_POWER_FOR", item, item.power.getStr());
                fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
            })
            console.log("FULL POWER after __GET_POWER_FOR", fullPower.getStr());
        }

        if(fullPower.getNum() !== 0){
            target.power = fullPower;
        }

        //Логи дебага
        //console.log("counted power (fullPower)", target.power.getStr(), target.power);

        //Уравнение арнольда
        if(target.already && power.getStr() !== fullPower.getStr()) {
            //Логи дебага
            // console.log("!!!АРНОЛЬД!!!");
            // console.log("Full P", fullPower.getStr());
            // console.log("power", power.getStr());
            //console.log("In Arnold power incoming", "fullpower", power.getStr(), fullPower.getStr());

            lastTarget.cycle = true; //Сразу ставим флаг взодящей грани в значение true, чтобы больше по нему не проходить
            //Вычитаем из общей мощности переданную от входящей грани, потому что сейчас будет арнольд, а не простое сложение
            fullPower.minus(power.getNum(), power.getDet());
            console.log("Full P after minus", fullPower.getStr());
            let kx = target.power.clone().divide(power.getNum(), power.getDet()); //Вычисляем коэф перед икс)
            kx.minus(1); //Не помню зачем, но надо
            let x = fullPower.clone().divide(kx.getNum(), kx.getDet()); //Вычисляем сам икс
            target.power.plus(x.getNum(), x.getDet()); //Меняем мощность у текущей грани, арнольд готов

            //console.log("fullPower here", fullPower.getStr());
            //console.log("x, kx, fullPower is", x.getStr(), kx.getStr(), fullPower.getStr());
            console.log("myPower after Arnold", target.power.getStr());
        }

        target.already = true; //Ставим флаг, что мы прошли эту грань

        if(target.children.length === 0){ //Если детей нет, значит это выход и нужно записать результат
            CNV.preventRender(() => target.line.classList.add("finishLine"));
            text({target, output: results})
            // results[target.ids.line] = {
            //     text: target.power.getStr(),
            //     x: target.endCircle.link.start.x + 10 + CNV.state.shift.x,
            //     y: target.endCircle.link.start.y - 10 + CNV.state.shift.y,
            //     fontSize: "14",
            //     color: "green",
            //     data: {num: target.power.getNum(), det: target.power.getDet()}
            // }
        }

        //Функционал работает плохо, потому что мы не идём по пути, а просто начинаем идти его сторону. Но это работает,
        //на простых примерах. Нужно дописать нормально.
        if(canGOres === false && path){ //Вариант, если в нас входит цикл. Значит нужно пойти в его сторону. Вот мы и идём
            let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
            step(path[1], transmittingPower, target);
        } else { //Иначе просто идём по всем нашим детям
            target.children.forEach(item => {
                let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
                step(item, transmittingPower, target);
            })
        }

        target.already = false; //Как только по всем детям прошлись, уходим назад и убираем флаг
    }

    try{
        //Запускаем анализ входной точки (грани, у которой нет родителя)
        step(startLines[0], new Fraction(1));
        CNV.render(); //Отрисовываем изменения, проишедшие во время анализа графа
        for(let key in results){ //Отрисовываем значения у выходов графа
            if(!results[key].auxiliary){
                controlSum.plus(results[key].data.num, results[key].data.det);
            }
            CNV.text(results[key])

        }
        for(let key in lines){
            //Чистим за собой после окончания работы
            lines[key].power = undefined;
            lines[key].already = undefined;
            lines[key].cycle = undefined;
            lines[key].__BREAK = undefined;
            lines[key].__GET_POWER_FOR = undefined;
        }

        if(controlSum.getStr() !== "1"){
            alert("Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr());
        }
    } catch (e){
        for(let key in lines){
            //Чиститим за стобой даже если что-то пошло не так.
            lines[key].power = undefined;
            lines[key].already = undefined;
            lines[key].cycle = undefined;
            lines[key].__BREAK = undefined;
            lines[key].__GET_POWER_FOR = undefined;
        }
        console.error("Граф замкнут. Анализ невозможен", e);
    }
}

export default analyze;