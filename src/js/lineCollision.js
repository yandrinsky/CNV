import CNV from "./CNV/library";

function lineCollision(target){
    let isCollision;
    CNV.querySelectorAll(".line").forEach(line => {
        if(target !== line){
            let res = CNV.lineCollision(target, line);
            if(res.result) {
                isCollision = true;
                let warning = setInterval(() => {
                    res.target.classList.toggle("lineWarning");
                }, 100)
                setTimeout(() => {
                    clearInterval(warning);
                    res.target.classList.remove("lineWarning");
                }, 1000)
            }
        }
    })
    return isCollision;
}

export default lineCollision;