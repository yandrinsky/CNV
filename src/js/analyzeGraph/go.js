import follow from "./follow";

function go(paths){
    while(paths.length > 0){
        let successCount = 0;
        for (let i = 0; i < paths.length; i++) {
            if(follow(paths[i].path)){
                paths[i].passed = true;
                successCount += 1;
                paths.splice(i, 1);
                i -= 1;
            }
        }
        if(successCount === 0){
            alert("Функция GO столкнулась с невозможность прохода всем путям. Анализ прекращён");
            break;
        }
    }

}

export default go;