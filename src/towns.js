/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
let cities = [];

/* Кнопка "Повторить" */
const button = document.createElement('button');

homeworkContainer.appendChild(button);
button.textContent = 'Повторить';
button.style.display = 'none';

/* Уведомление об ошибке */
const notification = document.createElement('div');

homeworkContainer.appendChild(notification);
notification.textContent = 'Не удалось загрузить города';
notification.style.display = 'none';

function loadTowns() {
    const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(xhr.response.sort(function(a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }

                    return 0;
                }));
            } else {
                reject();
            }
        });
        xhr.onerror = reject;
        xhr.send();
    })
}

function handlerCities() {
    loadTowns()
        .then(function(result) { 
            cities = result;
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';
            button.style.display = 'none';
            notification.style.display = 'none';
        })
        .catch(function () {
            loadingBlock.style.display = 'none';
            button.style.display = 'block';
            notification.style.display = 'block';
        });
}
handlerCities();

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) !== -1) {
        return true;
    } else {
        return false;
    }
}

function getCities() {
    let current = cities.filter(city => isMatching(city.name, filterInput.value));

    current = current.map(city => city.name).join('<br/>');
    filterResult.innerHTML = filterInput.value ? current : '';
}

filterInput.addEventListener('keyup', () => {
    getCities();
})

button.addEventListener('click', () => {
    handlerCities();
})

export {
    loadTowns,
    isMatching
};
