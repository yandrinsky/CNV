import Fraction from "./Fraction";

function gauss(m){
    let n = m.length //prompt("Введите число уравнений системы:"); //Ввод данных
    let l = new Array(n); //Массив ответов
    let i, j, k;

    for(i=0; i<n; ++i) {
        l[i] = new Array(n);

    }

    function Iteration(iter_item) { //Функция итеррация
        for(iter_item=0;iter_item<(n-1);iter_item++) { //Цикл выполнения итерраций
            if (m[iter_item][iter_item].getNum() === 0) SwapRows(iter_item); //Проверка на ноль
            for(j=n; j>=iter_item; j--) {
                m[iter_item][j].divide(m[iter_item][iter_item]); //Делим строку i на а[i][i]
            }
            for(i=iter_item+1; i<n; i++) { //Выполнение операций со строками
                for(j=n;j>=iter_item;j--) {
                    m[i][j].minus(m[iter_item][j].clone().multiply(m[i][iter_item]));
                }
            }
        }
        Answers();
        return l;
    }

    function SwapRows(iter_item) { //Функция перемены строк
        for(i=iter_item+1;i<n;i++) {
            if(m[i][iter_item] !== 0) {
                for(j=0;j<=n;j++) {
                    k = m[i-1][j];
                    m[i-1][j] = m[i][j];
                    m[i][j] = k;
                }
            }
        }
    }

    function Answers() { //Функция поиска и вывода корней
        l[n-1] = m[n-1][n].clone().divide(m[n-1][n-1]);
        for(i=n-2;i>=0;i--) {
            k = new Fraction(0);

            for(j=n-1;j>i;j--) {
                k.plus(m[i][j].clone().multiply(l[j]));
                //k = (m[i][j]*l[j]) + k;
            }
            l[i] = m[i][n].clone().minus(k);
        }
    }

    return Iteration(n);
}

export default gauss;