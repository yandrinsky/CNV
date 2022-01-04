import Fraction from "../Fraction";
import state from "./analyzeState";
import step from "./step";

function follow(path){
    let no_error = true;
    console.log("FOLLOW");
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
                firstPower = new Fraction(parent.power.getNum(), parent.power.getDet() * parent.children.length);
                break;
            } else {
                no_error = false;
                break;
            }

        }
    }

    if(no_error){
        if(firstPower === undefined){
            firstPower = new Fraction(1);
        }

        if(path.length === 1){
            if(!step(path[0], firstPower, firstLastTarget)){
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
                        let res = step(line, new Fraction(parent.power.getNum(), parent.power.getDet() * parent.children.length), path[index - 1]);
                        if(res === false){
                            no_error = false;
                            break;
                        }
                    } catch (e){
                        no_error = false;
                        console.error("Функция follow встретила на пути ветку с мощностью undefined");
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