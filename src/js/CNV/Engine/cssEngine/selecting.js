function querySelectorEngine(selector, elements, shapes){
    for(let id in elements){
        const shape = elements[id];
        if(selector[0] === "."){
            if(shape.classList.includes(selector.slice(1))){
                return shapes[id];
            }
        } else if(selector[0] === "#"){
            if(shape.userId === selector.slice(1)){
                return shapes[id];
            }
        } else {
            if(shape.type === selector){
                return shapes[id];
            }
        }

    }
}

function querySelectorAllEngine(selector, elements, shapes){
    const result = [];
    for(let id in elements){
        const shape = elements[id];
        if(selector[0] === "."){
            if(shape.classList.includes(selector.slice(1))){
                result.push(shapes[id]);
            }
        } else if (selector[0] === "#"){
            if(shape.userId === selector.slice(1)){
                result.push(shapes[id]);
            }
        } else {
            if(shape.type === selector){
                result.push(shapes[id]);
            }
        }

    }
    return result;
}

export {querySelectorEngine, querySelectorAllEngine};