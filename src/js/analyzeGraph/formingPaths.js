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
    if(edge.children[0] != undefined && (edge.children[0].visited === false || (edge.children[1] != undefined && edge.children[1].visited === false))){
        if(edge.children[1] != undefined){
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
                edge.children[0].other_priorities.sort(compareNumeric);
                edge.children[1].other_priorities.sort(compareNumeric);
                length_1 = edge.children[0].other_priorities.length;
                length_2 = edge.children[1].other_priorities.length;
                if (edge.children[0].other_priorities[ length_1 - 1] === undefined) edge.children[0].other_priorities.push(-100)
                if (edge.children[1].other_priorities[ length_2 - 1] === undefined) edge.children[1].other_priorities.push(-100)
                length_1 = edge.children[0].other_priorities.length;
                length_2 = edge.children[1].other_priorities.length;
                if (edge.children[0].other_priorities[ length_1 - 1] < edge.children[1].other_priorities[length_2 - 1]  && edge.children[1].visited === false){
                    edge = edge.children[1];
                    if (edge.visited_2 === false){
                        test_path.push(edge);
                        edge.visited_2 = true
                    }
                    path_2.push(edge);
                    edge.other_priorities[length_2 - 1]
                    edge.other_priorities.pop();
                }
                else{
                    if((edge.children[0].other_priorities[ length_1 - 1] <= edge.children[1].bypass_priority || edge.children[0].visited === true) && edge.children[1].visited === false){
                        edge = edge.children[1];
                        if (edge.visited_2 === false){
                            test_path.push(edge);
                            edge.visited_2 = true
                        }
                        path_2.push(edge);
                        save = edge.other_priorities[length_2 - 1];
                        edge.other_priorities.pop(); 
                    }
                    else if (edge.children[0].visited === false){
                        edge = edge.children[0];
                        if (edge.visited_2 === false){
                            test_path.push(edge);
                            edge.visited_2 = true
                        }
                        path_2.push(edge);
                        save = edge.other_priorities[length_1 - 1];
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
                if(edge === edge.children[0].sideIn[i]){
                    if(edge.__CYCLEEND) test_path.push(edge.children[0]);
                    while((edge.children[1] === undefined || (edge.children[1].visited === true && edge.children[0].visited === true)) && edge.parents[0] != undefined){
                        edge.visited = true;
                        edge = edge.parents[0];
                    }
                    stop = true;
                }
            }
        }
    }
    else{
        while((edge.children[1] === undefined || (edge.children[1].visited === true && edge.children[0].visited === true) || edge.__CYCLEEND) && edge.parents[0] != undefined){
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
    }
}

function forming_paths(lines){
    let start_line;
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
            }
            flag = false;
            all_path.push(obj_path);
            obj_path = new Path();
            obj_path.path_2.push(start_line);
        }
    }
    else all_path.push(obj_path);
    console.log("Все пути");
    console.log(all_path.length);
    return all_path;
    
}

export {forming_paths}