import {querySelectorEngine, querySelectorAllEngine} from "./Engine/cssEngine/selecting";
import mouseMoveEngine from "./Engine/eventsHandles/mouseMoveEngine";
import mouseClickEngine from "./Engine/eventsHandles/mouseClickEngine";
import dragCanvas from "./Engine/dragCanvas";

import Shape from "./Engine/Shape";
import render from "./Engine/render/render";
import Store from "./Store";
import Line from "./Templates/Line";
import Circle from "./Templates/Circle";
import Text from "./Templates/Text";
import Rectangle from "./Templates/Rectangle";
import {collision} from "./Engine/geometry/geometry";

function create(link){
    this.state.__shapes[link.id] = link;
    let shape = new Shape(link, link.id);
    this.state.shapes[link.id] = shape;

    CNV.render();
    return shape;
}

const CNV = {
    context: undefined,
    canvas: undefined,
    css: undefined,
    state: (()=> {
        Store.initState();
        return Store.getState();
    })(),

    setCanvas(canvas){
        this.canvas = canvas;
    },

    setContext(context){
        this.context = context;
    },

    setCSS(css){
        this.css = css;
    },

    start(){
        dragCanvas();
        this.canvas.addEventListener("mousemove", mouseMoveEngine.bind(this));
        this.canvas.addEventListener("click", mouseClickEngine.bind(this));
    },

    settings: {
        set draggableCanvas(flag){
            CNV.state.draggableCanvas = !!flag;
        },
        set draggableCanvasObserver(observer){
            Store.draggableCanvasObserver = observer;
        },
    },


    querySelector(selector){
        return querySelectorEngine(selector, this.state.__shapes, this.state.shapes);
    },

    querySelectorAll(selector){
        return querySelectorAllEngine(selector, this.state.__shapes, this.state.shapes);
    },

    getElementByUniqueId(id){
        return this.state.shapes[id];
    },

    createLine(config){
        let link = new Line(config);
        return create.call(this, link);
    },

    createText(config){
        let link = new Text(config);
        return create.call(this, link);
    },

    createCircle(config){
        let link = new Circle(config);
        return create.call(this, link);
    },

    createRect(config){
        let link = new Rectangle(config);
        return create.call(this, link);
    },

    text(config){
        this.context.font = `${config.fontSize || 14}px serif`;
        this.context.fillStyle = config.color || "black";
        this.context.fillText(config.text, config.x, config.y);
    },

    render(){
        if(this.state.shouldRenderUpdates){
            render({
                css: this.css,
                canvas: this.canvas,
                context: this.context,
                shift: this.state.shift,
                elements: this.state.__shapes,
                zoom: this.state.zoom,
            })
        }
    },

    lineCollision(line1, line2){
        return collision(line1.system.equation, line2.system.equation);
    },

    preventRender(callback){
        this.state.shouldRenderUpdates = false;
        callback();
        this.state.shouldRenderUpdates = true;
    },

    combineRender(callback){
        this.state.shouldRenderUpdates = false;
        callback();
        this.state.shouldRenderUpdates = true;
        CNV.render();
    },

    save(){
        let state = Store.getState();
        let preparedStore = {
            __shapes: {},
            draggableCanvas: state.draggableCanvas,
            shift: state.shift,
        }
        for(let key in state.__shapes) {
            let link = state.__shapes[key];
            preparedStore.__shapes[key] = {
                className: link.classList,
                x0: link.start.x,
                y0: link.start.y,
                x1: link.end?.x,
                y1: link.end?.y,
                x2: link.check?.x,
                y2: link.check?.y,
                uniqueId: link.id,
                type: link.type,
                text: link.text,
                id: link.userId,
                width: link.width,
                height: link.height,
                pointer: link.pointer,
                style: link.style,
            }
        }
        return JSON.stringify(preparedStore);
    },

    recover(data){
        const state = {...Store.createState(), ...JSON.parse(data)};

        for(let key in state.__shapes) {
            let oldLink = state.__shapes[key]
            let link = oldLink;
            let pointer = link.pointer;

            if(link.type === "line") link = new Line({...link});
            else if(link.type === "circle") link = new Circle({...link});
            else if(link.type === "text") link = new Text({...link});
            else if(link.type === "rect") link = new Rectangle({...link});

            for(let key in oldLink.style) {
                link.style[key] = oldLink.style[key];
            }

            state.__shapes[key] = link;
            state.shapes[key] = new Shape(link, key);
            state.shapes[key].pointer = pointer;
        }
        Store.setState(state);
        this.state = Store.getState();
        this.render();
    }
}

export default CNV;