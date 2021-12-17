function getCoordinates(equation, x, y){
    if(x !== undefined){
        return x * equation.k - equation.b;
    } else if(y !== undefined){
        return (y - equation.b) / equation.k
    }
}

function getEquationFor2points(x1, y1, x2, y2){
    let xTop = -x1
    let xBottom = (x2 - x1);
    let yTop = -y1
    let yBottom = (y2 - y1);

    return {
        x1, y1, x2, y2,
        xTop,
        xBottom,
        yTop,
        yBottom,
        k: (y2 - y1) / (x2 - x1),
        b: (x1 * (y2 - y1) / (x2 - x1) - y1),
    }
}

function getEquationForLine(x1, y1, equation){
    const k = -1 / equation.k;
    const a = Math.sqrt((equation.x1 - x1)**2 +  (equation.y1 - y1) ** 2);
    return  {
        xTop: -x1,
        xBottom: -(equation.xTop || 1) / equation.xBottom,
        yTop: -y1,
        yBottom: (equation.yTop  || 1) / equation.yBottom,
        k,
        b: (equation.y2 - equation.y1 >= 0 ? -1 : 1) * Math.sqrt((a * k) ** 2 + a**2) - (equation.y1 + equation.x1 / equation.k),
    };

}

function moveTo(equation, move, x){
    let lenA = Math.sqrt((equation.x2 - equation.x1) ** 2 + (equation.y2 - equation.y1) ** 2);
    let lenX = Math.abs(equation.x2 - equation.x1);
    let lenY = Math.abs(equation.y2 - equation.y1);
    //Чтобы узнать знак сдвига. То есть убывает или возрастает прямая, от этого всё зависит
    //move = move * (equation.x2 - equation.x1 < 0 ? -1 : 1);
    const alfa = (equation.x2 - equation.x1) < 0 ? -1 : 1;
    let lenA2;

    if(x === undefined){
        lenA2 = lenA + move;
    } else if(x !== undefined){
        lenA2 = Math.sqrt((x - equation.x1) ** 2 + (getCoordinates(equation, x) - equation.y1) ** 2) + move
    }

    let k = lenA2 / lenA;
    let newX =  Math.abs(k * Math.abs(equation.x2 - equation.x1) + alfa * equation.x1);
    return {
        x: newX,
        y: getCoordinates(equation, newX),
    }
}

export {getCoordinates, getEquationFor2points, getEquationForLine, moveTo};