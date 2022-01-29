import Fraction from "../Fraction";
import CNV from "../CNV/library";
import Store from "../Store";


let count = 0;


function canGo(target, incoming){
    console.warn("start canGo")
    console.log("step")
    // console.log("target", target);
    // console.log("incoming", incoming);

    const toFix2 = {}; //{was, link}

    function step(curTarget, lastTarget){
        //let power = lastTarget.power ? new Fraction(lastTarget.power.getNum(), lastTarget.power.getDet() * lastTarget.children.length) : curTarget.power;
        let power = lastTarget ? new Fraction(lastTarget.power.getNum(), lastTarget.power.getDet() * lastTarget.children.length) : new Fraction(1)

        // if(target.line.classList.contains("a7")) target.line.classList.add("a3");
        // target.line.classList.add("a7")

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

        curTarget.power = fullPower;

        if(curTarget.__CANGO__CHECKED && power.getStr() !== fullPower.getStr()) {
            //Логи дебага
            console.log("CANGO !!!АРНОЛЬД!!!");
            console.log("curTarget.power before ARNOLD CANGO", curTarget.power.getStr());
            //console.log("In Arnold power incoming", "fullpower", power.getStr(), fullPower.getStr());
            lastTarget.__CYCLEEND = true;
            fullPower.minus(power.getNum(), power.getDet());
            let kx = curTarget.power.clone().divide(power.getNum(), power.getDet());
            //console.log("kx here", kx.getStr());
            kx.minus(1);
            let x = fullPower.clone().divide(kx.getNum(), kx.getDet());
            //console.log("x here", x.getStr());
            curTarget.power.plus(x.getNum(), x.getDet());
            console.log("curTarget.power after ARNOLD CANGO", curTarget.power.getStr());
            //console.log("fullPower here", fullPower.getStr());

            //console.log("x, kx, fullPower is", x.getStr(), kx.getStr(), fullPower.getStr());
        }


        curTarget.__CANGO__CHECKED = true;

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

        for(let i = 0; i < target.parents.length; i++) {
            let item = target.parents[i];
            //if(item === incoming) console.log("root PREFOUND", item.power)
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
    }

    let isPossible = false;


    root(target);

    for(let key in toFix2){
        toFix2[key].link.power = toFix2[key].was === undefined ? undefined : new Fraction(toFix2[key].was[0], toFix2[key].was[1]);
    }

    console.warn("end canGo", isPossible)
    return isPossible;
}

function canGo2(target, incoming){
    let mainRes = false;
    function step(){

    }

    function root(target){
        if(!mainRes){
            for(let i = 0; i < target.parents.length; i++) {//Не так! Тут сразу родители, а нужно на детей.
                let item = target.parents[i];
                if(item.power){
                    if(step(item, target)){
                        mainRes = true;
                        console.log("IS POSSIBLE")
                        return;
                    }
                }
                if(!item.__CYCLEEND) root(item)
            }
            target.__CANGO__CHECKED = true;
            return mainRes;
        } else {
            return mainRes;
        }
    }

    return mainRes;
}

function canGo3(target, incoming){
    const state = Store.getState();
    for(let i = 0; i < state.cycles.length; i++){
        const cycle = state.cycles[i];
        if(cycle[0] === target && cycle[cycle.length - 2] === incoming){
            return false;
        }
    }
    return true;
    // state.cycles.forEach(cycle => {
    //
    // })
}
export default canGo3;