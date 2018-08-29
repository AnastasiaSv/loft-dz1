/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (var i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        newArray[i] = fn(array[i], i, array);
    }

    return newArray;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    var prev = initial || array[0];
    var i = initial ? 0 : 1;

    for (i; i < array.length; i++) {
        prev = fn(prev, array[i], i, array);
    }

    return prev;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    var arr = [];

    for (var key in obj) {
        key = key.toUpperCase();
        arr.push(key);
    }

    return arr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    var newArray = [];
    var length = array.length;
    var size = array.length; // размер нового массива

    from = from || 0;
    to = (to !== undefined) ? to : length;
    from = (from < 0) ? (from + length) : from;
    to = (to < 0) ? (to + length) : to;
    from = (from < 0) ? 0 : from;
    to = (to > length) ? length : to;
    size = to - from;
    if (size > 0) {
        for (var i = 0; i < size; i++) {
            newArray[i] = array[i + from];
        }
    }

    return newArray;
}

/*
еще один способ
function slice(array, from, to) {
    var newArray = [];
    var length = array.length;
    var size = array.length;

    from = from || 0;
    to = (to !== undefined) ? to : length;
    from = (from < 0) ? (from + length) : from;
    to = (to < 0) ? (to + length) : to;
    from = (from < 0) ? 0 : from;
    to = (to > length) ? length : to;
    newArray = array.filter(function(item, i, arr) {
        return (i >= from && i < to);
    });

    return newArray;
}
*/

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set: (target, property, value) => {
            target[property] = value * value;
            return true;
        }
    })
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
