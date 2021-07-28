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

// контейнер отображения текстовой информации по соословиям.
const classesTextInfo = document.getElementById("classes-textinfo");

// элементы панели информации классов
const classInfoPanelSpanCollection = document.getElementById('class-info')
                                        .getElementsByClassName('info');
const classInfoPanel = {
    conteiner: document.getElementById('class-info'),
    spanClassCount: classInfoPanelSpanCollection[0],
    spanPastelCount: classInfoPanelSpanCollection[1],
    spanUnitCount: classInfoPanelSpanCollection[2]
};

// востановитель состояния (локальное хранилище).
const vault = new LocalStorager('main_vault');


// настройка view хтмл элементов.
UnitClass.bindRender(RenderTextInfo, (view, model) => {
    view.insertInto(classesTextInfo.querySelector("table"));
    view.numberOfUnits   = model.numberOfUnits;
    view.numberOfPastils = model.pastilsForUnit;
    view.nameOfClass     = model.nameOfClass;
});
UnitClass.bindRender(RenderDiagramInfo, (view, model) => {
    view.insertInto(classesConteiner);
    view.nameOfClass          = model.nameOfClass;
    view.numberOfUnits        = model.numberOfUnits;
    view.numberOfPastils      = model.pastilsForUnit;
    view.numberOfTotalPastils = model.pastilsForClass;
    view.percentOfUnits       = model.percentOfUnits; // TODO: заглушка
    view.percentOfPastils     = model.percentOfPastils; // TODO: заглушка
});

classControllPanel.inputApplyButton.addEventListener('click', function (event) {
    const unit = new UnitClass(
        classControllPanel.inputClassName.value,
        classControllPanel.inputPastilCount.value,
        classControllPanel.inputUnitCount.value
    );
    // TODO: Надо убрать это дерьмо. Должно сохранятся при закрытии программы. Но не в процессе работы!
    vault.addItem(unit.valueOf());
});

// воссоздание коллекции объектов.
vault.getElements().forEach(uc => {
    new UnitClass(uc.name, uc.pastils, uc.units, uc.id);
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
