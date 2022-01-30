import CNV from "../CNV/library";
import store from "../Store";

function saveData(state, visualData, dontSave){
    const prepData = {...state, lines: {}};
    for(let key in state.lines){
        let data = state.lines[key];
        let children = [];
        let parents = [];
        let sideIn = [];
        data.children.forEach(item => {
            children.push(item.line.id);
        })
        data.parents.forEach(item => {
            parents.push(item.line.id);
        })
        data.sideIn.forEach(item => {
            sideIn.push(item.line.id);
        })

        prepData.lines[key] = {
            ...data,
            line: data.line.id,
            endCircle: data.endCircle.id,
            startCircle: data.startCircle.id,
            children,
            parents,
            sideIn,
        }
    }

    const saved = JSON.stringify({
        SCRIPT: JSON.stringify(prepData),
        CNV: visualData,
    });
    if(!dontSave){
        localStorage.setItem("__saved", saved);
    }
    return saved;
}

function save(options){
    //Убираем синие линии, чтобы сохранились стили без них
    CNV.preventRender(()=>{
        CNV.querySelectorAll(".finishLine").forEach((item) => {
            item.classList.remove("finishLine");
            item.classList.add("__PLACE_FOR_FINISH_LINE")
        })
        CNV.querySelectorAll(".black").forEach((item) => {
            item.classList.remove("black");
        })
    })
    const saved = saveData(store.state, CNV.save(), options.dont_save);
    //Восстанавливаем синие линии, чтобы продолжить разработку
    CNV.preventRender(()=>{
        CNV.querySelectorAll(".__PLACE_FOR_FINISH_LINE").forEach((item) => {
            item.classList.remove("__PLACE_FOR_FINISH_LINE");
            item.classList.add("finishLine")
        })
    })
    return saved;
}

export default save;