import {nearLine, nearDot} from "../geometry/geometry";
import selfEvent from "./selfEvent";

function mouseClickEngine(e){
    let needToRedraw = false;
    for(let i = 0; i < this.state.__mouseClickTargets.length; i++){
        let link = this.state.__shapes[this.state.__mouseClickTargets[i]];
        if(link.type === "line"){
            nearLine({
                distance: 5,
                userX: e.clientX,
                userY: e.clientY,
                x1: link.start.x + this.state.shift.x,
                y1: link.start.y + this.state.shift.y,
                x2: link.end.x + this.state.shift.x,
                y2: link.end.y + this.state.shift.y,
                x3: link.check.x + this.state.shift.x,
                y3: link.check.y + this.state.shift.y,
                e: e,
            }, (e)=> {
                if(this.state.click[link.id]){
                    this.state.click[link.id](selfEvent(e, this.state.shapes[link.id]))
                }

            })
        } else if (link.type === "circle"){
            nearDot({
                distance: 5,
                userX: e.clientX,
                userY: e.clientY,
                x0: link.start.x + this.state.shift.x,
                y0: link.start.y + this.state.shift.y,
                e: e,
            }, (e)=> {
                if(this.state.click[link.id]){
                    this.state.click[link.id](selfEvent(e, this.state.shapes[link.id]))
                }

            })
        }
    }

    if(needToRedraw){
        this.render();
    }
}

export default mouseClickEngine;