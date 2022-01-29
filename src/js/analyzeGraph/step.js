import Fraction from "../Fraction";
import state from "./analyzeState";
import canGo from "./canGo";
import CNV from "../CNV/library";
import text from "./text";
import {SHOW_PATH} from "../SETTINGS";
import arnold from "./arnold";
import calcPower from "./calcPower";


function step(target, power, lastTarget){
    let canGOres;

    target.power = power;

    //Если этот элемент является циклом и мы уже о нём знаем - игнорируем.
    if(target.cycle) return;


    let fullPower = new Fraction(0);

    //Выделение пути обхода - раскоменти и увидишь, как шёл обход по графу
    if(SHOW_PATH){
        setTimeout(()=>{
            for (let i = 1; i < 10; i++) {
                if(!target.line.classList.contains("a" + i)){
                    target.line.classList.add("a" + i);
                    break;
                }
            }
        }, 1000 * state.count);
    }


    state.count += 1;

    //Считаем полную мощность
    for(let i = 0; i < target.parents.length; i++){
        let item = target.parents[i];
        if(!item.power){ //Если у входной грани нет мощности, проверяем, возможно ли в него попасть из этой грани
            canGOres = canGo(target, item);
            if(state.mode === "analyze"){
                if(canGOres){ //Если да, то сворачиваем лавочку и идём другим путём
                    return;
                }else{ // Если нет, значит мы наткнулись на цикл и нам нужно его обойти как можно скорее
                    state.cycles.forEach(cycle=> {
                        if(cycle[0] === target && cycle[cycle.length - 2] === item){
                            state.path = cycle; //Находим нужный нам цикл и сохраняем его
                        }
                    })
                }
            } else { //Спортное решение. Выйдет ошибка, если войдёт undefined и это НЕ цикл. А если сложный цикл?..
                if(canGOres){
                    console.error("В режиме follow встретилась ветка (подсвечена зелёным) с мощность undefined");
                    //item.line.classList.add("a7");
                    target.power = undefined;
                    return false;
                }
            }


        }
        //Флаг break нужен для того, чтобы обратывать множественные Арнольды. Ставится в функции optimizeCycles
        if(item.power && !item.__BREAK) { //Если мощность была, складываем её
            //console.log("PARENT POWER", new Fraction(item.power.getNum(), item.power.getDet() * item.children.length).getStr());
            //fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
            if(item !== lastTarget){
                fullPower.plus(calcPower(item, target));
            } else {
                fullPower.plus(power);
            }

        }
    }

    if(target.__GET_POWER_FOR){ //Если есть этот массив, значит заберём все мощности из элементов массива (подробнее в файле)
        target.__GET_POWER_FOR.forEach(item => {
           fullPower.plus(item.power.clone().divide(item.children.length));
        })
    }

    if(fullPower.getNum() !== 0){
        target.power = fullPower;
    }



    //Если элемент является элементов мыходной ветки из цикла



    if(target.loop_powers && target.loop_powers.length > 0 ){
        if(target.children.length > 1){
            target.children.forEach(targetChild => {    //Пробегаемся по всем детям
                targetChild.loop_powers.forEach(tch_child => { //Пробегаемся по всем мощностям ребёнка
                    //console.log("targetChild.loop_powers.length", targetChild.loop_powers.length);
                    if(!tch_child.__BLOCK){
                        target.loop_powers.forEach(t_child => { //Пробегаемся по всем мощностям родителя
                            //console.log("target.loop_powers.length", target.loop_powers.length);
                            console.log("target.loop_powers", target.loop_powers);
                            //target.line.classList.add("a9")
                            //Если мощноти принадлежат к одному циклу и начальное ребро одно - делим мощность на количество детей
                            if(tch_child.ids === t_child.ids && t_child.start_line === tch_child.start_line){
                                console.log("IN STEP DIVIDE!!!");
                                console.log("tch_child division before", tch_child.division.getStr());

                                tch_child.division.multiply(target.children.length * t_child.division.getNum());
                                tch_child.__BLOCK = true;
                                console.log("tch_child.division after", tch_child.division.getStr());
                                //targetChild.line.classList.add("a5");

                            }
                        })
                    }
                })
            })
        } else if(target.children.length === 1){
            console.warn("target.children.length === 1");
            if(target.children[0].loop_powers){
                target.children[0].loop_powers.forEach(child => {
                    console.warn("child", child)
                    target.loop_powers.forEach(parent => {
                        console.warn("parent", parent)
                        if(!child.__BLOCK){
                            console.warn("NOT BLOCK");
                            //target.children[0].line.classList.add("a5");
                            if(target.children[0].sideIn.includes(target)){
                                console.warn("FIRST");
                                console.log("SIDE INNNNNNNNNNNNNNNNNNNNNNN before", child.division.getStr());
                                child.division.plus(parent.division).divide(target.children[0].parents.length ** target.children[0].parents.length);
                                console.log("SIDE INNNNNNNNNNNNNNNNNNNNNNN after", child.division.getStr());
                                child.__BLOCK = true
                            } else {
                                console.warn("SECOND");
                                if(child.ids === parent.ids && child.start_line === parent.start_line ){ //&& parent.division.getNum() > child.division.getNum()
                                    console.log("SET DIVISION to", child.division.getStr(), "parent power ", parent.division.getStr());
                                    child.division = parent.division.clone();
                                }
                            }
                        }
                    })
                })
            }
        }

    }

    //Уравнение арнольда
    if(target.already && power.getStr() !== fullPower.getStr()) {
        arnold(target, lastTarget, power);
    }

    target.already = true; //Ставим флаг, что мы прошли эту грань

    if(target.children.length === 0){ //Если детей нет, значит это выход и нужно записать результат
        // console.log("FINISH ZONE ", target.power.getStr());
        // console.log("FINISH last target power ", lastTarget.children[0].power.getStr());
        CNV.preventRender(() => target.line.classList.add("finishLine"));
        text({target, output: state.results})
    }

    //Функционал работает плохо, потому что мы не идём по пути, а просто начинаем идти его сторону. Но это работает,
    //на простых примерах. Нужно дописать нормально.
    if(state.mode === "analyze"){
        if(canGOres === false && state.path){ //Вариант, если в нас входит цикл. Значит нужно пойти в его сторону. Вот мы и идём
            // follow(state.path);
            let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
            step(state.path[1], transmittingPower, target);
            // target.children.forEach(item => {
            //     let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
            //     step(item, transmittingPower, target);
            // })
        } else { //Иначе просто идём по всем нашим детям
            target.children.forEach(item => {
                //new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
                let transmittingPower = calcPower(target, item);
                step(item, transmittingPower, target);
            })
        }
        target.already = false; //Как только по всем детям прошлись, уходим назад и убираем флаг
    }
}

export default step;