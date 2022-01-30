import CNV from "../../library";
const {getEquationFor2points, moveTo, getEquationForLine, getCoordinates} = require("../geometry/geometry");

function pointer(line, context, shift){
    const config = {
        x0: line.start.x + shift.x,
        y0: line.start.y + shift.y,
        x1: line.end.x + shift.x,
        y1: line.end.y + shift.y,
        x2: line.check.x + shift.x,
        y2: line.check.y + shift.y,
    }

    //Чтобы срелочки после выхода за границы экрана не творили дичь
    if(config.x1 < 3) return;
    let triangleRadius = 3;
    let eqInit = getEquationFor2points(config.x2, config.y2, config.x1, config.y1);
    //let eqInit = getEquationFor2points(config.x0, config.y0, config.x1, config.y1);
    let linePosition = moveTo(eqInit, -triangleRadius * 2);
    let equation = getEquationForLine(linePosition.x, linePosition.y, eqInit);
    let len = 50;
    equation.x1 = linePosition.x - len;
    equation.y1 = getCoordinates(equation, linePosition.x - len);
    equation.x2 = linePosition.x + len;
    equation.y2 = getCoordinates(equation, linePosition.x + len);


    let startPoint = moveTo(equation, -triangleRadius, linePosition.x);
    let endPoint = moveTo(equation, triangleRadius, linePosition.x);
    context.fillStyle = "black";
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.lineTo(config.x1,config.y1);
    context.fill();
}
//props: context, shift
function pointersRender(props){
    //console.log(CNV);
    CNV.querySelectorAll("line").forEach(shape => {
        if(shape.isPointer ){
            pointer(shape.link, props.context, props.shift);
        }
    })
}

export default pointersRender;