import uniqueId from "../uniqueId";

class Standard{
    constructor(config) {
        this.id = config.uniqueId || uniqueId();
        if(config.className){
            if(config.className instanceof Array){
                this.classList = config.className;
            } else {
                this.classList = [config.className];
            }
        } else {
            this.classList = [];
        }
        this.style = {};
        this.start = {
            x: config.x0,
            y: config.y0,
        }
        this.userId = config.id || undefined;
        this.events = {
            mouseenter: false,
        }
    }
}

export default Standard;
