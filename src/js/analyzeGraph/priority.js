import state from "./analyzeState";
import text from "./text";

let test_1;
let test_2;
let test_3;

function special_bypass(branch, count){
    for (let i = 0; i < branch.sideIn.length; i++){
        let priority;
        let save;
        if (branch.children[0].branch_index === branch.branch_index) priority = branch.children[0].bypass_priority;
        else priority = branch.children[0].bypass_priority + 1;
        save = priority;
        if(branch.sideIn[i].bypass_priority === -1 && branch.sideIn[i].visited === true){
            test_2 = branch.sideIn[i];
            while (test_2.children[1] === undefined && test_2.parents[0] != undefined) {
                test_2.bypass_priority = priority + 1;
                for (let j = 0; j < test_2.sideIn.length; j++){
                    if(test_2.sideIn[i].bypass_priority === -1 && branch.sideIn[i].visited === true){
                        priority = test_2.bypass_priority;
                        if(test_2.parents[0].branch_index != test_2.branch_index){
                            count -= 1;
                        }
                        test_2 = test_2.sideIn[i];
                    }
                }
                test_2.bypass_priority = priority + 1;
                test_2 = test_2.parents[0]
            }
            if(branch.parents[0].branch_index != branch.branch_index){
                count -= 1;
            }
        }
    }
    return count;
}

function primary_bypass(lines){
    let flag = false;
    let flag_2 = false;
    let start_key = -1;
    let priority;
    let priority_2;
    let count = 0;
    let index = 1;
    for(let key in lines){
        if (start_key === -1) start_key = key;
        lines[key].bypass_priority = 1;
        lines[key].branch_index = -1;
        lines[key].other_priorities = [];
        lines[key].visited = false;
        lines[key].visited_2 = false;
    }
    test_1 = lines[start_key];
    while (flag === false){
        while (test_1.children[0] != undefined && test_1.children[0].branch_index === -1 && flag_2 === false){
            for (let i = 0; i < test_1.children[0].sideIn.length; i++){
                if(test_1.children[0].sideIn[i] === test_1) flag_2 = true;
            }
            if (!flag_2){
                test_1 = test_1.children[0];
                test_1.branch_index = index;
            }
        }
        if (flag_2){
            count += 1;
            while (test_1.children[1] === undefined && test_1.parents[0] != undefined){
                test_1.bypass_priority = -1;
                test_1 = test_1.parents[0];
            }
        }
        flag_2 = false;
        test_2 = test_1;
        if (test_1.children[0] != undefined && test_2.branch_index === test_1.children[0].branch_index) flag_2 = true;
        if (test_1.children[1] != undefined && test_2.branch_index === test_1.children[1].branch_index) flag_2 = true;
        while (test_2.children[1] === undefined && test_2.parents[0] != undefined){
            test_2 = test_2.parents[0];
        }
        if (test_1.children[0] != undefined){
            if (test_1.children[0].branch_index != -1 && (!test_1.__CYCLEEND || test_1.children[0].branch_index != test_2.branch_index || !flag_2) && test_1.children[0].bypass_priority != -1){
                priority = test_1.children[0].bypass_priority + 1;
                while (test_1.children[1] === undefined){
                    test_1.bypass_priority = priority;
                    //test_1.branch_index = index;
                    test_1 = test_1.parents[0];
                }
            }
            else if(test_1.children[0].bypass_priority === -1 && test_1.children[1] === undefined){
                count += 1;
                while (test_1.children[1] === undefined){
                    test_1.bypass_priority = -1;
                    //test_1.branch_index = index;
                    test_1 = test_1.parents[0];
                } 
            }
        }
        flag_2 = false;
        while ((test_1.children[1] === undefined || test_1.children[1].branch_index != -1) && test_1.parents[0] != undefined){
            test_1 = test_1.parents[0];
        }
        if (test_1.children[1] === undefined && test_1.parents[0] === undefined) flag = true;
        else if (test_1.parents[0] === undefined && test_1.children[1].branch_index != -1) flag = true;
        if (!flag){
            index += 1;
            test_1 = test_1.children[1];
            test_1.branch_index = index;
        }
    }
    flag = false;
    if (lines[start_key].children[0] != undefined) test_1 = lines[start_key].children[0];
    else test_1 = lines[start_key];
    while (flag === false){
        while (test_1.children[0] != undefined && (test_1.children[0].branch_index === test_1.branch_index || test_1.children[0].bypass_priority === -1) && test_1.children[0].visited === false){
            test_1 = test_1.children[0];
            test_1.visited = true;
        }
        if (test_1.bypass_priority === -1){
            if(test_1.branch_index != test_1.children[0].branch_index) priority = test_1.children[0].bypass_priority + 1;
            else priority = test_1.children[0].bypass_priority;
            count -= 1;
        }
        while ((test_1.children[1] === undefined || test_1.children[1].visited === true) && test_1.parents[0] != undefined){
            if (test_1.bypass_priority === -1){
                count = special_bypass(test_1, count); 
            }
            if (test_1.bypass_priority === -1){
                test_1.bypass_priority = priority;
            }
            test_1 = test_1.parents[0];
        }
        if (test_1.parents[0] === undefined && count === 0) flag = true;
        else if (test_1.parents[0] === undefined && (test_1.children[1] === undefined || test_1.children[1].visited === true )) {
            flag = true;
            console.log("error!");
        }
        if(test_1.children[1] != undefined){
            test_1 = test_1.children[1];
            test_1.visited = true;
        }
    }
    for (let key in lines){
        lines[key].visited = false;
    }
    flag = false;
    if (lines[start_key].children[0] != undefined) test_1 = lines[start_key].children[0];
    else test_1 = lines[start_key];
    while (flag === false){
        while (test_1.children[0] != undefined && test_1.children[0].branch_index === test_1.branch_index&& test_1.children[0].visited === false){
            test_1 = test_1.children[0];
            test_1.visited = true;
        }
        while ((test_1.children[1] === undefined || test_1.children[1].visited === true) && test_1.parents[0] != undefined){
            if (test_1.children[1] != undefined){
                priority = test_1.children[0].bypass_priority; 
                priority_2 = test_1.children[1].bypass_priority; 
                test_2 = test_1;
                while (test_2.parents[0] != undefined) {
                    if(priority != 1) test_2.other_priorities.push(priority);
                    if(priority_2 != 1) test_2.other_priorities.push(priority_2);
                    test_2 = test_2.parents[0];
                }
            }
            test_1 = test_1.parents[0];
        }

        if (test_1.parents[0] === undefined && (test_1.children[1] === undefined || test_1.children[1].visited === true)) {
            flag = true;
        }
        if(test_1.children[1] != undefined){
            test_1 = test_1.children[1];
            test_1.visited = true;
        }
    }
    for (let key in lines){
        text({
            aux: true,
            text: lines[key].bypass_priority,
            target: lines[key],
            output: state.results,
        })
    }
}

export {primary_bypass}