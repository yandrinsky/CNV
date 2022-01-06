import Fraction from "../Fraction";
import state from "./analyzeState";
import canGo from "./canGo";
import CNV from "../CNV/library";
import text from "./text";
import {SHOW_PATH} from "../SETTINGS";
import arnold from "./arnold";


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
                    item.line.classList.add("a7");
                    target.power = undefined;
                    return false;
                }
            }


        }
        //Флаг break нужен для того, чтобы обратывать множественные Арнольды. Ставится в функции optimizeCycles
        if(item.power && !item.__BREAK) { //Если мощность была, складываем её
            fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
        }
    }

    if(target.__GET_POWER_FOR){ //Если есть этот массив, значит заберём все мощности из элементов массива (подробнее в файле)
        target.__GET_POWER_FOR.forEach(item => {
            fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
        })
    }

    if(fullPower.getNum() !== 0){
        target.power = fullPower;
    }

    //Если элемент является элементов мыходной ветки из цикла
    if(target.loop_powers && target.loop_powers.length > 0 && target.children.length > 1){
        target.children.forEach(targetChild => {    //Пробегаемся по всем детям
            targetChild.loop_powers.forEach(tch_child => { //Пробегаемся по всем мощностям ребёнка
                target.loop_powers.forEach(t_child => { //Пробегаемся по всем мощностям родителя
                    //Если мощноти принадлежат к одному циклу и начальное ребро одно - делим мощность на количество детей
                    if(tch_child.ids === t_child.ids && t_child.start_line === tch_child.start_line){
                        tch_child.power.divide(target.children.length);
                    }
                })
            })
        })
    }

    //Уравнение арнольда
    if(target.already && power.getStr() !== fullPower.getStr()) {
        arnold(target, lastTarget, power);
    }

    target.already = true; //Ставим флаг, что мы прошли эту грань

    if(target.children.length === 0){ //Если детей нет, значит это выход и нужно записать результат
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
                let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
                step(item, transmittingPower, target);
            })
        }
        target.already = false; //Как только по всем детям прошлись, уходим назад и убираем флаг
    }
}

export default step;