import exactCycle from "./exactCycle";
import Fraction from "../Fraction";


function arnold(target, lastTarget, power){
    let cycle = exactCycle(target, lastTarget);
    cycle = cycle.slice(1, cycle.length - 1);
    let lastTargetPower = lastTarget.power.clone();

    for (let i = 0; i < cycle.length; i++) {
        let line = cycle[i];
        // if(line.children.length > 1){
        //     for (let j = i; j < cycle.length; j++) {
        //         console.log("after divide",cycle[j].power.divide(line.children.length).getStr());
        //     }
        // }
        if(line.sideIn.length > 0){
            let sum = new Fraction(0);
            for (let j = 0; j < line.sideIn.length; j++) {
                sum.plus(line.sideIn[j].power);
                console.log("SUMM", sum.getStr());
            }
            for (let j = i; j < cycle.length; j++) {

                console.log(cycle[j].power.getStr(), " minus ", sum.getStr());
                cycle[j].power.minus(sum.getNum() * 2, sum.getDet());
                cycle[j].line.classList.add("a5");
                console.log("FINAL", cycle[j].power.getStr());
            }
        }
    }


    target.power.minus(lastTargetPower);

    power = lastTarget.power;

    lastTarget.cycle = true; //Сразу ставим флаг взодящей грани в значение true, чтобы больше по нему не проходить
    //Вычитаем из общей мощности переданную от входящей грани, потому что сейчас будет арнольд, а не простое сложение
    //target.power.minus(power.getNum(), power.getDet());

    console.log("Арнольд");
    console.log("target power: ", target.power.getStr());
    console.log("income power: ", power.getStr());

    let x = target.power.clone().divide(target.power.clone().divide(power).minus(1));
    target.power.plus(x); //Меняем мощность у текущей грани, арнольд готов

    console.log("x", x.getStr());
    console.log("final target power", target.power.getStr());
}

export default arnold;