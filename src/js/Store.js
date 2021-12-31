import {stack_limit} from "./SETTINGS";

export default {
    state: {
        delMode: false,
        mode: "draw", //draw, del
        deletingIndex: undefined, //индекс текущего удаляемого элемента (обновляется при наведении)
        isDragging: false,
        lines: {},  //id: {line, startCircle, endCircle, children: [], parents: [], ids: {line, startCircle, endCircle}}
    },
    stack: {
        length: 0,
        stack_limit: stack_limit,
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
        this.stack.current + 1 < this.stack.stack_limit ? this.stack.current += 1 : this.stack.current = this.stack.stack_limit;
        return this.stack[this.stack.current];
    },

    addToStack(data){
        if(this.stack.length !== this.stack.current + 1){
            for (let i = this.stack.current + 1; i < this.stack.stack_limit; i++) {
                delete this.stack[i];
            }
            this.stack.length = this.stack.current + 1;
        }

        if(this.stack.length < this.stack.stack_limit){
            this.stack[this.stack.length] = data;
            this.stack.length += 1;
            this.stack.current += 1;
        } else {
            for (let i = 1; i < this.stack.length; i++) {
                this.stack[i - 1] = this.stack[i];
            }
            this.stack[this.stack.length - 1] = data;
        }
    },
    get canvas(){
        return this.system.canvas;
    },
    get context(){
        return this.system.context;
    }
}