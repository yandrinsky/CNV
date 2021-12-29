import CNV from "../CNV/library";
import Fraction from "../Fraction";
import findCycles from "./fincCycles";
import canGo from "./canGo";

//props: lines,
function analyze(lines){
    CNV.combineRender(()=> {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
    })

    let startLines = [];
    let results = {};
    let controlSum = new Fraction(0);
    let path = undefined;
    let isPathMode = false;

    for(let key in lines){
        if(lines[key].parents.length === 0){
            startLines.push(lines[key])
        }
    }
    if(startLines.length > 1){
        alert("Путь имеет разрывы. Анализ невозможен");
        console.log(startLines)
        return;
    }

    const cycles = findCycles(startLines[0]);
    console.log(cycles);

    //showCycles(startLines[0]);

    function follow(path, power){
        path.forEach(pathStep => {
            step(pathStep);
        })
    }


    let count = 0;
    function step(target, power, lastTarget){
        let canGOres;

        //Логи дебага
        //console.log("incoming power", power.getStr(), power);
        //console.log("lastTarget power", lastTarget?.power.getStr(), lastTarget?.power);

        target.power = power;


        //target.line.classList.add("orange");
        //Если этот элемент является циклом и мы уже о нём знаем - игнорируем.
        if(target.cycle) return;


        let fullPower = new Fraction(0);

        //Выделение пути обхода

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
            if(!item.power){
                canGOres = canGo(target, item);
                if(canGOres){
                    return;
                }else{
                    cycles.forEach(cycle=> {
                        if(cycle[0] === target && cycle[cycle.length - 2] === item){
                            path = cycle;
                        }
                    })
                }
            }
            if(item.power) {
                fullPower.plus(item.power.getNum(), item.power.getDet() * item.children.length);
            }
        }

        if(fullPower.getNum() !== 0){

            target.power = fullPower;
        }

        //Логи дебага
        //console.log("counted power (fullPower)", target.power.getStr(), target.power);

        //Уравнение арнольда
        if(target.already && power.getStr() !== fullPower.getStr()) {
            //Логи дебага
            //console.log("!!!АРНОЛЬД!!!");
            //console.log("In Arnold power incoming", "fullpower", power.getStr(), fullPower.getStr());
            lastTarget.cycle = true;
            fullPower.minus(power.getNum(), power.getDet());

            let kx = target.power.clone().divide(power.getNum(), power.getDet());
            //console.log("kx here", kx.getStr());
            kx.minus(1);
            let x = fullPower.clone().divide(kx.getNum(), kx.getDet());
            //console.log("x here", x.getStr());
            target.power.plus(x.getNum(), x.getDet());
            //console.log("fullPower here", fullPower.getStr());

            //console.log("x, kx, fullPower is", x.getStr(), kx.getStr(), fullPower.getStr());
        }

        //console.log("myPower after Arnold", target.power.getStr());

        target.already = true;


        if(target.children.length === 0){
            CNV.preventRender(() => target.line.classList.add("finishLine"));
            results[target.ids.line] = {
                text: target.power.getStr(),
                x: target.endCircle.link.start.x + 10 + CNV.state.shift.x,
                y: target.endCircle.link.start.y - 10 + CNV.state.shift.y,
                fontSize: "14",
                color: "green",
                data: {num: target.power.getNum(), det: target.power.getDet()}
            }
        }

        if(canGOres === false && path){
            let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
            //follow(path, target.power);
            //Логи дебага
            //console.warn("change path", "transmitting power", transmittingPower.getStr(), "target.children.length", target.children.length);
            //console.log(path);
            // CNV.querySelectorAll(".a2").forEach((item)=> {
            //     item.classList.remove("a5");
            // })
            // CNV.querySelectorAll(".a1").forEach((item)=> {
            //     item.classList.remove("a1");
            // })
            //
            // path.forEach((item, index)=>{
            //     console.log(index);
            //     if(index === 1){
            //         item.line.classList.add("a5");
            //     }else {
            //         item.line.classList.add("a1");
            //     }
            // })
            step(path[1], transmittingPower, target);
        } else {
            target.children.forEach(item => {
                let transmittingPower= new Fraction(target.power.getNum(), target.power.getDet() * target.children.length)
                //
                //console.log("transmitting power", transmittingPower.getStr());
                step(item, transmittingPower, target);
            })
        }

        // target.children.forEach(item => {
        //     step(item, new Fraction(target.power.getNum(), target.power.getDet() * target.children.length), target);
        // })

        setTimeout(()=>{
            target.line.classList.remove("a5");
        }, 1000 * (count - 1) + 500);

        target.already = false;
    }
    try{
        step(startLines[0], new Fraction(1));
        // step(startLines[0], 1);
        CNV.render();
        for(let key in results){
            controlSum.plus(results[key].data.num, results[key].data.det);
            CNV.text(results[key])
        }
        for(let key in lines){
            lines[key].power = undefined;
            lines[key].already = undefined;
            lines[key].cycle = undefined;
        }

        if(controlSum.getStr() !== "1"){
            alert("Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr());
        }
    } catch (e){
        for(let key in lines){
            lines[key].power = undefined;
            lines[key].already = undefined;
            lines[key].cycle = undefined;
        }
        console.error("Граф замкнут. Анализ невозможен", e);
    }
}

export default analyze;