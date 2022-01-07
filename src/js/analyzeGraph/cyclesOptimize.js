import findCycles from "./fincCycles";

function cyclesOptimize(start){
    const cycles = findCycles(start);
    const cyclesLoop = findCycles(start);
    const res = [];
    const resLoop = [];
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
        resLoop.push({
            start,
            end,
            cycles: [cycles[i]],
        })

        //если начало и конец циклов совпадают, группируем циклы
        for (let j = i + 1; j < len; j++) {
            if(cycles[j][0].ids.line === start && cycles[j][cycles[j].length - 1].ids.line === end
            ){
                if(cycles[j][cycles[j].length - 2].ids.line === preend){
                    resLoop[resLoop.length - 1].cycles.push(cycles[j]);
                } else {
                    res[res.length - 1].cycles.push(...cycles.splice(j, 1));
                    len -= 1;
                    j -= 1;
                }

            }
        }
    }


    let len3 = resLoop.length;
    for (let i = 0; i < len3; i++) {
        if(resLoop[i].cycles.length === 1){   //Удаляем ячейки с единсвенным циклом
            resLoop.splice(i, 1);
            len3 -= 1;
        }
    }
    resLoop.forEach(cyclePath => {
        for (let i = 0; i < cyclePath.cycles.length; i++) {
            let goingCycle = cyclePath.cycles[i];
            for (let l = 0; l < goingCycle.length; l++) { //Проходим по циклу
                let curLine = goingCycle[l];
                if(curLine.children.length > 1){
                    for (let j = 0; j < curLine.children.length; j++) {
                        let child = curLine.children[j];

                        if(!goingCycle.includes(child)){ //Если текущий цикл не содержит эту линию
                            for (let k = 0; k < cyclePath.cycles.length; k++) {
                                let loopCycle = cyclePath.cycles[k];
                                if(loopCycle.includes(child) && loopCycle.length > goingCycle.length){
                                    child.__LOOPSTART = true;
                                    //child.line.classList.add("a2");
                                }
                            }
                        }
                    }
                }
            }

        }


        // let minCycle = cyclePath.cycles[0];
        // let minLength = cyclePath.cycles[0].length;
        //
        // for (let i = 1; i < cyclePath.cycles.length; i++) {
        //     let cycle = cyclePath.cycles[i];
        //     if(cycle.length < minLength){
        //         minLength = cycle.length;
        //         minCycle = cycle;
        //     }
        // }
        // minCycle.forEach(line => {
        //     line.line.classList.add("a6");
        // })
    })


    let len2 = res.length;
    for (let i = 0; i < len2; i++) {
        if(res[i].cycles.length === 1){   //Удаляем ячейки с единсвенным циклом
            res.splice(i, 1);
            len2 -= 1;
        } else { //Иначе проставляем всем цилам предпоследней линии цикла флаг cycle, чтобы предотвратить Арнольда
            res[i].cycles.forEach(cycle => {
                cycle[cycle.length - 2].cycle = true;
                cycle[cycle.length - 2].__BREAK = true;
                //cycle[cycle.length - 2].line.classList.add("a9");
            })
        }
    }

    res.forEach(cycleGroup => {
        let max = cycleGroup.cycles[0].length;
        let maxCycle = cycleGroup.cycles[0];
        for (let i = 1; i < cycleGroup.cycles.length; i++) {
            let cycle = cycleGroup.cycles[i];
            if(cycle.length > maxCycle.length){
                maxCycle = cycle;
                max = cycle.length;
            }
        }

        //let lastCycle = cycleGroup.cycles[cycleGroup.cycles.length - 1];
        let lastCycle = maxCycle;

        lastCycle[lastCycle.length - 2].cycle = false;
        lastCycle[lastCycle.length - 2].__BREAK = false;
        //lastCycle[lastCycle.length - 2].line.classList.remove("a9");

        lastCycle[lastCycle.length - 2].__GET_POWER_FOR = [];

        cycleGroup.cycles.forEach(cycle => {
            if(lastCycle !== cycle){
                lastCycle[lastCycle.length - 2].__GET_POWER_FOR.push(cycle[cycle.length - 2]);
            }
        })
    })
    return res;
}

export default cyclesOptimize;