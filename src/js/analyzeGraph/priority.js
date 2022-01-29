import state from "./analyzeState";
import text from "./text";
import {SHOW_PRIORITIES} from "../SETTINGS";

let test_1;

function collecting_statistics(lines){
    let flag = false, flag_2 = false;;
    let start_key = -1;
    let count = 0;
    let count_loops = 0;
    let index = 1;
    let i = 0;
    let statistic_obj = {
        number_of_branches: 0,
        number_of_plots: 0,
        number_of_mergers: 0,
        number_of_loops: 0,
    }
    for(let key in lines){
        if (start_key === -1) start_key = key;
        lines[key].branch_index = -1;
    }
    test_1 = lines[start_key];
    while (flag === false){
        while (test_1.children[0] != undefined && test_1.children[0].branch_index === -1){
            test_1 = test_1.children[0];
            test_1.branch_index = index;
            if(test_1.parents[1] !== undefined){
                while(test_1.parents[i] !== undefined){
                     if(test_1.parents[i].__CYCLEEND){
                        count_loops += 1;
                        flag_2 = true;
                     } 
                     i++;
                }
                if (!flag_2) statistic_obj.number_of_mergers += 1;
                else statistic_obj.number_of_loops += count_loops;
            }
            flag_2 = false;
            count_loops = 0;
        }
        while ((test_1.children[1] === undefined || test_1.children[1].branch_index != -1) && test_1.parents[0] != undefined){
            if(test_1.children[1] !== undefined) count++;
            test_1 = test_1.parents[0];
        }
        if(test_1.children[1] !== undefined) count++;
        if (test_1.children[1] === undefined && test_1.parents[0] === undefined) flag = true;
        else if (test_1.parents[0] === undefined && test_1.children[1].branch_index != -1) flag = true;
        if (!flag){
            index += 1;
            test_1 = test_1.children[1];
            test_1.branch_index = index;
        }
    }
    statistic_obj.number_of_branches = count;
    return statistic_obj;
}

export {collecting_statistics}