import {nearLine, nearDot} from "../geometry/geometry";

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
                e: e,
            }, (e)=> {
                let selfE = {...e, target: this.state.shapes[link.id]};

                if(this.state.click[link.id]){
                    this.state.click[link.id](selfE)
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
                let selfE = {
                    clientY: e.clientY,
                    clientX: e.clientX,
                    altKey: e.altKey,
                    button: e.button,
                    ctrlKey: e.ctrlKey,
                    layerX: e.layerX,
                    layerY: e.layerY,
                    movementX: e.movementX,
                    movementY: e.movementY,
                    currentTarget: e.currentTarget,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    x: e.x,
                    y: e.y,
                    which: e.which,
                    target: this.state.shapes[link.id],
                    shiftKey: e.shiftKey,
                };
                if(this.state.click[link.id]){
                    this.state.click[link.id](selfE)
                }

            })
        }
    }

    if(needToRedraw){
        this.render();
    }
}

export default mouseClickEngine;