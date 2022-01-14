function cssEngine(css, classes, type){
    const std = {
        line: {
            lineWidth: 5,
            color: "black"
        },
        circle: {
            startAngle: 0,
            endAngle: 2 * Math.PI,
            radius: 10,
            color: "black",
        },
        text: {
            fontSize: "14px",
            fontFamily: "serif",
            color: "black",
        }

    }
    let custom = {...std[type]};
    classes.forEach(className => {
        custom = {...custom, ...css[className]};
    })
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
    let keys = Object.keys(final).sort((a, b)=> a - b);
    return {
        shapes: final,
        keys,
    }
}

export {cssEngine, cssIndex};