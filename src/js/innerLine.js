import CNV from "./CNV/library";
import {getBlackPointCoord} from "./eventHandlers";

function innerLine(line){

    let x0, y0, x1, y1, mv1, mv2;
    if(line.link.start.x === line.link.check.x && line.link.start.y === line.link.check.y){
        mv1 = line.system.moveTo(5, line.system.coordinates.x1);
        mv2 = line.system.moveTo(-5, line.system.coordinates.x2);
        x0 = mv1.x;
        y0 = mv1.y;
        x1 = mv2.x;
        y1 = mv2.y;
    } else {
        let point = getBlackPointCoord(line.link);
        let line1, line2;
        CNV.preventRender(() => {
            line1 = CNV.createLine({
                x0: line.link.start.x,
                y0: line.link.start.y,
                x1: point.x,
                y1: point.y,
            })
            line2 = CNV.createLine({
                x1: line.link.end.x,
                y1: line.link.end.y,
                x0: point.x,
                y0: point.y,
            })
            let start = line1.system.moveTo(5, line.link.start.x);
            let end = line2.system.moveTo(-5, line.link.end.x);
            x0 = start.x;
            y0 = start.y;
            x1 = end.x;
            y1 = end.y;
            line1.remove();
            line2.remove();
        })
    }
    let x2 = line.link.check.x;
    let y2 = line.link.check.y;


    let innerLine = CNV.querySelector("#" + line.id + "_innerLine");
    if(line.system.length > 15){
        if(innerLine){
            CNV.combineRender(() => {
                innerLine.update.start.x = x0;
                innerLine.update.start.y = y0;
                innerLine.update.end.x = x1;
                innerLine.update.end.y = y1;
                innerLine.update.check.x = x2;
                innerLine.update.check.y = y2;
            })
        } else {
            innerLine = CNV.createLine({
                x0, y0, x1, y1,x2, y2,
                className: "innerLine",
                id: line.id + "_innerLine",
            });
            innerLine.pointer = true;
        }
    }

}

export default innerLine;