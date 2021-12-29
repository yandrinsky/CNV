export default {
    state: {
        delMode: false,
        mode: "draw", //draw, del
        deletingIndex: undefined, //индекс текущего удаляемого элемента (обновляется при наведении)
        isDragging: false,
        lines: {},  //id: {line, startCircle, endCircle, children: [], parents: [], ids: {line, startCircle, endCircle}}

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
    get canvas(){
        return this.system.canvas;
    },
    get context(){
        return this.system.context;
    }
}