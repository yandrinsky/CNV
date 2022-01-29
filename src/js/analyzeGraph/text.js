import CNV from "../CNV/library";

function text(options){
    options.auxiliary = options.aux || options.auxiliary;
    options.aux = options.auxiliary || options.aux;
    options.output[options.target.ids.line] = {
        text: options.auxiliary ? options.text : options.target.power.getStr(),
        x0: options.target.endCircle.link.start.x + 10,
        y0: options.target.endCircle.link.start.y - 10,
        fontSize: "14",
        color: "green",
        data: options.auxiliary ? undefined : {num: options.target.power.getNum(), det: options.target.power.getDet()},
        auxiliary: options.auxiliary || false,
    }
}

export default text;