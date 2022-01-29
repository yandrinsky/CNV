function length(equation){
    return Math.sqrt((equation.x2 - equation.x1) ** 2 + (equation.y2 - equation.y1) ** 2);
}

function getCoordinates(equation, x, y){
    if(x !== undefined){
        return x * equation.k - equation.b;
    } else if(y !== undefined){
        return (y - equation.b) / equation.k
    }
}

// функции для поиска пересечений
function realLess(a, b){
    
    let flag;
    const eps = 1e-4; //точность вычслений

    flag = (b - a) > eps;

    return flag;
}

function vektorMulti(ax,ay,bx,by){
// ax,ay - координаты a
//  bx,by - координаты b 
    let vektormulti;

    vektormulti = ax*by-bx*ay;

    return vektormulti;
}

function linesCross(x1,y1,x2,y2,x3,y3,x4,y4){
//Пересекаются ли отрезки?
    let v1, v2, v3, v4;
    v1 = vektorMulti(x4-x3,y4-y3,x1-x3,y1-y3);
    v2 = vektorMulti(x4-x3,y4-y3,x2-x3,y2-y3);
    v3 = vektorMulti(x2-x1,y2-y1,x3-x1,y3-y1);
    v4 = vektorMulti(x2-x1,y2-y1,x4-x1,y4-y1);
    if (realLess(v1*v2, 0) && realLess(v3*v4, 0)){
        //v1v2<0  и v3v4<0, отрезки пересекаются
        return true
    }
    else return false;
}

//На вход - куравнения двух линий - выход boolean.
function collision(equation1, equation2){
    //Пересекаются ли 2 отрезка?
    let t = 0, t1 = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let x3 = 0;
    let y3 = 0;
    let x4 = 0;
    let y4 = 0;

    let obj_collision = {
        result: false,
        target: undefined,
    }
    if(equation1.x1 === equation1.x3 && equation2.x1 === equation2.x3){
        obj_collision.result = linesCross(equation1.x1, equation1.y1, equation1.x2, equation1.y2, equation2.x1, equation2.y1, equation2.x2, equation2.y2);
        if(obj_collision.result) obj_collision.target = equation2.target;
        return obj_collision;
    }
    else if(equation1.x1 === equation1.x3 && equation2.x1 !== equation2.x3){
        while(t <= 1){
            x1 = Math.pow((1 - t), 2)*equation2.x1 + 2*(1 - t)*t*equation2.x3 + Math.pow(t, 2)*equation2.x2;
            y1 = Math.pow((1 - t), 2)*equation2.y1 + 2*(1 - t)*t*equation2.y3 + Math.pow(t, 2)*equation2.y2;
            x1 = Math.round(x1); 
            y1 = Math.round(y1);
            if(t !== 0){
                x2 = Math.pow((1 - (t-0.1)), 2)*equation2.x1 + 2*(1 - (t-0.1))*(t-0.1)*equation2.x3 + Math.pow((t-0.1), 2)*equation2.x2;
                y2 = Math.pow((1 - (t-0.1)), 2)*equation2.y1 + 2*(1 - (t-0.1))*(t-0.1)*equation2.y3 + Math.pow((t-0.1), 2)*equation2.y2;
                x2 = Math.round(x2); 
                y2 = Math.round(y2);
            }
            else{
                x2 = Math.pow((1 - (t+0.1)), 2)*equation2.x1 + 2*(1 - (t+0.1))*(t+0.1)*equation2.x3 + Math.pow((t+0.1), 2)*equation2.x2;
                y2 = Math.pow((1 - (t+0.1)), 2)*equation2.y1 + 2*(1 - (t+0.1))*(t+0.1)*equation2.y3 + Math.pow((t+0.1), 2)*equation2.y2;
                x2 = Math.round(x2); 
                y2 = Math.round(y2);
            }
            t += 0.1;
            if(linesCross(equation1.x1, equation1.y1, equation1.x2, equation1.y2, x2, y2, x1, y1)) {
                obj_collision.result = true;
                obj_collision.target = equation2.target;
            }
        }
        return obj_collision;
    }
    else if(equation1.x1 !== equation1.x3 && equation2.x1 === equation2.x3){
        while(t <= 1){
            x1 = Math.pow((1 - t), 2)*equation1.x1 + 2*(1 - t)*t*equation1.x3 + Math.pow(t, 2)*equation1.x2;
            y1 = Math.pow((1 - t), 2)*equation1.y1 + 2*(1 - t)*t*equation1.y3 + Math.pow(t, 2)*equation1.y2;
            x1 = Math.round(x1); 
            y1 = Math.round(y1);
            if(t !== 0){
                x2 = Math.pow((1 - (t-0.1)), 2)*equation1.x1 + 2*(1 - (t-0.1))*(t-0.1)*equation1.x3 + Math.pow((t-0.1), 2)*equation1.x2;
                y2 = Math.pow((1 - (t-0.1)), 2)*equation1.y1 + 2*(1 - (t-0.1))*(t-0.1)*equation1.y3 + Math.pow((t-0.1), 2)*equation1.y2;
                x2 = Math.round(x2); 
                y2 = Math.round(y2);
            }
            else{
                x2 = Math.pow((1 - (t+0.1)), 2)*equation1.x1 + 2*(1 - (t+0.1))*(t+0.1)*equation1.x3 + Math.pow((t+0.1), 2)*equation1.x2;
                y2 = Math.pow((1 - (t+0.1)), 2)*equation1.y1 + 2*(1 - (t+0.1))*(t+0.1)*equation1.y3 + Math.pow((t+0.1), 2)*equation1.y2;
                x2 = Math.round(x2); 
                y2 = Math.round(y2); 
            }
            t += 0.1;
            if(linesCross(equation2.x1, equation2.y1, equation2.x2, equation2.y2, x2, y2, x1, y1)) {
                obj_collision.result = true;
                obj_collision.target = equation2.target;
            }
        }
        return obj_collision;
    }
    else{
        while(t <= 1){
            x1 = Math.pow((1 - t), 2)*equation1.x1 + 2*(1 - t)*t*equation1.x3 + Math.pow(t, 2)*equation1.x2;
            y1 = Math.pow((1 - t), 2)*equation1.y1 + 2*(1 - t)*t*equation1.y3 + Math.pow(t, 2)*equation1.y2;
            x1 = Math.round(x1); 
            y1 = Math.round(y1);
            if(t !== 0){
                x2 = Math.pow((1 - (t-0.1)), 2)*equation1.x1 + 2*(1 - (t-0.1))*(t-0.1)*equation1.x3 + Math.pow((t-0.1), 2)*equation1.x2;
                y2 = Math.pow((1 - (t-0.1)), 2)*equation1.y1 + 2*(1 - (t-0.1))*(t-0.1)*equation1.y3 + Math.pow((t-0.1), 2)*equation1.y2;
                x2 = Math.round(x2); 
                y2 = Math.round(y2);
            }
            else{
                x2 = Math.pow((1 - (t+0.1)), 2)*equation1.x1 + 2*(1 - (t+0.1))*(t+0.1)*equation1.x3 + Math.pow((t+0.1), 2)*equation1.x2;
                y2 = Math.pow((1 - (t+0.1)), 2)*equation1.y1 + 2*(1 - (t+0.1))*(t+0.1)*equation1.y3 + Math.pow((t+0.1), 2)*equation1.y2;
                x2 = Math.round(x2); 
                y2 = Math.round(y2); 
            }
            t += 0.1;
            t1 = 0;
            while(t1 <= 1){
                x3 = Math.pow((1 - t1), 2)*equation2.x1 + 2*(1 - t1)*t1*equation2.x3 + Math.pow(t1, 2)*equation2.x2;
                y3 = Math.pow((1 - t1), 2)*equation2.y1 + 2*(1 - t1)*t1*equation2.y3 + Math.pow(t1, 2)*equation2.y2;
                x3 = Math.round(x3); 
                y3 = Math.round(y3);
                if(t1 !== 0){
                    x4 = Math.pow((1 - (t1-0.1)), 2)*equation2.x1 + 2*(1 - (t1-0.1))*(t1-0.1)*equation2.x3 + Math.pow((t1-0.1), 2)*equation2.x2;
                    y4 = Math.pow((1 - (t1-0.1)), 2)*equation2.y1 + 2*(1 - (t1-0.1))*(t1-0.1)*equation2.y3 + Math.pow((t1-0.1), 2)*equation2.y2;
                    x4 = Math.round(x4); 
                    y4 = Math.round(y4);
                }
                else{
                    x4 = Math.pow((1 - (t1+0.1)), 2)*equation2.x1 + 2*(1 - (t1+0.1))*(t1+0.1)*equation2.x3 + Math.pow((t1+0.1), 2)*equation2.x2;
                    y4 = Math.pow((1 - (t1+0.1)), 2)*equation2.y1 + 2*(1 - (t1+0.1))*(t1+0.1)*equation2.y3 + Math.pow((t1+0.1), 2)*equation2.y2;
                    x4 = Math.round(x4); 
                    y4 = Math.round(y4);
                }
                t1 += 0.1;
                if(linesCross(x2, y2, x1, y1, x4, y4, x3, y3)) {
                    obj_collision.result = true;
                    obj_collision.target = equation2.target;
                }
            }
        }
        return obj_collision; 
    }
    //x1 === x3 && y1 === y3 - это прямая
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

    let res;
    const {userX, userY, x1, y1, y2, x2, x3, y3} = config;
    const x0 = userX;
    const y0 = userY;
    if(x1 === x3 && y1 === y3){
       res = isNearLineCalc({x0, y0, x1, y1, x2, y2});
    } else {
        res = isNearCurveCalc(
            {
                start: {x: x1, y: y1},
                end: {x: x2, y: y2},
                check: {x: x3, y: y3},
            }, { x: x0, y: y0 }
        )
    }

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
function isNearCurveCalc(line, mouse){
    let t = 0;
    let x = 0;
    let y = 0;
    let flag = false;
    while(t <= 1){
        x = Math.pow((1 - t), 2)*line.start.x + 2*(1 - t)*t*line.check.x + Math.pow(t, 2)*line.end.x;
        y = Math.pow((1 - t), 2)*line.start.y + 2*(1 - t)*t*line.check.y + Math.pow(t, 2)*line.end.y;
        x = Math.round(x)
        y = Math.round(y)
        for(let i = 0; i < 6; i++){
            if((x+i) === mouse.x && (y+i) === mouse.y) flag = true;
            if((x-i) === mouse.x && (y-i) === mouse.y) flag = true;
        }
        t += 0.001;
    }
    return flag;

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

export {getCoordinates, getEquationFor2points, getEquationForLine, moveTo, nearLine, nearDot, length, collision};