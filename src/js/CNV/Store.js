export default {
    state: {
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
    },
    getState() {
        return this.state;
    },
    setState(newState){
        this.state = newState
    }

}