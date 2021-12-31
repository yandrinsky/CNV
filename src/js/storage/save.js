import CNV from "../CNV/library";
import store from "../Store";

function saveData(state, visualData, needToSave){
    const prepData = {...state, lines: {}};
    for(let key in state.lines){
        let data = state.lines[key];
        let children = [];
        let parents = [];
        data.children.forEach(item => {
            children.push(item.line.id);
        })
        data.parents.forEach(item => {
            parents.push(item.line.id);
        })
        prepData.lines[key] = {
            ...data,
            line: data.line.id,
            endCircle: data.endCircle.id,
            startCircle: data.startCircle.id,
            children,
            parents,
        }
    }

    const saved = JSON.stringify({
        SCRIPT: JSON.stringify(prepData),
        CNV: visualData,
    });
    if(needToSave !== false){
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