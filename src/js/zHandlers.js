import recover from "./storage/recover";
import Store from "./Store";

function ctrlZHandler(){
    window.addEventListener("keydown", e => {
        if(e.key === "Z" && e.ctrlKey && e.shiftKey){
            recover(Store.getStackNext());
        }  else if(e.key === "z" && e.ctrlKey){
            recover(Store.getStackPrev());
        }
    })
}

export default ctrlZHandler;