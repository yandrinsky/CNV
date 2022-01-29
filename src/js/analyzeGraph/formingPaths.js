import uniqueId from "../CNV/uniqueId";
import Fraction from "../Fraction";
import state from "./analyzeState";
import text from "./text";


class Arn{
    constructor(){
        this.ids = [];
        this.power = undefined;
        this.division = undefined;
        this.start_line = undefined;
    }
}


class L_C_O{
    constructor(){
        this.target = undefined;
        this.power = undefined;
    }
}

function loop(edge_arnold, edge, lines){
    let flag = false;
    let flag_2 = false;
    let flag_3 = false;
    let test_1 = edge;
    let round_count = 0;
    let loop_children_obj = new L_C_O();
    let loop_powers_obj = new Arn();
    for(let key in lines){
        lines[key].visited_3 = false;
    }
    //edge_arnold.line.classList.add("a4")
    while (flag === false){
        while (test_1.children[0] !== undefined && flag_3 === false && test_1.children[0].visited_3 === false && (test_1.children[1] === undefined || (test_1.children[1].__LOOPSTART || (!test_1.children[1].__LOOPSTART && !test_1.children[0].__LOOPSTART)))){
            if(test_1.children[0].__CYCLEIN === true){
                if(test_1.children[0].children[0].visited_3 === false){
                    flag_3 = true;
                }
                //if(test_1.children[0].__CYCLEIN === true) test_1.children[0].line.classList.add("a2");
                // for(let i = 0; i < test_1.children[0].children[0].__CYCLEPATH_IDS.length; i++){
                //     if(test_1.children[0].__CYCLEPATH_IDS[0] === test_1.children[0].children[0].__CYCLEPATH_IDS[i] && test_1.children[0].children[0].visited_3 === false){
                //          flag_3 = true;
                //     }
                // }
            }
            //test_1.line.classList.add("a2");
            loop_children_obj.target = test_1;
            loop_children_obj.power = new Fraction(0);
            loop_powers_obj.ids = edge_arnold.__CYCLEPATH_IDS;
            loop_powers_obj.power = loop_children_obj.power;
            loop_powers_obj.division = new Fraction(1);
            loop_powers_obj.start_line = edge_arnold;
            test_1.loop_powers.push(loop_powers_obj);
            edge_arnold.loop_children.push(loop_children_obj);
            loop_powers_obj = new Arn();
            loop_children_obj = new L_C_O();
            test_1.visited_3 = true;
            test_1 = test_1.children[0];
            round_count += 1;
        }
        round_count = 0;
        flag_3 = false;
        if(test_1.visited_3 === false){
            //test_1.line.classList.add("a2")
            loop_children_obj.target = test_1;
            loop_children_obj.power = new Fraction(0);
            loop_powers_obj.ids = edge_arnold.__CYCLEPATH_IDS;
            loop_powers_obj.power = loop_children_obj.power;
            loop_powers_obj.start_line = edge_arnold;
            loop_powers_obj.division = new Fraction(1);
            test_1.loop_powers.push(loop_powers_obj);
            edge_arnold.loop_children.push(loop_children_obj);
            loop_powers_obj = new Arn();
            loop_children_obj = new L_C_O();
            test_1.visited_3 = true;
            round_count += 1;
        }
        while ((test_1.children[1] === undefined || test_1.children[1].visited_3 === true) && test_1.parents[0] != edge_arnold){
            for(let i = 0; i < test_1.sideIn.length; i++){
                if(test_1.sideIn[i] !== undefined && test_1.sideIn[i].visited_3 === true){
                    // && !test_1.sideIn[i].__CYCLEEND
                    flag_2 = true;
                    round_count = i;
                } 
            }
            if(!flag_2 )test_1 = test_1.parents[0];
            else test_1 = test_1.sideIn[round_count];
            flag_2 = false;
        }

        if ((test_1.parents[0] === edge_arnold || test_1.parents[0] === undefined) && (test_1.children[1] === undefined || test_1.children[1].visited_3 === true)) {
            flag = true;
        }
        flag_3 = false;
        if(test_1.children[1] != undefined && test_1.children[1].__CYCLEIN === true){
            if(test_1.children[1].children[0].visited_3 === false){
                flag_3 = true;
                loop_children_obj.target = test_1.children[1];
                loop_children_obj.power = new Fraction(0);
                loop_powers_obj.ids = edge_arnold.__CYCLEPATH_IDS;
                loop_powers_obj.power = loop_children_obj.power;
                loop_powers_obj.start_line = edge_arnold;
                loop_powers_obj.division = new Fraction(1);
                test_1.children[1].loop_powers.push(loop_powers_obj);
                edge_arnold.loop_children.push(loop_children_obj);
                loop_powers_obj = new Arn();
                loop_children_obj = new L_C_O();
                test_1.children[1].visited_3 = true;
                round_count += 1;
                test_1 = test_1.children[1];
            }
            // for(let i = 0; i < test_1.children[1].children[0].__CYCLEPATH_IDS.length; i++){
            //     if(test_1.children[1].__CYCLEPATH_IDS !== undefined && (test_1.children[1].__CYCLEPATH_IDS[0] === test_1.children[1].children[0].__CYCLEPATH_IDS[i] && test_1.children[1].children[0].visited_3 === false)){
            //          flag_3 = true;
            //     }
            //}
        }
        if(test_1.children[1] != undefined && flag_3 === false){
            test_1 = test_1.children[1];
            //test_1.line.classList.add("a2")
            //test_1.visited_3 = true;
        }
        else if(test_1.children[1] != undefined  && flag_3 === true){
            test_1.children[1].visited_3 = true;
            //test_1.children[1].line.classList.add("a2")
        }
        flag_3 = false;
    }
}


function compareNumeric(a, b) {
    if (a > b) return 1;
    if (a == b) return 0;
    if (a < b) return -1;
}

function branch_bypass(edge, test_path, path_2){
    let stop = false;
    let length_1;
    let length_2;
    let save;
    //if(edge.__LOOPSTART === true) edge.line.classList.add("a5")
    for(let i = 0; i < edge.parents.length; i++){
        if(edge.parents[i].__CYCLEPATH === true && edge.parents[i].children[1] !== undefined && (edge.parents[i].children[1].__CYCLEPATH === true && edge.parents[i].children[0].__CYCLEPATH === true) && edge.visited_3 !== true && edge.__LOOPSTART){
            loop(edge.parents[0], edge);
            //console.log("fuck you!");
            //edge.line.classList.add("a5")
        }
    }
    //if(edge.__LOOPSTART) edge.line.classList.add("a5")
    if(edge.children[0] != undefined && (edge.children[0].visited === false || (edge.children[1] != undefined && edge.children[1].visited === false))){
        if(edge.children[1] != undefined){
            //if(edge.children[1].__BREAK) edge.children[1].line.classList.add("a5")
            //if(edge.children[0].__BREAK) edge.children[0].line.classList.add("a5")
            if ((edge.children[1].__CYCLEPATH && !edge.children[1].__LOOPSTART && edge.children[1].visited === false && (!edge.children[0].__BREAK || edge.children[0].visited === true) || (edge.children[1].__BREAK && edge.children[1].visited === false))){
                edge = edge.children[1];
                if (edge.visited_2 === false){
                    test_path.push(edge);
                    edge.visited_2 = true
                }
                path_2.push(edge);
                //if(edge.__BREAK) edge.line.classList.add("a5")
                if(edge.__BREAK){
                    edge.visited = true;
                    edge = edge.parents[0].children[0];
                    test_path.push(edge);
                    edge.visited_2 = true
                }
            }
            else if ((edge.children[0].__CYCLEPATH && !edge.children[0].__LOOPSTART && edge.children[0].visited === false) || (edge.children[0].__BREAK && edge.children[0].visited === false)){
                edge = edge.children[0];
                if (edge.visited_2 === false){
                    test_path.push(edge);
                    edge.visited_2 = true
                }
                path_2.push(edge);
                //if(edge.__BREAK) edge.line.classList.add("a5")
                if(edge.__BREAK){
                    edge.visited = true;
                    edge = edge.parents[0].children[1];
                    test_path.push(edge);
                    edge.visited_2 = true
                }
            }
            else{
                edge.children[0].other_priorities.sort(compareNumeric);
                edge.children[1].other_priorities.sort(compareNumeric);
                length_1 = edge.children[0].other_priorities.length;
                length_2 = edge.children[1].other_priorities.length;
                if (edge.children[0].other_priorities[ length_1 - 1] === undefined) edge.children[0].other_priorities.push(-100)
                if (edge.children[1].other_priorities[ length_2 - 1] === undefined) edge.children[1].other_priorities.push(-100)
                length_1 = edge.children[0].other_priorities.length;
                length_2 = edge.children[1].other_priorities.length;
                //console.log((edge.children[1].other_priorities[ length_2 - 1] === -100) && (edge.children[0].other_priorities[length_1 - 1] != -100) && (edge.children[1].bypass_priority > edge.children[0].other_priorities[length_1 - 1]))
                if ((edge.children[0].other_priorities[ length_1 - 1] < edge.children[1].other_priorities[length_2 - 1]) && edge.children[1].visited === false && edge.children[0].other_priorities[ length_1 - 1] != -100){
                    edge = edge.children[1];
                    if (edge.visited_2 === false){
                        test_path.push(edge);
                        edge.visited_2 = true
                    }
                    path_2.push(edge);
                    if (edge.other_priorities[length_2 - 1] != -100) save = edge.other_priorities[length_2 - 1];
                    edge.other_priorities.pop();
                }
                else if(edge.children[1].visited === false && (edge.children[0].other_priorities[ length_1 - 1] === -100) && (edge.children[1].other_priorities[length_2 - 1] != -100) && (edge.children[0].bypass_priority < edge.children[1].other_priorities[length_2 - 1])){
                    edge = edge.children[1];
                    if (edge.visited_2 === false){
                        test_path.push(edge);
                        edge.visited_2 = true
                    }
                    path_2.push(edge);
                    if (edge.other_priorities[length_2 - 1] != -100) save = edge.other_priorities[length_2 - 1];
                    edge.other_priorities.pop();
                }
                else if(edge.children[1].visited === false && (edge.children[1].other_priorities[ length_2 - 1] === -100) && (edge.children[0].other_priorities[length_1 - 1] != -100) && (edge.children[1].bypass_priority > edge.children[0].other_priorities[length_1 - 1])){
                    edge = edge.children[1];
                    if (edge.visited_2 === false){
                        test_path.push(edge);
                        edge.visited_2 = true
                    }
                    path_2.push(edge);
                    if (edge.other_priorities[length_2 - 1] != -100) save = edge.other_priorities[length_2 - 1];
                    edge.other_priorities.pop();
                }
                else{
                    //console.log((((edge.children[0].other_priorities[ length_1 - 1] <= edge.children[1].bypass_priority) && (edge.children[1].other_priorities[ length_2 - 1] > edge.children[0].bypass_priority)) || edge.children[0].visited === true) && edge.children[1].visited === false)
                    // console.log((edge.children[0].other_priorities[ length_1 - 1] <= edge.children[1].bypass_priority) || edge.children[0].visited === true)
                    // console.log(((edge.children[0].other_priorities[ length_1 - 1] <= edge.children[1].bypass_priority) || edge.children[0].visited === true) && edge.children[1].visited === false)
                    if((((edge.children[1].bypass_priority > edge.children[0].bypass_priority) && (edge.children[0].other_priorities[ length_1 - 1] === edge.children[1].other_priorities[length_2 - 1]) || (edge.children[0].other_priorities[ length_1 - 1] === edge.children[1].bypass_priority)) || edge.children[0].visited === true) && edge.children[1].visited === false){
                        edge = edge.children[1];
                        if (edge.visited_2 === false){
                            test_path.push(edge);
                            edge.visited_2 = true
                        }
                        path_2.push(edge);
                        if (edge.other_priorities[length_2 - 1] != -100) save = edge.other_priorities[length_2 - 1];
                        edge.other_priorities.pop(); 
                    }
                    else if (edge.children[0].visited === false){
                        edge = edge.children[0];
                        if (edge.visited_2 === false){
                            test_path.push(edge);
                            edge.visited_2 = true
                        }
                        path_2.push(edge);
                        if (edge.other_priorities[length_1 - 1] != -100) save = edge.other_priorities[length_1 - 1];
                        edge.other_priorities.pop();
                    }
                }  
            }
        }
        else{
            edge = edge.children[0];
            if (edge.visited_2 === false){
                test_path.push(edge);
                edge.visited_2 = true
            }
            path_2.push(edge);
        }
        if(edge.children[0] != undefined){
            for (let i = 0; i < edge.children[0].sideIn.length; i++){
                let flag_3 = false;
                let flag_4 = false;
                if(edge === edge.children[0].sideIn[i]){
                    if(edge.__CYCLEEND && !edge.__BREAK) test_path.push(edge.children[0])
                    //if(edge.__CYCLEEND) test_path.push(edge.children[0].children[0])
                    // if(edge.__CYCLEEND) test_path.push(edge)
                    // if(edge.__CYCLEEND) test_path.push(edge.children[0])

                    else flag_3 = true;
                    stop = true;
                    while((edge.children[1] === undefined || (edge.children[1].visited === true && edge.children[0].visited === true)) && edge.parents[0] != undefined){
                        //if(flag_3 === true && flag_4 === true) edge.other_priorities.push(save);
                        if(edge.parents[0].children[1] !== undefined) flag_4 = true;
                        edge.visited = true;
                        edge = edge.parents[0];
                    }
                    flag_3 = false;
                    flag_4 = false;
                }
            }
        }
    }
    else{
        while((edge.children[1] === undefined || (edge.children[1].visited === true && edge.children[0].visited === true)) && edge.parents[0] != undefined){
            edge.visited = true;
            edge = edge.parents[0];
        }
        stop = true;
    }
    return stop;
}

class Path{
    constructor(){
        this.path = [];
        this.passed = false;
        this.path_2 = [];
        this.cycle = false;
        this.passed_count = 0;
    }
}

function forming_paths(lines){
    let start_line;
    let flag_cycle = false;
    let all_path = []; 
    let flag = false;
    let keys = Object.keys(lines);

    for(let key in lines){
        lines[key].visited = false;
        lines[key].visited_2 = false;
    }
    start_line = lines[keys[0]];
    let obj_path = new Path();
    if (start_line.children[0] != undefined) 
    {
        obj_path.path.push(start_line);
        obj_path.path_2.push(start_line);
    }
    else flag = true;

    if(!flag){
        while(start_line.children[0].visited === false || (start_line.children[1] != undefined && start_line.children[1].visited === false)){
            while (!flag){
                flag = branch_bypass(obj_path.path_2[obj_path.path_2.length - 1], obj_path.path, obj_path.path_2);
                if (obj_path.path[obj_path.path.length - 1] !== undefined && obj_path.path[obj_path.path.length - 1].__CYCLEPATH === true){
                    flag_cycle = true; 
                } 
            }
            flag = false;
            if (flag_cycle) obj_path.cycle = true;
            flag_cycle = false;
            all_path.push(obj_path);
            obj_path = new Path();
            obj_path.path_2.push(start_line);
        }
    }
    else all_path.push(obj_path);
    // console.log("Все пути");
    // console.log("Кол-во путей", all_path.length);
    // console.log("длинна пути 1", all_path[0].path.length);
    // console.log("длинна пути 2", all_path[1].path.length);
    // console.log("длинна пути 3", all_path[2].path.length);
    // console.log("длинна пути 4", all_path[3].path.length);
    // console.log("длинна пути 5", all_path[4].path.length);
    // // console.log("длинна пути 6", all_path[5].path.length);
    // for (let key in lines){
    // }
    for (let i = 0; i < all_path.length; i++){
        if(all_path[i].cycle === true) console.log("ЦИКЛ!");

    }
    return all_path;
    
}

export {forming_paths}