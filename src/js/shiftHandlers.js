import CNV from "./CNV/library";
import {
    endCircleClick,
    endCircleMouseEnter,
    endCircleMouseLeave, getBlackPointCoord, getCheckCoords,
    lineMouseEnter,
    lineMouseLeave
} from "./eventHandlers";
import store from "./Store";
import save from "./storage/save";




function resetAllBut(item){
    for(let key in store.state.lines){
        let curItem = store.state.lines[key];
        if(curItem !== item){
            curItem.line.onmouseenter = undefined;
            curItem.line.onmouseleave = undefined;
            curItem.endCircle.onmouseenter = undefined;
            curItem.endCircle.onmouseleave = undefined;
        }
    }
}

function setAllBut(item, lineHandler, circleHandler, leaveHandler){
    for(let key in store.state.lines){
        let curItem = store.state.lines[key];
        lineHandler(curItem);
        circleHandler(curItem);
        leaveHandler(curItem);
    }
}

const shiftDownHandler = (e) => {
    if(e.key === "Shift"){
        CNV.settings.draggableCanvas = false;

        window.removeEventListener("keydown", shiftDownHandler);
        window.addEventListener("keyup", shiftUpHandler);

        for(let key in store.state.lines){
            let obj = store.state.lines[key];
            let item = obj.endCircle;
            item.onclick = undefined;

            function onMouseMove3(event, obj) {
                //setStickToTailHandler(obj);
                const item = obj.endCircle;
                CNV.combineRender(() => {
                    // item.update.startPosition.x = event.clientX - CNV.state.shift.x;
                    // item.update.startPosition.y = event.clientY - CNV.state.shift.y;
                    item.update.startPosition.x = item.link.start.x + event.movementX;
                    item.update.startPosition.y = item.link.start.y + event.movementY;

                    // console.log("item.link.start.x;", item.link.start.x);
                    // console.log("item.link.start.y;", item.link.start.y);

                    obj.line.update.endPosition.x = item.link.start.x;
                    obj.line.update.endPosition.y = item.link.start.y;

                    // obj.line.link.check.x += event.movementX;
                    // obj.line.link.check.y += event.movementY;


                    obj.parents.forEach(parent => {
                        if(parent.__NOT_CIRCLE){
                            const newCoordinates = obj.line.system.moveTo(obj.line.system.length / 2, obj.line.system.coordinates.x1);
                            parent.line.update.endPosition.x = newCoordinates.x;
                            parent.line.update.endPosition.y = newCoordinates.y;
                            parent.endCircle.update.startPosition.x = newCoordinates.x;
                            parent.endCircle.update.startPosition.y = newCoordinates.y;
                        }
                    })

                    obj.children.forEach(children => {
                        children.line.update.startPosition.x = item.link.start.x;
                        children.line.update.startPosition.y = item.link.start.y;
                        children.startCircle.update.startPosition.x = item.link.start.x;
                        children.startCircle.update.startPosition.y = item.link.start.y;

                        children.line.link.check.x += event.movementX;
                        children.line.link.check.y += event.movementY;

                        children.parents.forEach(parent => {
                            if(parent !== obj){
                                const newCoordinates = children.line.system.moveTo(children.line.system.length / 2, children.line.system.coordinates.x1);
                                parent.line.update.endPosition.x = newCoordinates.x;
                                parent.line.update.endPosition.y = newCoordinates.y;
                                parent.endCircle.update.startPosition.x = newCoordinates.x;
                                parent.endCircle.update.startPosition.y = newCoordinates.y;
                            }
                        })
                    })
                })
            }

            function onMouseMove4(event, obj) {
                CNV.combineRender(() => {

                    let {x, y} = getCheckCoords({
                        start: obj.line.link.start,
                        end: obj.line.link.end,
                        check: obj.line.link.check,
                    }, {x: event.clientX - CNV.state.shift.x, y: event.clientY - CNV.state.shift.y})


                    obj.line.link.check.x = x;
                    obj.line.link.check.y = y;

                    let sideInCoors = getBlackPointCoord({
                        start: obj.line.link.start,
                        end: obj.line.link.end,
                        check: obj.line.link.check,
                    })

                    obj.sideIn.forEach(item => {
                        item.line.update.endPosition.x = sideInCoors.x;
                        item.line.update.endPosition.y = sideInCoors.y;
                        item.endCircle.update.startPosition.x = sideInCoors.x;
                        item.endCircle.update.startPosition.y = sideInCoors.y;
                        let current = item;

                    })
                })
            }

            function mouseLeave(e){
                store.canvas.style.cursor = "default";
                document.onmousemove = undefined;
                //resetStickToTailHandler();

                store.canvas.onmousedown = undefined;
                store.canvas.onmouseup = undefined;
            }



            function lineMouseEnter(obj){
                obj.line.onmouseenter = e => {
                    store.canvas.style.cursor = "move";
                    store.canvas.onmousedown = e => {
                        resetAllBut(obj);
                        document.onmousemove = (e) => onMouseMove4(e, obj);
                        obj.line.onmouseleave = undefined;
                    }
                    store.canvas.onmouseup = e => {
                        if(e.button === 0) {
                            //setAllBut(obj, lineMouseEnter, circleMouseEnter, leaveHandler);
                            document.onmousemove = undefined;
                            //resetStickToTailHandler();
                            obj.line.onmouseleave = mouseLeave;
                        }
                    };
                }
            }

            function circleMouseEnter(obj){
                let item = obj.endCircle;
                item.onmouseenter = (e) => {
                    obj.line.onmouseenter = undefined;
                    store.canvas.style.cursor = "move";
                    store.canvas.onmousedown = e => {
                        resetAllBut(obj);
                        document.onmousemove = (e) => onMouseMove3(e, obj);
                        item.onmouseleave = undefined;
                    }

                    store.canvas.onmouseup = e => {
                        //setAllBut(obj, lineMouseEnter, circleMouseEnter, leaveHandler);
                        if(e.button === 0) {
                            document.onmousemove = undefined;
                            //resetStickToTailHandler();
                            item.onmouseleave = mouseLeave;
                        }
                    };
                }
            }

            function leaveHandler(obj){
                item.onmouseleave = mouseLeave;
                obj.line.onmouseleave = mouseLeave;
            }
            //Для линии
            lineMouseEnter(obj);

            //Для конечной точки
            circleMouseEnter(obj);

            leaveHandler(obj);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove3);
            store.canvas.onmousedown = undefined;
            store.canvas.onmouseup = undefined;
        }
    }
}

const shiftUpHandler = (e) => {
    if(e.key === "Shift"){
        CNV.settings.draggableCanvas = true;

        store.canvas.style.cursor = "default";
        window.removeEventListener("keyup", shiftUpHandler);
        window.addEventListener("keydown", shiftDownHandler);
        //resetStickToTailHandler();

        store.canvas.onmousedown = undefined;
        store.canvas.onmouseup = undefined;
        document.onmousemove = undefined;

        for(let key in store.state.lines) {
            let obj = store.state.lines[key];
            let item = obj.endCircle;
            obj.line.classList.remove("black");

            obj.line.onmouseenter = e => lineMouseEnter(obj, e);
            obj.line.onmouseleave = e => lineMouseLeave(obj, e);

            item.onmouseenter = endCircleMouseEnter;
            item.onmouseleave = endCircleMouseLeave;
            item.onclick = (e) => endCircleClick(obj, e);
        }
        store.addToStack(save({dont_save: true}));
    }
}

export {shiftUpHandler, shiftDownHandler};