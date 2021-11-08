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
        }

    }
    let custom = {...std[type]};
    classes.forEach(className => {
        custom = {...custom, ...css[className]};
    })
    return custom;
}
