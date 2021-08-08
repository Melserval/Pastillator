'use strict';

// елементы панели контроля классов.
const classControllPanel = {
    conteiner: document.getElementById('class-controll'),
    inputClassName: document.querySelector('#class-controll label:nth-child(2) input'),
    inputPastilCount: document.querySelector('#class-controll label:nth-child(3) input'),
    inputUnitCount: document.querySelector('#class-controll label:nth-child(4) input'),
    inputApplyButton: document.querySelector('#class-controll [type="button"]')
};

// контейнер отображения диаграмм сословий.
const classesConteiner = document.getElementById('classes-conteiner');

// контейнер отображения текстовой информации - по сословиям.
const textInfo_unitClass = document.getElementById("unit-class-info");

// контейнер отображения текстовой информации - общие данные.
const textInfo_allClasses = document.getElementById('classes-info');
const classInfoPanel = {
    conteiner: textInfo_allClasses,
    unitsCount: textInfo_allClasses.rows[1].cells[0],
    pastilsCount: textInfo_allClasses.rows[1].cells[1],
    classesCount: textInfo_allClasses.rows[1].cells[2]
};


//--- установка и настройка view хтмл элементов. ---
//
// показ текстовых данных в общей таблице.
UnitClassHub.bindRender(RenderTextInfo, (view, model) => {
    view.insertInto(textInfo_unitClass);
    view.numberOfUnits   = model.numberOfUnits;
    view.numberOfPastils = model.pastilsForUnit;
    view.nameOfClass     = model.nameOfClass;
});
// показ диаграм в главном блоке.
UnitClassHub.bindRender(RenderDiagramInfo, (view, model) => {
    view.insertInto(classesConteiner);
    view.nameOfClass          = model.nameOfClass;
    view.numberOfUnits        = model.numberOfUnits;
    view.numberOfPastils      = model.pastilsForUnit;
    view.numberOfTotalPastils = model.pastilsForClass;
    view.percentOfUnits       = model.percentOfUnits;
    view.percentOfPastils     = model.percentOfPastils;
});


// востановитель состояния (локальное хранилище).
const vault = new LocalStorager('main_vault');

// основной набор данных.
const unitSetMain = new UnitClassSet("основной");

// обработка нажатия кнопки создания класса и сосздание оного....
classControllPanel.inputApplyButton.addEventListener('click', function (event) {
    const name = classControllPanel.inputClassName.value;
    const pastils = Number(classControllPanel.inputPastilCount.value);
    const units = Number(classControllPanel.inputUnitCount.value);
    try {
        if (isNaN(pastils) || isNaN(units)) throw new Error("Не числовое значение");
        if (name.trim().length == 0) throw new Error("Не указано имя сословия");
        const unitObj = new UnitClassHub(name, pastils, units);
        unitSetMain.add(unitObj);
        unitObj.render();
    } catch(err) {
        alert("Неверные данные сословия!" + err.message);
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

classesConteiner.addEventListener('click', function (event) {
    var mytar = event.target.closest('.class-conteiner');
    if (mytar) {
        console.log(mytar);
    } 
});
