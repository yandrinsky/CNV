import {nearLine, nearDot} from "../geometry/geometry";
import selfEvent from "./selfEvent";

function mouseMoveEngine(e){
    let needToRedraw = false;

    const successCallback = (link, e) => {
        let selfE = selfEvent(e, this.state.shapes[link.id]);
        //let selfE = {...e, target: this.state.shapes[link.id]};
        if(this.state.mouseover[link.id]){
            this.state.mouseover[link.id](selfE)
            needToRedraw = true
        }
        if(this.state.mouseenter[link.id]){
            if(!link.events.mouseenter){
                this.state.mouseenter[link.id](selfE)
                link.events.mouseenter = true;
                needToRedraw = true;
            }
        }
        if(this.state.mouseleave[link.id]){
            link.events.mouseleave = true;
        }
    }

    const failCallback = (link, e) => {
        let selfE = selfEvent(e, this.state.shapes[link.id]);
        if(this.state.mouseleave[link.id]){
            // console.log("here", link.events.mouseenter)
            if(link.events.mouseenter){
                this.state.mouseleave[link.id](selfE)
                link.events.mouseenter = false;
                needToRedraw = true;
            }
        }
        if(this.state.mouseenter[link.id]){
            link.events.mouseenter = false;
        }
    }

    for(let i = 0; i < this.state.__mouseMoveTargets.length; i++){
        let link = this.state.__shapes[this.state.__mouseMoveTargets[i]];
        if(link.type === "line"){
            nearLine({
                    distance: 5,
                    userX: e.clientX,
                    userY: e.clientY,
                    x1: link.start.x + this.state.shift.x,
                    y1: link.start.y + this.state.shift.y,
                    x2: link.end?.x + this.state.shift.x || link.start.x + this.state.shift.x,
                    y2: link.end?.y + this.state.shift.y || link.start.y + this.state.shift.y,
                    x3: link.check?.x + this.state.shift.x || link.start.x + this.state.shift.x,
                    y3: link.check?.y + this.state.shift.y || link.start.y + this.state.shift.y,
                }, successCallback.bind(this, link, e),
                failCallback.bind(this, link, e)
            )
        } else if(link.type === "circle"){
            nearDot({
                    distance: 5,
                    userX: e.clientX,
                    userY: e.clientY,
                    x0: link.start.x + this.state.shift.x,
                    y0: link.start.y + this.state.shift.y,
                }, successCallback.bind(this, link, e),
                failCallback.bind(this, link, e)
            )
        }


    }
    if(needToRedraw){
        this.render();
    }
}
export default mouseMoveEngine;