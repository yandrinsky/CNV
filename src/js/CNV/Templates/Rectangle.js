import Standard from "./Standard";
import Store from "../Store";

class Rectangle extends Standard{
    constructor(config) {
        super(config);
        this.type = "rect";
        this.width = config.width;
        this.height = config.height;
    }
    getOwnCoords(){
        return{
            start: {
                x: this.start.x,
                y: this.start.y,
            },
            end: {
                x: this.start.x,
                y: this.start.y,
            }
        }
    }
    getCalcCoords(){
        return{
            start: {
                x: this.start.x + Store.state.shift.x,
                y: this.start.y + Store.state.shift.y,
            },
            end: {
                x: this.start.x + Store.state.shift.x + this.width,
                y: this.start.y + Store.state.shift.y + this.height,
            }
        }
    }
}

export default Rectangle;