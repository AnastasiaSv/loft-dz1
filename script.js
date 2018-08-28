// Search friend

const searchFriend = document.querySelector('#name-search');
const searchAddedFriend = document.querySelector('#added-name-search');
const allFriends = document.querySelector('#friends');
const addedFriends = document.querySelector('#friends-list');

searchFriend.addEventListener('keyup', () => {
    var friendList = allFriends.querySelectorAll('.name');

    getFriend(friendList, searchFriend);
})

searchAddedFriend.addEventListener('keyup', () => {
    var friendList = addedFriends.querySelectorAll('.name');

    getFriend(friendList, searchAddedFriend);
})

function getFriend(array, input) {
    for (let i = 0; i < array.length; i++) {
        if (isMatching(array[i].textContent, input.value)) {
            array[i].parentNode.style.display = 'flex';
        } else if (!(isMatching(array[i].textContent, input.value))) {
            array[i].parentNode.style.display = 'none';
        }
    }
}

function isMatching(full, chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1) {
        return true;
    } else {
        return false;
    }
}

// DnD

const friendList = document.querySelector('#friends ul');
const addedFriendList = document.querySelector('#friends-list ul');

let currentDrag;

document.addEventListener('dragstart', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        currentDrag = { startZone: zone, node: e.target };
    }
});

document.addEventListener('dragover', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    if (currentDrag) {
        const zone = getCurrentZone(e.target);
        let icon = currentDrag.node.querySelector('.fa');

        e.preventDefault();

        if (zone && currentDrag.startZone !== zone) {
            if (e.target.classList.contains('item')) {
                zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
            } else {
                zone.insertBefore(currentDrag.node, zone.lastElementChild);
            }

            if (icon.getAttribute('class') == 'fa fa-plus') {
                icon.setAttribute('class', 'fa fa-remove');
                checkFriendDnd(currentDrag.node, searchAddedFriend.value);
            } else {
                icon.setAttribute('class', 'fa fa-plus');
                checkFriendDnd(currentDrag.node, searchFriend.value);
            }
          }

        currentDrag = null;
    }
});

function getCurrentZone(from) {
    do {
        if (from.classList.contains('drop-zone')) {
            return from;
        }
    } while (from = from.parentElement);

    return null;
}

friendList.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') == 'fa fa-plus') {
        e.target.setAttribute('class', 'fa fa-remove');
        addedFriendList.appendChild(e.target.parentNode);
        checkFriend(e.target, searchAddedFriend.value);
    }
});

addedFriendList.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') == 'fa fa-remove') {
        e.target.setAttribute('class', 'fa fa-plus');
        friendList.appendChild(e.target.parentNode);
        checkFriend(e.target, searchFriend.value);
    }
});

function checkFriend(element, value) {
    if (isMatching(element.parentNode.querySelector('.name').textContent, value)) {
        element.parentNode.style.display = 'flex';
    } else {
        element.parentNode.style.display = 'none';
    }
}

function checkFriendDnd(element, value) {
    if (isMatching(element.textContent, value)) {
        element.style.display = 'flex';
    } else {
        element.style.display = 'none';
    }
}

// LocalStorage

const button = document.querySelector('#save');
let storage = localStorage;

save.addEventListener('click', () => {
    var list = addedFriends.querySelectorAll('.item');
    var ids = [];

    for (var item of list) {
        ids.push(item.getAttribute('id'));
    }
    storage.data = JSON.stringify(ids);
})

// VK API

VK.init({
    apiId: 6674957
})

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2)
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

auth()
    .then(() => {
        return callAPI('friends.get', { fields: 'photo_50' });
    })
    .then(friends => {
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(friends);

        friendList.innerHTML = html;

        return new Promise((resolve) => {
            if (storage.data){
                var loadedData = JSON.parse(storage.data);
                resolve(loadedData);
            }
        });
    })
    .then(loadedData => {
        for (var item of loadedData) {
            document.getElementById(item).lastElementChild.setAttribute('class', 'fa fa-remove');
            addedFriendList.appendChild(document.getElementById(item));
        }
    })