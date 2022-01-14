import {querySelectorEngine, querySelectorAllEngine} from "./Engine/cssEngine/selecting";
import uniqueId from "./uniqueId";
import mouseMoveEngine from "./Engine/eventsHandles/mouseMoveEngine";
import mouseClickEngine from "./Engine/eventsHandles/mouseClickEngine";
import dragCanvas from "./Engine/dragCanvas";

import Shape from "./Engine/Shape";
import render from "./Engine/render/render";
import Store from "./Store";
import clearCanvas from "./Engine/render/clearCanvas";

const CNV = {
    state: Store.getState(),
    context: undefined,
    canvas: undefined,
    css: undefined,

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
        }
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
        let id = uniqueId();

        let classList;
        if(config.className){
            if(config.className instanceof Array){
                classList = config.className;
            } else {
                classList = [config.className];
            }
        } else {
            classList = [];
        }
        this.state.__shapes[id] = {
            start: {
                x: config.x0,
                y: config.y0,
            },
            end: {
                x: config.x1,
                y: config.y1,
            },
            check: {
                x: config.x0,
                y: config.y0,
            },
            type: "line",
            id,
            classList,
            events: {
                mouseenter: false,
            }
        }
        let link = this.state.__shapes[id]
        let shape = new Shape(link, id);
        this.state.shapes[id] = shape;

        return shape;
    },

    createText(config){
        let id = uniqueId();
        this.state.__shapes[id] = {
            start: {
                x: config.x,
                y: config.y,
            },
            text: config.text,
            type: "text",
            id,
            classList: config.className ? [config.className] : [],
            events: {
                mouseenter: false,
            }
        }
        let link = this.state.__shapes[id]
        let shape = new Shape(link, id);
        this.state.shapes[id] = shape;

        return shape;
    },

    createCircle(config){
        let id = uniqueId();
        if(config.className){
            if(!config.className instanceof Array){
                config.className = [config.className]
            }
        }
        this.state.__shapes[id] = {
            start: {
                x: config.x0,
                y: config.y0,
            },
            type: "circle",
            id,
            classList: config.className ? config.className : [],
            events: {
                mouseenter: false,
            }
        }
        let link = this.state.__shapes[id]
        let shape = new Shape(link, id);
        this.state.shapes[id] = shape;

        return shape;
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
            })
        }
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
        return JSON.stringify(Store.getState());
    },

    recover(data){
        const state = JSON.parse(data);
        //this.state = JSON.parse(data);
        for(let key in state.shapes) {
            state.shapes[key] = new Shape(state.__shapes[key], key);
            state.shapes[key].pointer = state.__shapes[key].pointer;
        }
        Store.setState(state);
        this.state = Store.getState();
        this.render();
    }
}

export default CNV;