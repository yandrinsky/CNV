import Fraction from "../Fraction";
import state from "./analyzeState";
import step from "./step";

function follow(path){
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
            firstLastTarget = parent;
            firstPower = new Fraction(parent.power.getNum(), parent.power.getDet() * parent.children.length);
            break;
        }
    }

    if(firstPower === undefined){
        firstPower = new Fraction(1);
    }

    path.forEach((line, index) => {
        if(index === 0){
            step(line, firstPower, firstLastTarget);
        } else {
            let parent = path[index - 1];
            step(line, new Fraction(parent.power.getNum(), parent.power.getDet() * parent.children.length), path[index - 1]);
        }
    })

    path.forEach(line => {
        line.already = false;
    })

    state.mode = "analyze";
}

export default follow;