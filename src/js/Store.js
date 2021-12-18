export default {
    state: {
        delMode: false,
        mode: "draw", //draw, del
        deletingIndex: undefined, //индекс текущего удаляемого элемента (обновляется при наведении)
        isDragging: false,
        lines: {},  //id: {line, startCircle, endCircle, children: [], parents: [], ids: {line, startCircle, endCircle}}
        canvas: undefined,
        context: undefined,
    },
    setCanvas(canvas){
        this.state.canvas = canvas;
    },
    setContext(context){
        this.state.context = context;
    },
    get canvas(){
        return this.state.canvas;
    },
    get context(){
        return this.state.context;
    }
}