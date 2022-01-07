import Fraction from "../Fraction";
import state from "./analyzeState";
import step from "./step";
import {NUMERIC_POWER, START_POWER} from "../SETTINGS";
import calcPower from "./calcPower";


function follow(path){
    let no_error = true;

    state.mode = "follow";
    let firstPower;
    let firstLastTarget;
    for (let i = 0; i < path[0].parents.length; i++) {
        let parent = path[0].parents[i];
        let flag = true;
        parent.sideIn.forEach(sideInParent => {
            if(sideInParent === parent){
                flag = false;
            }
        })
        if(flag){
            if(parent.power){
                firstLastTarget = parent;
                //firstPower = new Fraction(parent.power.getNum(), parent.power.getDet() * parent.children.length);
                firstPower = calcPower(parent);
                break;
            } else {
                no_error = false;
                break;
            }

        }
    }

    if(no_error){
        if(firstPower === undefined){
            firstPower = NUMERIC_POWER ? new Fraction(START_POWER) : new Fraction(1);
        }

        if(path.length === 1){
            //console.warn("path length === 1", path[0], firstPower.getStr(), firstLastTarget);
            if(step(path[0], firstPower, firstLastTarget) === false){
                no_error = false;
            }
        } else {
            for (let i = 0; i < path.length; i++) {
                let index = i;
                let line = path[i];
                if(index === 0){
                    step(path[0], firstPower, firstLastTarget)
                } else {
                    let parent = path[index - 1];
                    try{
                        //let res = step(line, new Fraction(parent.power.getNum(), parent.power.getDet() * parent.children.length), path[index - 1]);
                        let res = step(line, calcPower(parent), path[index - 1]);
                        if(res === false){
                            no_error = false;
                            break;
                        }
                    } catch (e){
                        no_error = false;
                        console.error("Функция follow встретила на пути ветку с мощностью undefined", e);
                        break;
                    }

                }
            }
        }

    }


    path.forEach(line => {
        line.already = false;
    })

    state.mode = "analyze";
    return no_error;
}

export default follow;