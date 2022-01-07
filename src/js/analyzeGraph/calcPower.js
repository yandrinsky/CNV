import {NUMERIC_POWER} from "../SETTINGS";

function calcPower(parent){
    if(NUMERIC_POWER){
        let power = parent.power.clone().divide(parent.children.length);
        if(power.getDet() === 2){
            if(parent.__MINUS_ONE){
                power = parent.power.clone().minus(parent.power.clone().minus(1).divide(parent.children.length));
            } else {
                power = parent.power.clone().minus(1).divide(parent.children.length);
                parent.__MINUS_ONE = true;
            }
        }
        console.log("calcPower result", power.getStr());
        return power;
    } else{
        return parent.power.clone().divide(parent.children.length);
    }

}
export default calcPower;