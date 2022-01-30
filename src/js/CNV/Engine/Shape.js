import CNV from "../library";
import {getCoordinates, getEquationFor2points, length, moveTo} from "./geometry/geometry"
import availableProperties from "./cssEngine/availableProperties";

class Shape{
    constructor(link, id) {
        this.link = link;
        this.id = id;
        this.isPointer = false;

        this.styleProp = {};
        availableProperties.forEach(property => {
            link = this.link;
            Object.defineProperty(this.styleProp, property, {
                get: function (){
                    return link.style[property];
                },

                set: function (arg){
                    link.style[property] = arg;
                    CNV.render();
                },
            })
        })

    }

    get system(){
        const __this = this;
        return {
            get equation(){
                if(__this.link.type === "line"){
                    let eq = getEquationFor2points(
                        __this.link.start.x,
                        __this.link.start.y,
                        __this.link.end.x,
                        __this.link.end.y,
                    )
                    eq.x3 = __this.link.check.x;
                    eq.y3 = __this.link.check.y;
                    eq.target = __this;
                    return eq;
                }
            },
            get coordinates(){
                let x1 = __this.link.start.x;
                let y1 = __this.link.start.y;
                let x2 = __this.link.end?.x;
                let y2 = __this.link.end?.y;
                let x3 = __this.link.check?.x;
                let y3 = __this.link.check?.y;
                return {x1, y1, x2, y2, x3, y3};
            },
            getCoordinatesX(y){
                return getCoordinates(this.equation, undefined, y);
            },
            getCoordinatesY(x){
                return getCoordinates(this.equation, x, undefined);
            },
            moveTo(move, x){
                return moveTo(this.equation, move, x);
            },
            get length(){
                return length(this.equation);
            },

        }
    }
    get classList(){
        let link = this.link;
        return {
            add(className){
                if(!link.classList.includes(className)){
                    link.classList.push(className)
                    CNV.render();
                }
            },
            remove(className){
                const index = link.classList.indexOf(className);
                if(index !== -1){
                    link.classList.splice(index, 1);
                    CNV.render();
                }
            },
            toggle(className){
                const index = link.classList.indexOf(className);
                if(index !== -1){
                    link.classList.splice(index, 1);
                    CNV.render();
                } else {
                    link.classList.push(className);
                    CNV.render();
                }
            },
            contains(className){
                return link.classList.includes(className);
            }
        }
    }

    get style(){
        return this.styleProp;
    }

    get update(){
        const link = this.link;
        return {

            get check(){
                return {
                    set x(x){
                        link.check.x = x;
                        CNV.render();
                    },
                    set y(y){
                        link.check.y = y;
                        CNV.render();
                    }
                }
            },

            get start(){
                return {
                    set x(x){
                        link.start.x = x;
                        CNV.render();
                    },
                    set y(y){
                        link.start.y = y;
                        CNV.render();
                    }
                }
            },

            get startPosition (){
                return {
                    set x(x){
                        link.start.x = x;
                        CNV.render();
                    },
                    set y(y){
                        link.start.y = y;
                        CNV.render();
                    }
                }
            },

            get end(){
                if(link.type === "line"){
                    return {
                        set x(x){
                            link.end.x = x;
                            CNV.render();
                        },
                        set y(y){
                            link.end.y = y;
                            CNV.render();
                        }
                    }
                }
            },

            get endPosition (){
                if(link.type === "line"){
                    return {
                        set x(x){
                            link.end.x = x;
                            CNV.render();
                        },
                        set y(y){
                            link.end.y = y;
                            CNV.render();
                        }
                    }
                }
            },

            set width (newWidth){
                link.width = newWidth;
                CNV.render();
            },

            set height (newHeight){
                link.height = newHeight;
                CNV.render();
            }
        }
    }

    set pointer(bool){
        this.isPointer = !!bool;
        this.link.pointer = this.isPointer
    }

    set onmouseover(callback){
        CNV.state.mouseover[this.id] = callback;
        if(!CNV.state.__mouseMoveTargets.includes(this.id)){
            CNV.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseenter(callback){
        CNV.state.mouseenter[this.id] = callback;
        if(!CNV.state.__mouseMoveTargets.includes(this.id)){
            CNV.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseleave(callback){
        CNV.state.mouseleave[this.id] = callback;
        if(!CNV.state.__mouseMoveTargets.includes(this.id)){
            CNV.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onclick(callback){
        if(!CNV.state.__mouseClickTargets.includes(this.id)){
            CNV.state.__mouseClickTargets.push(this.id)
        }
        CNV.state.click[this.id] = callback;
    }

    remove(){
        //удаляем информацию
        delete CNV.state.__shapes[this.id];
        //удаляем инстанс класса
        delete CNV.state.shapes[this.id];
        //удаляем слушатели событий
        delete CNV.state.mouseenter[this.id];
        delete CNV.state.mouseleave[this.id];
        delete CNV.state.mouseenter[this.id];
        delete CNV.state.click[this.id];

        let MMT = CNV.state.__mouseMoveTargets;
        let MCT = CNV.state.__mouseClickTargets;

        if(MMT.indexOf(this.id) >= 0){
            MMT.splice(MMT.indexOf(this.id), 1);
        }
        if(MCT.indexOf(this.id) >= 0){
            MCT.splice(MCT.indexOf(this.id), 1);
        }
        CNV.render();
    }
}

export default Shape;