import Fraction from "../Fraction";

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

export default canGo;