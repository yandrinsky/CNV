function findCycles(start){
    const cycles = []; //[[line, line, line], [line, line, line], [line, line, line]];
    const curPath = [];
    function check(target, lastTarget){
        curPath.push(target);

        if(target.__CHECKED){
            lastTarget.__CYCLEEND = true;
            const index = curPath.indexOf(target);
            cycles.push(curPath.slice(index, curPath.length));
            cycles[cycles.length - 1].forEach(line => {
                line.__CYCLEPATH = true;
            })
            //Не убираем checked, потому что у нас a1, a2, ...., a1 - мы на a1 и в конце, уберём, когда дойдём до начала
            curPath.pop();
            return;
        }
        target.__CHECKED = true;
        target.children.forEach(item => {
            check(item, target);
        })

        //После завершения вызова детей убираем из пути элемент
        curPath.pop();
        target.__CHECKED = false;
    }

    check(start);
    return cycles;
}

export default findCycles;