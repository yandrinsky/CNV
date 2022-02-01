let BRANCHES = 2; //Количество линий, которые могут выходить из конца прошлой
let STACK_LIMIT = 10; //максимальное количество сохранений в stack
let STACK = true; //сохранине в stack изменений
let SHOW_PATH = false //показать путь обхода
let SHOW_CYCLES = false; //показать циклы
let CONTROL_SUM_WARNING = true; //выводить предупреждение о контрольной сумме
let SHOW_PRIORITIES = false;
let START_POWER = 25;
let NUMERIC_POWER = false;
let LINE_WIDTH_MIN = 3;
let LINE_WIDTH = 10;
let LINE_DIVISION = 1.1;

let LOOPS = true;
let MERGES = true;
let FINISH_LIMITS = [1, 4]; //num //arr [1, 3] - range //false = no limits


export {
    BRANCHES, LINE_WIDTH, STACK_LIMIT, SHOW_PATH,
    CONTROL_SUM_WARNING, STACK, SHOW_CYCLES, SHOW_PRIORITIES,
    START_POWER, NUMERIC_POWER, LINE_DIVISION, LINE_WIDTH_MIN,
    LOOPS, MERGES, FINISH_LIMITS
};