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

function nearLine(config, callbackSuccess = [], callbackFail = []){
    !config.distance ? config.distance = 1 : config

    if(callbackSuccess){
        if(callbackSuccess instanceof Function){
            callbackSuccess = [callbackSuccess];
        }
    }

    if(callbackFail){
        if(callbackFail instanceof Function){
            callbackFail = [callbackFail];
        }
    }

    const {userX, userY, x1, y1, y2, x2} = config;
    const x0 = userX;
    const y0 = userY;

    let res = isNearLineCalc({
        x0,
        y0,
        x1,
        y1,
        x2,
        y2,
    })

    if (res) {
        callbackSuccess.forEach((callback)=>{
            callback(config.e);
        })
    } else {
        callbackFail.forEach((callback)=>{
            callback(config.e);
        })
    }
    return res;
}

function isNearLineCalc(config){
    function dist (x1,y1,x2,y2){
        return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    }
    const {x0,y0, x1, y1, x2, y2} = config;
    let r1 = dist(x0, y0, x1, y1);
    let r2 = dist(x0, y0, x2, y2);
    let r12 = dist(x1, y1, x2, y2);


    if(r1 < dist(r2, r12,0,0) && r2 < dist(r1,r12,0,0)){
        let a = y2 - y1;
        let b = x1 - x2;
        let c = -x1 * (y2 - y1) + y1 * (x2 - x1);
        let t = dist (a,b,0,0);
        if (c>0){
            a = -a;
            b = -b;
            c = -c;
        }
        let r0 =(a * x0 + b * y0 + c) / t;
        // console.log('Расстояние от точки до отрезка=',r0);
        if(r0 > -5 && r0 < 5){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

}

function nearDot(config, callbackSuccess = [], callbackFail = []){
    !config.distance ? config.distance = 1 : config
    if(callbackSuccess){
        if(callbackSuccess instanceof Function){
            callbackSuccess = [callbackSuccess];
        } else {
            callbackSuccess = [()=>{}]
        }
    }
    if(callbackFail){
        if(callbackFail instanceof Function){
            callbackFail = [callbackFail];
        } else {
            callbackFail = [()=> {}];
        }
    }

    const {userX, userY, x0, y0} = config;

    if((userX < x0 + 10 && userX > x0 - 10) && (userY < y0 + 10 && userY > y0 - 10)) {
        callbackSuccess.forEach((callback)=>{
            callback(config.e);
        })
        return true;
    } else {
        callbackFail.forEach((callback)=>{
            callback(config.e);
        })
        return false
    }
}

export {getCoordinates, getEquationFor2points, getEquationForLine, moveTo, nearLine, nearDot};