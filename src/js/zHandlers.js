import recover from "./storage/recover";
import Store from "./Store";
import analyze from "./analyzeGraph/analyze";

function ctrlZHandler(){
    window.addEventListener("keydown", e => {
        if(e.key === "Z" && e.ctrlKey && e.shiftKey){
            recover(Store.getStackNext());
            analyze(Store.state.lines);
        }  else if(e.key === "z" && e.ctrlKey){
            recover(Store.getStackPrev());
            analyze(Store.state.lines);
        }
    })
}

export default ctrlZHandler;