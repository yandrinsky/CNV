import state from "./analyzeState";
import text from "./text";
import {SHOW_CYCLES, SHOW_PRIORITIES} from "../SETTINGS";
import showCycles from "./showCycles";
import findCycles from "./fincCycles";

let test_1;

function collecting_statistics(lines, startLine){
    let flag = false;
    let start_key = -1;
    let count = 0;
    let index = 1;
    let i = 0;
    let loop = 0;

    for(let key in lines){
        if (start_key === -1) start_key = key;
        lines[key].branch_index = -1;
    }
    let count_loops = findCycles(startLine).length;
    console.log(findCycles(startLine));
    let statistic_obj = {
        number_of_branches: 1,
        number_of_plots: 0,
        number_of_mergers: 0,
        number_of_loops: count_loops,
    }
    test_1 = lines[start_key];
    while (flag === false){
        while (test_1.children[0] != undefined && test_1.children[0].branch_index === -1){
            if(test_1.children[1] !== undefined) count++;
            test_1 = test_1.children[0];
            test_1.branch_index = index;
            if(test_1.parents[1] !== undefined){
                while(test_1.parents[i] !== undefined){
                     if(test_1.parents[i].__CYCLEEND){
                        loop += 1;
                     } 
                     i++;
                }
                i = 0;
                statistic_obj.number_of_mergers += test_1.parents.length - loop - 1;
            }
            loop = 0;
        }
        while ((test_1.children[1] === undefined || test_1.children[1].branch_index != -1) && test_1.parents[0] != undefined){
            test_1 = test_1.parents[0];
        }
        if (test_1.children[1] === undefined && test_1.parents[0] === undefined) flag = true;
        else if (test_1.parents[0] === undefined && test_1.children[1].branch_index != -1) flag = true;
        if (!flag){
            index += 1;
            test_1 = test_1.children[1];
            test_1.branch_index = index;
            if(test_1.parents[1] !== undefined){
                while(test_1.parents[i] !== undefined){
                     if(test_1.parents[i].__CYCLEEND){
                        loop += 1;
                     } 
                     i++;
                }
                i = 0;
                statistic_obj.number_of_mergers += test_1.parents.length - loop - 1;
                loop = 0;
            }
        }
    }
    statistic_obj.number_of_branches = count;
    return statistic_obj;
}

export {collecting_statistics}