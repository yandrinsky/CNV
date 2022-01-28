import CNV from "./CNV/library";

function innerLine(line){
    let mv1 = line.system.moveTo(5, line.system.coordinates.x1);
    let mv2 = line.system.moveTo(-5, line.system.coordinates.x2);
    let x0 = mv1.x;
    let y0 = mv1.y;
    let x1 = mv2.x;
    let y1 = mv2.y;
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
                // x0: 10, y0: 10, x1: 100, y1: 100,
                className: "innerLine",
                id: line.id + "_innerLine",
            });
            innerLine.pointer = true;
        }
    }

}

export default innerLine;