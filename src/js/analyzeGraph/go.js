import follow from "./follow";

function go(paths){
    console.log("paths", paths);
    let arnold_unpassed = 2;
    while(paths.length > 0){
        let successCount = 0;
        for (let i = 0; i < paths.length; i++) {
            if(follow(paths[i].path)){
                successCount += 1; //Оставь это, и тогда мы пройдём все пути
                if(paths[i].cycle){
                    successCount += 1; //Оставь тут и мы не пройдём все пути из-за остановки GO, но вроде считаем арнольд в арнольд
                    paths[i].passed = true;
                    paths.splice(i, 1);
                    i -= 1;
                } else {
                    paths[i].passed_count += 1;
                    //console.log("here")
                    if(paths[i].passed_count === arnold_unpassed){
                        successCount += 1; //Оставь тут и мы не пройдём все пути из-за остановки GO, но вроде считаем арнольд в арнольд
                        paths[i].passed = true;
                        paths.splice(i, 1);
                        i -= 1;
                    }
                }
            } else {
                if(paths[i].cycle) arnold_unpassed += 1;
                console.log("In go: follow returned false");
            }
        }
        if(successCount === 0){
            alert("Функция GO столкнулась с невозможность прохода всем путям. Анализ прекращён");
            console.log("last paths", paths);
            break;
        }
    }

    console.log("paths", paths);

}

export default go;