/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

homeworkContainer.style.height = '550px';

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const newDiv = document.createElement('div');
    var sizeOptions = {
        width: { min: 100, max: 200, unit: 'px' },
        height: { min: 100, max: 200, unit: 'px' }
    }
    var xy = getRandomPosition(newDiv);

    function getRandomInt (min, max, unit) {
        return Math.floor(Math.random() * (max - min + 1)) + min + unit;
    }

    function getRandomPosition() {
        var x = homeworkContainer.offsetHeight;
        var y = homeworkContainer.offsetWidth;
        var randomX = Math.floor(Math.random() * x);
        var randomY = Math.floor(Math.random() * y);

        return [randomX, randomY];
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    newDiv.classList.add('draggable-div');
    newDiv.style.width = getRandomInt(sizeOptions.width.min, sizeOptions.width.max, sizeOptions.width.unit);
    newDiv.style.height = getRandomInt(sizeOptions.height.min, sizeOptions.height.max, sizeOptions.height.unit);
    newDiv.style.backgroundColor = getRandomColor();
    newDiv.style.position = 'absolute';
    newDiv.style.top = xy[0] + 35 + 'px';
    newDiv.style.left = xy[1] + 'px';
    newDiv.style.cursor = 'pointer';

    return newDiv;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    // сделаем один обработчик на document, будем использовать делегирование событий
    document.onmousedown = function(e) {
        // узнаем, на каком элементе произошло нажатие кнопки
        var dragElement = e.target;
        var shiftX, shiftY;

        if (!dragElement.classList.contains('draggable-div')) return;

        startDrag(e.clientX, e.clientY);

        // отслеживаем перемещение по экрану
        document.onmousemove = function(e) {
            moveAt(e.clientX, e.clientY);
        };

        // отслеживаем окончание переноса, переходим от fixed к absolute-координатам
        dragElement.onmouseup = function() {
            finishDrag();
        };

        function startDrag(clientX, clientY) {
            shiftX = clientX - dragElement.getBoundingClientRect().left;
            shiftY = clientY - dragElement.getBoundingClientRect().top;
            dragElement.style.position = 'fixed';
            document.body.appendChild(dragElement);
            moveAt(clientX, clientY);
        }

        function finishDrag() {
            dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
            dragElement.style.position = 'absolute';
            document.onmousemove = null;
            dragElement.onmouseup = null;
        }

        function moveAt(clientX, clientY) {
            // новые координаты
            var newX = clientX - shiftX;
            var newY = clientY - shiftY;

            if (newX < 0) newX = 0;
            if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
                newX = document.documentElement.clientWidth - dragElement.offsetWidth;
            }
            dragElement.style.left = newX + 'px';
            dragElement.style.top = newY + 'px';
        }

        return false;
    }
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.style.cursor = 'pointer';

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
