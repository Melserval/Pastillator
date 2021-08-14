"use strict";

// хранение данных
const unitData = new class UnitData {
	constructor () {
		this.activeSetName = "";
		this._activeSet = null;
		this.unitClassesSet = [];
	}

	toJSON() {
		return `{
			"active": "${this.activeSetName}",
			"sets": ${this.unitClassesSet.reduce((s, i, n, a) =>  s + i.toJSON() + (n == a.length - 1 ? "": ","), "[")}]
		}`
	}

	fromJSON(json) {
		this.activeSetName = json['active'];
		this.unitClassesSet = json['sets'].map(e => UnitClassSet.fromJSON(e));
		for (let set of this.unitClassesSet) {
			if (set.setName === this.activeSetName) {
				set.renderItems();
				this._activeSet = set;
			}
		}
	}

	get activeSet() {
		return this._activeSet;
	}

	newSet(name) {
		this.activeSetName = name;
		this._activeSet = new UnitClassSet(name);
		this.unitClassesSet.push(this._activeSet);
	}

	listNames() {
		return this.unitClassesSet.map(item => item.setName);
	}

	save() {
		window.localStorage.setItem("UNIT_DATA", this.toJSON());
	}

	load() {
		const data = window.localStorage.getItem("UNIT_DATA");
		if (data == null) {
			this.newSet("Базовый");
		} else {
			this.fromJSON(JSON.parse(data));
		}
	}

	clear() {
		window.localStorage.removeItem("UNIT_DATA");
	}
};

// содержит набор связанных сущностей, для хранения различных 
// классовых наборов. Позволяет вычислять общее количество в
// сословиях юнитов, пастилок и их процентные соотношения.
class UnitClassSet {
	/**
	 * constructor
	 * @param  {string} setName название набора.
	 */
	constructor(setName) {
		this.setName = setName;
		// всего пастилок в сословиях.
		this.allPastils = 0;
		// пастилки распределенные на 1 унита, их общая сумма.
		this.pastilsForUnits = 0;
		this.allUnits = 0;
		this._units = [];
	}

	toJSON() {
		return `{
			"name": "${this.setName}",
			"units": ${this._units.reduce((s, i, n, a) =>  s + i.toJSON() + (n == a.length - 1 ? "": ","), "[")}]
		}`
	}

	add(...unit_class) {
		unit_class.forEach((element) => {
			element.bindSet(this);
			this.pastilsForUnits += element.pastilsForUnit;
			this.allPastils += element.pastilsForClass;
			this.allUnits += element.numberOfUnits;
			this._units.push(element);
		});
		this._units.forEach(element => element.updateRender());
	}

	// псевдо события
	changePastils(count) {
		this.allPastils = this.allPastils + count;
		this._units.forEach(unit => unit.updateRender());
	}

	renderItems() {
		this._units.forEach(item => item.render());
	}
}

UnitClassSet.fromJSON = function(json) {
	const unit = new UnitClassSet(json['name']);
	unit.add(...json["units"].map(e => UnitClassHub.fromJSON(e)));
	return unit;
};


/**
 * Конструктор социальных "классов" распределитель судеб и пастилок.
 * Представляет социальный класс, содержащий количество унитов-членов
 * класса и количество пастилок выделяемого на каждого из них.
 *
 * @method addPastils увеличить количество пастилок для каждого существа.
 * @method disPastils уменьшить количество пастилок для каждого существа.
 * @method bindRender установка и настройка рендера для данных.
 *
 * @property {number} pastilsForClass общее количество пастилок на класс.
 * @property {number} pastilsForUnit количество пастилок для одного существа.
 * @property {number} numberOfUnits количество существ в классе.
 * @property {string} nameOfClass имя сословия-класса существ.
 * 
 */
class UnitClassHub {
	/**
	 * объект опций.
	 * @param  {string} name     название класса существ.
	 * @param  {number} pastils  количество пастилок на каждое существо.
	 * @param  {number} units    количество существ в классе.
	 * @param  {number} [id]     дата создания (в виде миллисекунд).
	 */
	constructor(name, pastils, units, id) {
		this.id =  id ?? +new Date();
		this._name = name;
		this._pastils = Number(pastils);
	    this._numberOfUnints = Number(units);
	    this._views = [];
	    this._classset;
	}

	toJSON() {
		return `{
			"id": ${this.id},
			"name": "${this._name}",
			"pastils": ${this._pastils},
			"units": ${this._numberOfUnints}
		}`
	}
	
	get pastilsForClass() {
		return this._pastils * this._numberOfUnints;
	}

	get pastilsForUnit() {
		return this._pastils;
	}

	get numberOfUnits() {
		return this._numberOfUnints;
	}

	get nameOfClass() {
		return this._name;
	}

	get percentOfUnits() {
		if (this._numberOfUnints < 1) return 0; 
				// округление до 2-х знаков после запятой. 
		return Math.floor((this._numberOfUnints / (this._classset.allUnits / 100)) * 100) / 100;
	}

	get percentOfPastils() {	
		if (this._pastils < 1) return 0;	
		// переключение процентов
		switch (2) {
			// процент пастилок от всего их количества.
			case 1: 
				return Math.floor((this.pastilsForClass / (this._classset.allPastils / 100)) * 100) / 100;
			// процент пастилок выделенных на 1 унита.
			case 2:
				return Math.floor((this.pastilsForUnit / (this._classset.pastilsForUnits / 100)) * 100) / 100;
			default:
				return 0;
		}
	}

	/**
	 * Добавляет пастилки для каждого юнита в классе.
	 * @param {number} count количество пастилок
	 */
	addPastils(count) {
		this.pastils += count;
		this._classset.changePastils(+count);
	}

	/**
	 * Удаляет пастилки у каждого юнита
	 * @param  {number} count количество пастилок.
	 */
	disPastils(count) {
		this.pastils -= count;
		this._classset.changePastils(-count);
	}

	updateRender() {
		this._views.forEach((view, index) => {
			if (view) // возможен заполнитель null (обеспечение совпадений индексов)!
				this._renders[index].helper(view, this);
		});
	}

	toString() {
		return `${this._name} ${this._pastils} ${this._numberOfUnints}`;
	}

	/**
	 * Создает отображения для данных объекта.
	 */
	render() {
		// создание вьюшек и установка стартовых значений.
	    // при пропуске создания view, в _views должен быть 
	    // вставлен заполнитель (null), для совпадений индексов
	    // массивов _views и prototype._renders !!!
	    this._renders.forEach(render => {
	    	const view = new render.view();
	    	view.insertInto(render.node);
	    	this._views.push(view);
	    });
	    this.updateRender();
	}
}

// конструкторы DOM элементов отображения данных.
UnitClassHub.prototype._renders = [];

/**
 * Назначает конструктор для view-элемента-объекта.
 * и функцию, в которой происходит процесс работы с 
 * экземпляром созданного view.
 * 
 * @param  {Class} viewConstructor конструктор объектов view.
 * @param  {Function} callbackHelper  функция для работы с экземпяром view.
 *                                    арг 1: экземпляр view.
 *                                    arg 2: экземпляр источник данных.
 * 
 */
UnitClassHub.bindRender = function(nodeElement, viewConstructor, callbackHelper) {
	this.prototype._renders.push({node: nodeElement, view: viewConstructor, helper: callbackHelper});
};

UnitClassHub.prototype.bindSet = function(classset) {
	this._classset = classset;
};

UnitClassHub.fromJSON = function(json) {
	const {name, pastils, units, id} = json;
	const uch = new UnitClassHub(name, pastils, units, id);
	return uch;
};

