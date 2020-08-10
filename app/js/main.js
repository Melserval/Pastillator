'use strict';

// елементы панели контроля классов.
const classControllPanel = {
    conteiner: document.getElementById('class-controll'),
    inputClassName: document.querySelector('#class-controll label:nth-child(2) input'),
    inputPastilCount: document.querySelector('#class-controll label:nth-child(3) input'),
    inputUnitCount: document.querySelector('#class-controll label:nth-child(4) input'),
    inputApplyButton: document.querySelector('#class-controll [type="button"]')
};

const classesConteiner = document.getElementById('classes-conteiner');

// элементы панели информации классов
const classInfoPanelSpanCollection = document.getElementById('class-info')
                                        .getElementsByClassName('info');
const classInfoPanel = {
    conteiner: document.getElementById('class-info'),
    spanClassCount: classInfoPanelSpanCollection[0],
    spanPastelCount: classInfoPanelSpanCollection[1],
    spanUnitCount: classInfoPanelSpanCollection[2]
};

classControllPanel.inputApplyButton.addEventListener('click', function (event) {
    let uc = new UnitClass(
        classControllPanel.inputClassName.value,
        classControllPanel.inputPastilCount.value,
        classControllPanel.inputUnitCount.value,
        classesConteiner
    );
    vault.addItem(uc.valueOf());
});

// востановитель состояния (локальное хранилище).
const vault = new LocalStorager('main_vault', UnitClass, classesConteiner);


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
