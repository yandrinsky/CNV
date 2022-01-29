import Standard from "./Standard";

class Line extends Standard{
    constructor(config) {
        super(config);
        this.type = "line";
        this.end = {
            x: config.x1,
            y: config.y1,
        }
        this.check = {
            x: config.x2 || config.x0,
            y: config.y2 || config.y0,
        }
    }
}

export default Line;
