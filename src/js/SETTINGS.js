const BRANCHES = 2; //Количество линий, которые могут выходить из конца прошлой
const STACK_LIMIT = 10; //максимальное количество сохранений в stack
const STACK = true; //сохранине в stack изменений
const SHOW_PATH = false //показать путь обхода
const SHOW_CYCLES = false; //показать циклы
const CONTROL_SUM_WARNING = true; //выводить предупреждение о контрольной сумме
const SHOW_PRIORITIES = false;
const START_POWER = 25;
const NUMERIC_POWER = false;
const LINE_WIDTH = 10;
const LINE_DIVISION = 1.1;
export {
    BRANCHES, LINE_WIDTH, STACK_LIMIT, SHOW_PATH,
    CONTROL_SUM_WARNING, STACK, SHOW_CYCLES, SHOW_PRIORITIES,
    START_POWER, NUMERIC_POWER, LINE_DIVISION
};