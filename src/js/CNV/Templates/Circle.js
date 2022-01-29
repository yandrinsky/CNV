import Standard from "./Standard";

class Circle extends Standard{
    constructor(config) {
        super(config);
        this.type = "circle";
    }
}

export default Circle;