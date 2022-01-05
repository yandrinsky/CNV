import exactCycle from "./exactCycle";
import Fraction from "../Fraction";


function arnold(target, lastTarget, power){
    console.log("Арнольд");
    let cycle = exactCycle(target, lastTarget);
    cycle = cycle.slice(1, cycle.length - 1);
    let lastTargetPower = lastTarget.power.clone();
    let sideInSum = new Fraction(0);


    for (let i = 0; i < cycle.length; i++) {
        let line = cycle[i];
        if(line.sideIn.length > 0){
            let sum = new Fraction(0);
            for (let j = 0; j < line.sideIn.length; j++) {
                sum.plus(line.sideIn[j].power);
                sideInSum.plus(line.sideIn[j].power);
            }
            for (let j = i; j < cycle.length; j++) {
                cycle[j].power.minus(sum);
            }
        }
        if(line.children.length > 1){
            for (let j = i; j < cycle.length; j++) {
                //console.log("after divide",cycle[j].power.divide(line.children.length).getStr());
                sideInSum.divide(2);
            }
        }
    }


    target.power.minus(lastTargetPower);

    power = lastTarget.power;

    lastTarget.cycle = true; //Сразу ставим флаг взодящей грани в значение true, чтобы больше по нему не проходить
    //Вычитаем из общей мощности переданную от входящей грани, потому что сейчас будет арнольд, а не простое сложение
    //target.power.minus(power.getNum(), power.getDet());


    console.log("target power: ", target.power.getStr());
    console.log("income power: ", power.getStr());
    //1.5
    let kx = target.power.clone().divide(power).minus(1);
    //2
    console.log('sideInSum', sideInSum.getStr());
    target.power.plus(sideInSum);
    //3
    let tmp = target.power.clone().divide(power);
    //4
    let x = tmp.clone().divide(kx);
    //5
    power.multiply(x);
    //6
    target.power.plus(power); //Меняем мощность у текущей грани, арнольд готов

    for (let i = 0; i < cycle.length - 1; i++) {
        cycle[i].power.multiply(x);
    }
    console.log("x", x.getStr());
    console.log("final target power", target.power.getStr());
}

export default arnold;