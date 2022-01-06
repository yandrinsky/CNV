import uniqueId from "../CNV/uniqueId";
import state from "./analyzeState";
import text from "./text";



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
    //if (edge.__CYCLEEND) edge.line.classList.add("a1");
    if(edge.children[0] != undefined && (edge.children[0].visited === false || (edge.children[1] != undefined && edge.children[1].visited === false))){
        if(edge.children[1] != undefined){
            //if (edge.children[0].__CYCLEPATH) edge.children[0].line.classList.add("a1");
            //edge.children[0].line.classList.add("a2");
            if (edge.children[1].__CYCLEPATH && edge.children[1].visited === false){
                edge = edge.children[1];
                if (edge.visited_2 === false){
                    test_path.push(edge);
                    edge.visited_2 = true
                }
                path_2.push(edge);
            }
            else if (edge.children[0].__CYCLEPATH && edge.children[0].visited === false){
                edge = edge.children[0];
                if (edge.visited_2 === false){
                    test_path.push(edge);
                    edge.visited_2 = true
                }
                path_2.push(edge);
            }
            else{
                // edge.children[1].line.classList.add("a1");
                // edge.children[0].line.classList.add("a2");
                edge.children[0].other_priorities.sort(compareNumeric);
                edge.children[1].other_priorities.sort(compareNumeric);
                length_1 = edge.children[0].other_priorities.length;
                length_2 = edge.children[1].other_priorities.length;
                if (edge.children[0].other_priorities[ length_1 - 1] === undefined) edge.children[0].other_priorities.push(-100)
                if (edge.children[1].other_priorities[ length_2 - 1] === undefined) edge.children[1].other_priorities.push(-100)
                length_1 = edge.children[0].other_priorities.length;
                length_2 = edge.children[1].other_priorities.length;
                console.log((edge.children[1].other_priorities[ length_2 - 1] === -100) && (edge.children[0].other_priorities[length_1 - 1] != -100) && (edge.children[1].bypass_priority > edge.children[0].other_priorities[length_1 - 1]))
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
                    if(edge.__CYCLEEND) test_path.push(edge.children[0])
                    //if(edge.__CYCLEEND) test_path.push(edge.children[0].children[0])
                    // if(edge.__CYCLEEND) test_path.push(edge)
                    // if(edge.__CYCLEEND) test_path.push(edge.children[0])

                    else flag_3 = true;
                    stop = true;
                    while((edge.children[1] === undefined || (edge.children[1].visited === true && edge.children[0].visited === true)) && edge.parents[0] != undefined){
                        //if(flag_3 === true && flag_4 === true) edge.other_priorities.push(save);
                        if(edge.parents[0].children[1] !== undefined) flag_4 = true;
                        edge.visited = true;
                        //edge.line.classList.add("a5");
                        edge = edge.parents[0];
                    }
                    flag_3 = false;
                    flag_4 = false;
                    // if(edge.children[0].__CYCLEPATH){
                    //     test_path.push(edge.children[0])
                    //     edge = edge.children[0];
                    //     while(!edge.__CYCLEEND){
                    //         console.log("Застрял :(");
                    //         test_path.push(edge.children[0]);
                    //         edge = edge.children[0];
                    //     }
                    // }
                    // if(edge.children[1] != undefined && edge.children[1].__CYCLEPATH){
                    //     test_path.push(edge.children[1])
                    //     edge = edge.children[1];
                    //     while(!edge.__CYCLEEND && edge.children[0].__CYCLEPATH){
                    //         test_path.push(edge.children[0]);
                    //         edge = edge.children[0];
                    //     }
                    // }
                }
            }
        }
    }
    else{
        while((edge.children[1] === undefined || (edge.children[1].visited === true && edge.children[0].visited === true)) && edge.parents[0] != undefined){
            edge.visited = true;
            //edge.line.classList.add("a2");
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
    console.log("Все пути");
    console.log("Кол-во путей", all_path.length);
    // console.log("длинна пути 1", all_path[0].path.length);
    // console.log("длинна пути 2", all_path[1].path.length);
    // console.log("длинна пути 3", all_path[2].path.length);
    // console.log("длинна пути 4", all_path[3].path.length);
    // console.log("длинна пути 5", all_path[4].path.length);
    // console.log("длинна пути 6", all_path[5].path.length);
    // for (let key in lines){
    //     if(lines[key].visited_2 === true) lines[key].line.classList.add("a5");
    // }
    for (let i = 0; i < all_path[1].path.length; i++){
        //if(all_path[i].cycle === true) console.log("ЦИКЛ!");
        // all_path[1].path[i].line.classList.add("a1")
        //all_path[1].line.classList.add("a2")
    }
    return all_path;
    
}

export {forming_paths}