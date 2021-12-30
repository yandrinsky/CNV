import findCycles from "./fincCycles";

function cyclesOptimize(start){
    const cycles = findCycles(start);
    const res = [];
    let len = cycles.length;
    //проходим по циклам
    for (let i = 0; i < len; i++) {
        let start = cycles[i][0].ids.line;
        let end = cycles[i][cycles[i].length - 1].ids.line;
        let preend = cycles[i][cycles[i].length - 2]?.ids.line;
        res.push({
            start,
            end,
            cycles: [cycles[i]],
        })
        //если начало и конец циклов совпадают, группируем циклы
        for (let j = i + 1; j < len; j++) {
            if(cycles[j][0].ids.line === start && cycles[j][cycles[j].length - 1].ids.line === end &&
                cycles[j][cycles[j].length - 2].ids.line !== preend
            ){
                res[res.length - 1].cycles.push(...cycles.splice(j, 1));
                len -= 1;
                j -= 1;
            }
        }
    }
    let len2 = res.length;
    for (let i = 0; i < len2; i++) {

        if(res[i].cycles.length === 1){   //Удаляем ячейки с единсвенным циклом
            res.splice(i, 1);
            len2 -= 1;
        } else { //Иначе проставляем всем цилам предпоследней линии цикла флаг cycle, чтобы предотвратить Арнольда
            res[i].cycles.forEach(cycle => {
                cycle[cycle.length - 2].cycle = true;
                cycle[cycle.length - 2].__BREAK = true;
            })
        }
    }

    res.forEach(cycleGroup => {
        console.log(cycleGroup);
        let lastCycle = cycleGroup.cycles[cycleGroup.cycles.length - 1];
        lastCycle[lastCycle.length - 2].cycle = false;
        lastCycle[lastCycle.length - 2].__BREAK = false;
        lastCycle[lastCycle.length - 2].__GET_POWER_FOR = [];
        cycleGroup.cycles.slice(0, cycleGroup.cycles.length - 1).forEach(cycle => {
            lastCycle[lastCycle.length - 2].__GET_POWER_FOR.push(cycle[cycle.length - 2]);
        })
    })
    return res;
}

export default cyclesOptimize;