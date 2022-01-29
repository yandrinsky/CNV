import CNV from "../CNV/library";
import findCycles from "./fincCycles";

function showCycles(start){
    const cycles = findCycles(start);
    let colors = ["a1", "a2","a3","a4","a5","a6","a7","a8", "a9"];
    colors.forEach(color => {
        CNV.querySelectorAll("." + color).forEach(item => {
            item.classList.remove(color);
        })
    })
    cycles.forEach((cycle, index) => {
        cycle.forEach(target => {
            target.line.classList.add("a" + (index + 1));
        })
    })
}

export default showCycles;