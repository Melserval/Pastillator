'use strict';

/**
 * Создание HTMLnode и объекта контроля этого узла.
 */
function RenderUnitClass() {
	// HTML узел отображаемый на дисплее.
	let classConteiner = document.createElement('div',);
		classConteiner.setAttribute('class', 'class-conteiner');

	let diagramConteiner = document.createElement('div');
		diagramConteiner.setAttribute('class', 'diagram-conteiner');
		diagramConteiner.style.backgroundColor = randomColor();

	let unitClassName = document.createElement('div');
		unitClassName.setAttribute('class', 'class-name');

	let infoConteiner = document.createElement('div');
		infoConteiner.setAttribute('class', 'info-conteiner');

	let pastelForUnit = document.createElement('div');
		pastelForUnit.setAttribute('class', 'pastel-for-unit');

	let allUnits = document.createElement('div');
		allUnits.setAttribute('class', 'all-units');

	let allPastels = document.createElement('div');
		allPastels.setAttribute('class', 'all-pastels');

	classConteiner.append(diagramConteiner, 
		                  infoConteiner);

	infoConteiner.append(unitClassName, 
						 pastelForUnit, 
						 allUnits, 
						 allPastels);

	// объект для управления отображением содержимого,
	// свойства - это ссылки на хтмл элементы для вставки данных.
	this._elementNode = classConteiner;
	this._diagramConteiner = diagramConteiner;
	this._infoConteiner = infoConteiner;
	this._infoClassName = unitClassName;
	this._infoPastelsForUnit = pastelForUnit;
	this._infoAllUnits = allUnits;
	this._infoAllPastels = allPastels;
}

/**
 * Установка данных "имя класса существ".
 * @param {string} name название класса существ
 */
RenderUnitClass.prototype.setClassName = function(name) {
	this._infoClassName.textContent = name;
};

/**
 * Установка данных "сколько пастилок на каждого".
 * @param {number} count количество пастилок для существа
 */
RenderUnitClass.prototype.setPastelForUnit = function(count) {
	this._infoPastelsForUnit.textContent = count;
};

/**
 * Установка данных "общеего количества пастилок".
 * @param {number} count общее количество пастилок
 */
RenderUnitClass.prototype.setPastelsCount = function(count) {
	this._infoAllPastels.textContent = count;
};

/**
 * Установка данных "Сколько существ в классе".
 * @param {number} count общее количество существ
 */
RenderUnitClass.prototype.setUnitsCount = function(count) {
	this._infoAllUnits.textContent = count;
};

/**
 * Установка данных "процент существ в классе от общего количества",
 * вычисляет и устанавливает ширину диаграммы количества существ.
 * 
 * @param {number} count процент существ.
 */
RenderUnitClass.prototype.setPercentUnits = function(count) {
	let width = this._elementNode.parentElement.clientWidth / 100 * count.toFixed(2) - 2;
	this._diagramConteiner.style.width = width + 'px';
};

/**
 * Установка данных "процент пастилок в классе от общего количества"
 * вычисляет и задает высоту диаграммы количества пастилок.
 * @param {number} count процент пастилок.
 */
RenderUnitClass.prototype.setPercentPastils = function(count) {
	let height = this._elementNode.clientHeight - this._infoConteiner.offsetHeight;
	let show = height / 100 * count;
	this._diagramConteiner.style.height = show + 'px';
	this._diagramConteiner.style.marginTop = height - show + 'px';
};

/**
 * Возвращает корневой ХТМЛ элемент "класса существ".
 * @return {HTMLDivElement}
 */
RenderUnitClass.prototype.getElementNode = function() {
	return this._elementNode;
};

/**
 * Помещает элемент внуть указанного родителя.
 * @param {HTMLElement} parentNode корневой элемент.
 */
RenderUnitClass.prototype.appendTo = function (parentNode) {
	let comment = document.createComment("Сгенерирован " + Date());
	parentNode.append(comment);
	parentNode.append(this._elementNode);
};
