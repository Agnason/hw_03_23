// Создайте интерактивную веб - страницу для оставления и просмотра отзывов о продуктах.Пользователи могут добавлять отзывы о различных продуктах и просматривать добавленные отзывы.

// Страница добавления отзыва:

// Поле для ввода названия продукта.
// Текстовое поле для самого отзыва.
//     Кнопка "Добавить отзыв", которая сохраняет отзыв о продукте в LocalStorage.

// Страница просмотра отзывов:

// Показывает список всех продуктов, о которых были оставлены отзывы.
// При клике на название продукта отображается список всех отзывов по этому продукту.
// Возможность удаления отзыва(при нажатии на кнопку "Удалить" рядом с отзывом, данный отзыв удаляется из LocalStorage).
let divEl = document.querySelector('.feedbacks');
let btnEl = document.querySelector('#feedbacks_btn');
reloadList();

btnEl.addEventListener('click', function () {
    // находим элемент Input c названием продукта
    let inputProductEl = document.querySelector('#feedbacks_product');
    // создаем переменную, куда записываем значение продукта из Input 
    let nameProduct = inputProductEl.value.trim();
    // находим элемент Input c отзывом
    let inputFeedbackEl = document.querySelector('#feedbacks_text');
    // создаем переменную, куда записываем текст отзыва
    let feedbackText = inputFeedbackEl.value;
    // запускаем функцию для чтения из LocalStorage по имени продукта
    let callArray = readUser(nameProduct);
    // с помощью тернарного оператора находим значение последнего id или задаем ему значение 0
    let prevId = 0;
    if (Array.isArray(callArray)) {
        prevId = callArray.at(callArray.length - 1).id
    } else {
        callArray = [];
    }
    // создаем объект с id и отзывом
    let tempUser = {
        id: prevId + 1,
        text: feedbackText
    }
    callArray.push(tempUser);
    localStorage.setItem(nameProduct, JSON.stringify(callArray));
    reloadList();
});



function readUser(product) {
    const userJSON = localStorage.getItem(product)

    if (userJSON === null) {
        return undefined
    }
    // Если вдруг в хранилище оказался невалидный JSON предохраняемся от этого
    try {
        return JSON.parse(userJSON)
    } catch (e) {
        localStorage.removeItem(product);
        return undefined
    }
}

//  список отзывов

function reloadList() {
    // удалям предыдущий список. Иначе будут дублироваться
    let parentDiv = document.querySelector(".list_feedbacks");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    };
    // создаем список
    let keys = Object.keys(localStorage);

    for (const key of keys) {
        let div = document.querySelector('.list_feedbacks');
        let h2 = document.createElement('h2');
        h2.textContent = key;
        h2.id = key;
        div.append(h2);
        let list = document.createElement('ol');
        h2.append(list);

        readUser(key).forEach(element => {
            let li = document.createElement('li');
            li.textContent = element.text;
            li.id = element.id;
            li.classList.add(key);
            list.append(li);
            let btn = document.createElement('button');
            btn.classList.add('btn-delete');
            btn.textContent = 'Удалить отзыв';
            li.append(btn)
        });
    }
    listener();
    // listenerTitle();
}

// пришлось его добавить в функцию, т.к. при обновлении списка reloadList(), удаляется весь список и слушатели btnAll уже не работают
function listener() {
    const btnAll = document.querySelectorAll('.btn-delete');
    btnAll.forEach(element => {
        element.addEventListener('click', function () {
            let id = Number(element.parentElement.id);
            let nameProduct = element.parentElement.className;
            console.log(id);
            console.log(nameProduct);
            deleteFeedback(nameProduct, id);
        }, { once: true });;
    });
}

// удаление одного отзыва
function deleteFeedback(nameProduct, id) {
    const arr = readUser(nameProduct);
    const index = arr.findIndex(n => n.id === id);
    arr.splice(index, 1);
    localStorage.setItem(nameProduct, JSON.stringify(arr));
    if (arr.length == 0) {
        localStorage.removeItem(nameProduct);
    }
    reloadList();
}


// // содержимое по отдельному key
// function listenerTitle() {
//     const titleAll = document.querySelectorAll('h2');

//     titleAll.forEach(title => {
//         title.addEventListener('click', function (e) {
//             readUser(title.id).forEach(element => {
//                 let li = document.createElement('li');
//                 li.textContent = element.text;
//                 li.id = element.id;
//                 li.classList.add(key);
//                 list.append(li);
//                 let btn = document.createElement('button');
//                 btn.classList.add('btn-delete');
//                 btn.textContent = 'Удалить отзыв';
//                 li.append(btn)
//             });
//         });
//     }, { once: true });
    
// }








