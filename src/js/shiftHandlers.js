import CNV from "./CNV/library";
import {endCircleClick, endCircleMouseEnter, endCircleMouseLeave} from "./eventHandlers";
import store from "./Store";

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
                    item.update.startPosition.x = event.clientX - CNV.state.shift.x;
                    item.update.startPosition.y = event.clientY - CNV.state.shift.y;

                    obj.line.update.endPosition.x = item.link.start.x;
                    obj.line.update.endPosition.y = item.link.start.y;


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

            function mouseLeave(e){
                store.canvas.style.cursor = "default";
                document.onmousemove = undefined;
                //resetStickToTailHandler();

                store.canvas.onmousedown = undefined;
                store.canvas.onmouseup = undefined;
            }

            item.onmouseenter = (e) => {
                store.canvas.style.cursor = "move";
                store.canvas.onmousedown = e => {
                    document.onmousemove = (e) => onMouseMove3(e, obj);
                    item.onmouseleave = undefined;
                }

                store.canvas.onmouseup = e => {
                    if(e.button === 0) {
                        document.onmousemove = undefined;
                        //resetStickToTailHandler();
                        item.onmouseleave = mouseLeave;
                    }
                };
            }
            item.onmouseleave = mouseLeave;
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
            item.onmouseenter = endCircleMouseEnter;
            item.onmouseleave = endCircleMouseLeave;
            item.onclick = (e) => endCircleClick(obj, e);
        }
    }
}

export {shiftUpHandler, shiftDownHandler};