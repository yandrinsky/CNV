import CNV from "../CNV/library";

function text(options){
    options.auxiliary = options.aux || options.auxiliary;
    options.aux = options.auxiliary || options.aux;
    options.output[options.target.ids.line] = {
        text: options.auxiliary ? options.text : options.target.power.getStr(),
        x: options.target.endCircle.link.start.x + 10 + CNV.state.shift.x,
        y: options.target.endCircle.link.start.y - 10 + CNV.state.shift.y,
        fontSize: "14",
        color: "green",
        data: options.auxiliary ? undefined : {num: options.target.power.getNum(), det: options.target.power.getDet()},
        auxiliary: options.auxiliary || false,
    }
}

export default text;