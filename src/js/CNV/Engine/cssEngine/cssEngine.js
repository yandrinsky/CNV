function cssEngine(props){
    const {css, classes, type, ownStyle} = props;
    const common = {
        position: "static",
    }
    const std = {
        line: {
            ...common,
            lineWidth: 5,
            color: "black"
        },
        circle: {
            ...common,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            radius: 10,
            color: "black",
        },
        text: {
            ...common,
            fontSize: "14px",
            fontFamily: "serif",
            color: "black",
            padding: 0,
        },
        rect: {
            ...common,
            backgroundColor: "white",
            padding: 0,
            position: "static",
        }
    }
    let custom = {...std[type]};
    classes.forEach(className => {
        custom = {...custom, ...css[className]};
    })
    custom = {...custom, ...ownStyle};

    return custom;
}

function cssIndex(css, shapes){
    const final = {};
    for(let id in shapes){
        let shape = shapes[id];
        let index;
        shape.classList.forEach(CLS => {
            if(css[CLS]?.zIndex){
                index = css[CLS].zIndex;
            }
        })
        if(index === undefined) index = 0;

        if(final.hasOwnProperty(index)){
            final[index].push(shape);
        } else {
            final[index] = [shape];
        }
    }

    if(final.hasOwnProperty(10)){
        final[10].push({type: "__POINTERS_RENDER"});
    } else {
        final[10] = [{type: "__POINTERS_RENDER"}];
    }

    let keys = Object.keys(final).sort((a, b)=> a - b);
    return {
        shapes: final,
        keys,
    }
}

export {cssEngine, cssIndex};