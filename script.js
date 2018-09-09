var templateReference = document.getElementById('referenceTemplate').innerHTML;
Handlebars.registerPartial('reference', templateReference);
var config = {
    center: [55.76, 37.62],
    zoom: 16
};
var references = [];

ymaps.ready(init);

function init() {
    let myMap = new ymaps.Map('map', config),

    // Макет балуна
    balloonLayout = ymaps.templateLayoutFactory.createClass(
        baloonTemplate(), {
        build(){
            this.constructor.superclass.build.call(this);
            let closePopup = document.querySelector('#closePopup'),
                addReference = document.querySelector('#addReference');

            addReference.addEventListener('click', this.onAddReference.bind(this));
            closePopup.addEventListener('click', this.onClosePopup.bind(this));
        },

        // Закрытие окна
        onClosePopup(e){
            this.events.fire('userclose');
        },

        // Добавление отзыва
        onAddReference(e) {
            e.preventDefault();
            let name = document.querySelector('#name'),
                place = document.querySelector('#place'),
                text = document.querySelector('#text'),
                list = document.querySelector('.popup-content__list');

            if (name.value && place.value && text.value){
                let template = Handlebars.compile(templateReference),
                    ymapsElem =  list.firstElementChild.firstElementChild,
                    coords = this.getData().properties? this.getData().properties.getAll().placemarkData.coords : this.getData().coords,
                    address = this.getData().properties? this.getData().properties.getAll().placemarkData.address : this.getData().address,
                    myPlacemark,
                    placemarkData,
                    l = new Date(),
                    date = l.toLocaleDateString();

                placemarkData = {
                    coords: coords,
                    address: address,
                    name: name.value,
                    place: place.value,
                    date: date,
                    reference: text.value
                };

                references.push(placemarkData);
                name.value = place.value = text.value = '';
                if (ymapsElem.firstElementChild) {
                    ymapsElem.innerHTML += template(placemarkData);
                } else {
                    ymapsElem.innerHTML = template(placemarkData);
                }
                list.scrollTop = 9999;
                myPlacemark = this.createPlacemark.call(this, placemarkData);
                clusterer.add(myPlacemark);
                myMap.geoObjects.add(clusterer);
            } else {
                alert('Пожалуйста, заполните поля');
            }
        },

        // Автопозиционирования баллуна, извещаем о текущих размерах
        getShape() {
            return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([ [0, 0], [380, 560] ]));
        },

        // Создание метки
        createPlacemark(placemarkData) {
            return new ymaps.Placemark(placemarkData.coords, {
                placemarkData: placemarkData
            }, {
                iconLayout: IconLayout,
                iconShape: {
                    type: 'Rectangle',
                    coordinates: [[0, 0], [44, 66]]
                },
                iconOffset: [-22, -66],
                balloonLayout: balloonLayout,
                balloonContentLayout: balloonContentLayout,
                balloonPanelMaxMapArea: 0
            });
        }
    }),

    balloonContentLayout = ymaps.templateLayoutFactory.createClass(baloonContent()),

    customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        contentLayout(), {

        build() {
            this.constructor.superclass.build.call(this);
            let link = document.querySelector('#addressLink');
            link.addEventListener('click', this.onLinkClick.bind(this))
        },

        clear() {
            let link = document.querySelector('#addressLink');
            link.removeEventListener('click', this.onLinkClick);
            this.constructor.superclass.clear.call(this);
        },

        onLinkClick(e) {
            e.preventDefault();
            let coords = this.getData().properties.getAll().placemarkData.coords,
                source = document.querySelector("#listTemplate").innerHTML,
                template = Handlebars.compile(source),
                foundPlacemarks = [];

            myMap.setZoom(16);
            foundPlacemarks = references.filter((placemark) => {
                return (coords[0] === placemark.coords[0] && coords[1] === placemark.coords[1])
            });
            myMap.balloon.open(coords, {
                coords: coords,
                address: foundPlacemarks[0].address,
                content: template({list: foundPlacemarks})
            }, {
                layout: balloonLayout,
                contentLayout: balloonContentLayout
            });
            this.events.fire('userclose');
        }
    }),

    // Макет иконки
    IconLayout = ymaps.templateLayoutFactory.createClass('<img src="images/icon-orange.png">'),

    // Создание кластеризатора
    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedOrangeClusterIcons',
        gridSize: 128,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: true,
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        clusterBalloonCycling: false,
        clusterOpenBalloonOnClick: true,
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0
    });

    // Слушаем клик на карте
    myMap.events.add('click', (e) => {
        let coords = e.get('coords');

        // Определяем адрес по координатам
        ymaps.geocode(coords).then((res) => {
            let object = res.geoObjects.get(0),
                address = object.properties.get('text');

            myMap.balloon.open(coords,{
                coords: coords,
                address: address,
                content: 'Отзывов пока нет'
            },{
                layout: balloonLayout,
                contentLayout: balloonContentLayout
            });
        });
    });
}

function baloonTemplate() {
    return `<div id="popup">
            <div class="popup-header">
                <h3 class="popup-header__title">
                    <i class="fa fa-map-marker"></i>{{properties.placemarkData.address|default: address}}
                </h3>
                <i id="closePopup" class="fa fa-times"></i>
            </div>
            <div class="popup-content">
                <ul class="popup-content__list">
                    {% include options.contentLayout %}
                </ul>
                <div class="popup-content__form">
                    <h3>Ваш отзыв</h3>
                    <form action="" id="reference">
                        <input type="text" name="name" id="name" placeholder="Ваше имя">
                        <input type="text" name="place" id="place" placeholder="Укажите место">
                        <textarea name="text" id="text" placeholder="Поделитесь впечатлениями"></textarea>
                        <input id="addReference" type="submit" value="Добавить">
                    </form>
                </div>
            </div>
        </div>`;
}

function baloonContent() {
    return `{% if properties.placemarkData %}
        <li class="refer-item">
            <span class="name">{{properties.placemarkData.name}},</span>
            <span class="place">{{properties.placemarkData.place}},</span>
            <span class="date">{{properties.placemarkData.date}}</span>
            <div class="refer-text">{{properties.placemarkData.reference}}</div>
        </li>
        {% endif %}
        {% if content %}
            {{content|raw}}
        {% endif %}`;
}

function contentLayout() {
    return `<div class="cluster-balloon">
            <h2 class="cluster-balloon-header">{{properties.placemarkData.place}}</h2>
            <a href="#" id="addressLink">{{properties.placemarkData.address}}</a>
            <div class="cluster-balloon-body">{{properties.placemarkData.reference}}</div>
            <div class="cluster-balloon-footer">{{properties.placemarkData.date}}</div>
        </div>`;
}