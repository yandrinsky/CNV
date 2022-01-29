import state from "./analyzeState";

function exactCycle(first, end){
    let cycles = state.cycles;
    let res = [];
    for (let i = 0; i < cycles.length; i++) {
        if(cycles[i][0] === first && cycles[i][cycles[i].length - 2] === end){
            res.push(cycles[i]);
        }
    }
    return res;
}

export default exactCycle;