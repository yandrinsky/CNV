import exactCycle from "./exactCycle";
import Fraction from "../Fraction";


function arnold(target, lastTarget, power){
    console.log("Арнольд");
    let cycle = exactCycle(target, lastTarget)[0];
    cycle = cycle.slice(1, cycle.length - 1);
    let lastTargetPower = lastTarget.power.clone();
    let sideInSum = new Fraction(0);


    for (let i = 0; i < cycle.length; i++) {
        let line = cycle[i];

        if(line.sideIn.length > 0){
            for (let j = 0; j < line.sideIn.length; j++) {
                if(line.sideIn[j].loop_powers && line.sideIn[j].loop_powers.length > 0){ //Если линия выходит из какого-то арнольда
                    //console.log("LOOP POWERS", line.sideIn[j].loop_powers);
                    let findSuccess = false;
                    //Пробегаемся по всем мощностям входящей ветки и ищем ту,что является петлёй для текущего арнольда
                    for (let k = 0; k < line.sideIn[j].loop_powers.length; k++) {
                        let loop_child = line.sideIn[j].loop_powers[k];
                        let flag = false;
                        //пробегаемся по всем id мощности и находим совпадение с веткой арнольда (проверям, петля ли это)
                        for (let l = 0; l < loop_child.ids.length; l++) {
                            if(line.__CYCLEPATH_IDS.includes(loop_child.ids[l])){
                                console.log("ПЕТЛЯ!!!!!!!!!!", loop_child.power.getStr());
                                flag = true;
                                break;
                            }
                        }
                        if(flag){//Значит это петля.
                            //1) Вычитаем из мощности петли мощность родителя - арнольда. - это плюсуем в sideInSum
                            //2) Мощность родителя арнольда плюсуем в line.power
                            console.log("loop_child.power", loop_child.power.getStr());
                            console.log("line.sideIn[j].power", line.sideIn[j].power.getStr());
                            console.log("sideInSum before plus", sideInSum.getStr());
                            console.log("line.power before plus", line.power.getStr());
                            sideInSum.plus(line.sideIn[j].power.clone().minus(loop_child.power)); // side += петля - вх.арнод;
                            //line.power.plus(loop_child.power); //line += вх.арнольд
                            console.log("line power after loop IN", line.power.getStr());
                            console.log("sideInSum after loop IN", line.power.getStr());
                            findSuccess = true;
                            break;
                        }
                    }
                    if(!findSuccess){ //Если не одна из линий не оказалась для текущего арнольда петлёй, просто складываем в sideInSum
                        sideInSum.plus(line.sideIn[j].power);
                    }
                } else {
                    sideInSum.plus(line.sideIn[j].power);
                }
            }
        }

        line.power.minus(sideInSum);

        if(line.children.length > 1){
            line.__SIDEINPOWER_STEMP = sideInSum.clone();
            sideInSum.divide(line.children.length);

            //Передаём всем элемпентам петли мощность родителя - арнольда
            if(line.loop_children){
                line.loop_children.forEach((child, index) => {
                    let formPower = line.power.clone().divide(line.children.length);
                    let division;
                    child.target.loop_powers.forEach(power => {
                        if(power.power === child.power && power.division){
                            //console.log("child.division", power.division);
                            division = power.division;
                        }
                    })
                    if(division && division.getNum() !== 0){
                        console.log("GOT DIVISION in ARNOLD", division.getStr());
                        formPower.divide(division);
                    }
                    child.power.plus(formPower); //Изначально child.power = 0;


                    // console.log("SET POWER (line.power)", line.power.getStr());
                    // console.log("SET POWER (setted power)", child.power.getStr());
                    //
                    // console.log("AFTER SET child.target.loop_powers", child.target.loop_powers[0].power.getStr());
                    // console.log("child.power === child.target.loop_powers[0].power", child.power ===  child.target.loop_powers[0].power);
                    // line.line.classList.add("a5");
                    // child.target.line.classList.add("a6");
                })

            }

        }



        console.log("line power", line.power.getStr(), sideInSum.getStr());

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
    console.log("final income power", power.getStr());
    //6
    target.power.plus(power); //Меняем мощность у текущей грани, арнольд готов

    //Изменяем мощности у всего цикла
    for (let i = 0; i < cycle.length - 1; i++) {
        let line = cycle[i];
        line.power.multiply(x);
        if(line.__SIDEINPOWER_STEMP){
            line.power.plus(line.__SIDEINPOWER_STEMP);
        }
        if(line.loop_children){
            line.loop_children.forEach(child => {
                //1) Вычитаем из линии петли мощность родителя - арнольда
                //2) Умножаем переданную родителем арнольдом мощность на x
                if(child.target.power){
                    child.target.power.minus(child.power);
                    child.power.multiply(x);
                    child.target.power.plus(child.power);
                }

            })
        }
    }
    console.log("x", x.getStr());
    console.log("final target power", target.power.getStr());
}

export default arnold;