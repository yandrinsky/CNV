import follow from "./follow";

function go(paths){
    console.log("paths", paths);
    while(paths.length > 0){
        let successCount = 0;
        for (let i = 0; i < paths.length; i++) {
            if(follow(paths[i].path)){
                paths[i].passed = true;
                successCount += 1;
                // paths[i].path.forEach(line => {
                //     console.log("line", line);
                //     line.line.classList.add("a4");
                // });
                paths.splice(i, 1);
                i -= 1;

            } else {
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