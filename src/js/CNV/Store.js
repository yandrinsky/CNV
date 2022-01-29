export default {
    state: undefined,
    getState() {
        return this.state;
    },
    setState(newState){
        this.state = newState
    },

    initState(){
       this.state = this.createState();
    },
    createState(){
        return {
            __shapes: {}, //id: {type: "line", start: {x, y}, end: {x, y}, classList: [], id},
            shapes: {}, //"id: ShapeInstance"
            mouseover: {},
            mouseleave: {},
            mouseenter: {},
            click: {},
            __mouseMoveTargets: [],
            __mouseClickTargets: [],
            shouldRenderUpdates: true,
            shift: {x: 0, y: 0},
            draggableCanvas: false,
            zoom: 1,
        }
    }

}