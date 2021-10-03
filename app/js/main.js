'use strict';

// елементы панели контроля набора классов.
const selectSetsClass = document.getElementById("class-set-list")
    , inputSetsName = document.getElementById("class-set-name")
    , bthCreateSets = document.getElementById("class-set-create");

// елементы панели контроля классов.
const inputClassName   = document.getElementById('class-name')
    , inputPastilCount = document.getElementById('pastils-for-unit')
    , inputUnitCount   = document.getElementById('class-unit-number')
    , btnCreateClass = document.getElementById('class-create');

// контейнер отображения диаграмм сословий.
const diagramInfoConteiner = document.getElementById('classes-conteiner');

// контейнер отображения текстовой информации - по сословиям.
const textInfoConteiner = document.getElementById("unit-class-info");

// контейнер отображения текстовой информации - общие данные.
const tbodyClassesInfo = document.getElementById("classes-info");


//--- установка и настройка view хтмл элементов. ---
//
// показ общих (сводных) данных в таблице
unitData.bindView(classSet => {
    tbodyClassesInfo.rows[1].cells[0].textContent = classSet.setName; // название набора
    tbodyClassesInfo.rows[3].cells[0].textContent = classSet.allUnits; // общее число существ
    tbodyClassesInfo.rows[3].cells[1].textContent = classSet.allPastils; // общее число пастилок на всех.
    tbodyClassesInfo.rows[3].cells[2].textContent = classSet.allClasses; // число классов в наборе.
});
// показ списка наборов в элементе select.
UnitClassSet.bindRender(selectSetsClass, RenderOptionElement, (view, model) => {
    view.optionValue = model.setID;
    view.optionText = model.setName;
});
// показ текстовых данных в таблице.
UnitClassHub.bindRender(textInfoConteiner, RenderTextInfo, (view, model) => {
    view.numberOfUnits    = model.numberOfUnits;
    view.percentOfUnits   = model.percentOfUnits;
    view.numberOfPastils  = model.pastilsForUnit;
    view.percentOfPastils = model.percentOfPastils
    view.nameOfClass      = model.nameOfClass;
});
// показ диаграм в главном блоке.
UnitClassHub.bindRender(diagramInfoConteiner, RenderDiagramInfo, (view, model) => {
    view.nameOfClass          = model.nameOfClass;
    view.numberOfUnits        = model.numberOfUnits;
    view.numberOfPastils      = model.pastilsForUnit;
    view.numberOfTotalPastils = model.pastilsForClass;
    view.percentOfUnits       = model.percentOfUnits;
    view.percentOfPastils     = model.percentOfPastils;
});

// вызов создание набора классов по клику кнопки.
bthCreateSets.addEventListener('click', function (event) {
    const setName = inputSetsName.value.trim();
    try {
        if (setName.length < 1) throw new Error("Не указано имя набора.");
        unitData.newSet(setName);
        // очистка полей ввода
        inputSetsName.value = "";
    } catch (err) {
        console.error(err);
        alert(`Ошибка создания набора!\n${err.name}: ${err.message}`);
    }
});

// обработка нажатия кнопки создания класса и сосздание оного....
btnCreateClass.addEventListener('click', function (event) {
    // TODO: Проверки видимо следует перенести в класс. Так как отсутствие данных - мешает работе именно класса.
    const name = inputClassName.value.trim();
    const pastils = Number(inputPastilCount.value);
    const units = Number(inputUnitCount.value);
    try {
        if (isNaN(pastils) || pastils < 0) throw new TypeError("Неверное значение для пастилок.");
        if (isNaN(units) || units < 0) throw new TypeError("Неверное значение для существ.")
        if (name.length < 1) throw new Error("Не указано имя сословия");

        const unitObj = new UnitClassHub(name, pastils, units);
        unitData.activeSet.add(unitObj);
        unitObj.render();
        // очистка полей ввода
        inputClassName.value = inputPastilCount.value = inputUnitCount.value = "";
    } catch(err) {
        console.error(err);
        alert(`Ошибка создания сословия!\n${err.name}: ${err.message}`);
    }
});

function randomColor() {
    const low = 35, top = 235;
    let r, g, b;
    r =  low + Math.floor(Math.random() * (top - low));
    g =  low + Math.floor(Math.random() * (top - low));
    b =  low + Math.floor(Math.random() * (top - low));
    return `rgb(${r}, ${g}, ${b})`;
}

// выбор нового набора классов в элементе селект.
selectSetsClass.addEventListener('change', e => unitData.activateSet(e.target.value));

unitData.on("changeset", function(e) {
    if (selectSetsClass.value === e.id) return;
    for (let option of selectSetsClass.options) {
        if (option.value === e.id) {
            option.selected = true;
            break;
        }
    }
});

// базовый набор данных.
unitData.load();