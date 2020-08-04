'use strict';

/**
 * Конструктор социальных "классов" распределитель судеб и пастилок.
 * @param {string} className имя класса
 * @param {number} pastilsForUnit стартовое количество пастилок на каждого
 * @param {number} unitCount стартовое количество членов класса
 * @param {HTMLElement} renderParentNode корневой элемент для вью.
 */
function UnitClass(className, pastilsForUnit, unitCount, renderParentNode) {
	this.name = className;
	this.pastils = Number(pastilsForUnit);
	this._units = Number(unitCount);
	this.percentOfAllPastils;
	this.percentOfAllUnits;
	this.percentPastilsForUnit;
	this.pastilsForClass;
	this.unitsCount;
	this.view = new RenderUnitClass();
	Object.defineProperty(this, 'pastilsForClass', {
		get: function () {
			return this.unitsCount * this.pastils;
		}
	});
	Object.defineProperty(this, 'unitsCount', {
		get: function() {
			return this._units;
		},
		set: function (value) {
			this._units = value;
		}
	});
	this.unitCollection.push(this);
	this.view.appendTo(renderParentNode);

	// обязательно после вставки элемента в DOM!
	// иначе размеры будут нулевые и не получится 
	// правильно задать размер для диаграммы.
	this.constructor.updateStatePercents();

	// контрольное уведомление 
	console.log(this);
}

/**
 * Коллекция созданных классов, используется для
 * получения общих количеств пастилок и юнитов.
 */
UnitClass.prototype.unitCollection = Array();

/**
 * Общее количество всех юнитов.
 * @return {number}
 */
UnitClass.getAllUnitCount = function() {
	return this.prototype.unitCollection.reduce(
		(prev, unit) => prev + unit.unitsCount, 0);
};

/**
 * Общее количество пастилок у всех.
 * @return {number}
 */
UnitClass.getAllPastilsCount = function() {
	return this.prototype.unitCollection.reduce(
		(prev, unit) => prev + unit.pastilsForClass, 0);
};

/**
 * Коллекция созданных классов
 * @return {UnitClass}
 */
UnitClass.getAllClasses = function() {
	return this.prototype.unitCollection;
};

/**
 * Добавляет юнитов в класс
 * @param {number} count количество добавляемых юнитов
 */
UnitClass.prototype.addUnit = function (count) {
	this.unitsCount += count;
};

/**
 * Убирает юнитов из класса
 * @param  {number} count количество удаляемых юнитов
 */
UnitClass.prototype.disUnit = function (count) {
	this.unitsCount -= count;
};

/**
 * Добавляет пастилки для каждого юнита
 * @param {number} count количество пастилок
 */
UnitClass.prototype.addPastils = function (count) {
	this.pastils += count;
};

/**
 * Удаляет пастилки у каждого юнита
 * @param  {number} count количество пастилок
 */
UnitClass.prototype.disPastils = function (count) {
	this.pastils += count;
};

/**
 * Обновление данных по процентам существ и пастилок во всех объектах.
 */
UnitClass.updateStatePercents = function () {
	let all_pastils = this.getAllPastilsCount() / 100;
	let all_units = this.getAllUnitCount() / 100;
	let all_count_pastils_of_unit = this.prototype.unitCollection.reduce((total, unit) => {
		return total + unit.pastils;
	}, 0);
	let coff_pastils = all_count_pastils_of_unit / 100;
	

	this.prototype.unitCollection.forEach(unit => {
		// вычисление: процент пастилок на существо в классе, относительно других классов.
		unit.percentPastilsForUnit = unit.pastils / coff_pastils;
		console.log(unit.percentPastilsForUnit);

		// вычисление: процент пастилок на класс, относительно общего числа пастилок.
		unit.percentOfAllPastils = (all_pastils > 0) ? unit.pastilsForClass / all_pastils: 0;

		// Вычисление: сколько процентов существ в классе, относительно всех существ.
		unit.percentOfAllUnits   = (all_units > 0) ? unit.unitsCount / all_units: 0;
		unit.updateInfoOfRender();
	});
};

/**
 * Обновляет данные (render) в объекте отображающем информацию класса.
 */
UnitClass.prototype.updateInfoOfRender = function () {
	this.view.setClassName(this.name);
	this.view.setPastelForUnit(this.pastils);
	this.view.setPastelsCount(this.pastilsForClass);
	this.view.setUnitsCount(this.unitsCount);
	//this.view.setPercentPastils(this.percentOfAllPastils);
	this.view.setPercentPastils(this.percentPastilsForUnit);
	this.view.setPercentUnits(this.percentOfAllUnits);
};