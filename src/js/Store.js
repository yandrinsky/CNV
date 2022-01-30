import {STACK_LIMIT} from "./SETTINGS";

export default {
    state: {
        delMode: false,
        mode: "draw", //draw, del
        deletingIndex: undefined, //индекс текущего удаляемого элемента (обновляется при наведении)
        isDragging: false,
        lines: {},  //id: {line, startCircle, endCircle, children: [], parents: [], ids: {line, startCircle, endCircle}}
    },
    zMode: false,
    stack: {
        len: 0,
        stack_limit: STACK_LIMIT,
        current: -1,
    },
    system: {
        canvas: undefined,
        context: undefined,
    },
    setCanvas(canvas){
        this.system.canvas = canvas;
    },
    setContext(context){
        this.system.context = context;
    },
    getState(){
        return this.state;
    },
    getStackPrev(){
        this.stack.current - 1 >= 0 ? this.stack.current -= 1 : this.stack.current = 0;
        return this.stack[this.stack.current];
    },

    getStackNext(){
        console.log("getStackNext")
        this.stack.current + 1 < this.stack.len ?
            this.stack.current += 1 :
            this.stack.current;
        return this.stack[this.stack.current];
    },

    addToStack(data){
        console.log("add to stack")
        if(this.stack.len !== this.stack.current + 1){
            for (let i = this.stack.current + 1; i < this.stack.stack_limit; i++) {
                delete this.stack[i];
            }
            this.stack.len = this.stack.current + 1;
        }

        if(this.stack.len < this.stack.stack_limit){
            this.stack[this.stack.len] = data;
            this.stack.len += 1;
            this.stack.current += 1;
        } else {
            for (let i = 1; i < this.stack.len; i++) {
                this.stack[i - 1] = this.stack[i];
            }
            this.stack[this.stack.len - 1] = data;
        }
    },
    get canvas(){
        return this.system.canvas;
    },
    get context(){
        return this.system.context;
    }
}