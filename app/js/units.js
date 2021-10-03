"use strict";

// миксин для биндинга рендера вью-эелементов для объектов с данными.
const mixin_bindRender = {
	/**
	 * 
	 * @param {HTMLElement} nodeElement родительский элемент для размещения вью.
	 * @param {Class} viewConstructor   конструктор объекта вью.
	 * @param {Function} callbackHelper функция связвания полей вью с объектом данных.
	 */
	bindRender(nodeElement, viewConstructor, callbackHelper) {
		// класс обертка для объектов вью, связывающая их 
		// с обслуживающими функциями, заданными при биндиге.
		const c = class extends viewConstructor {
			constructor(model) {
				super();
				this.model = model;
			} 
			update() {
				callbackHelper(this, this.model);
			}
			show() {
				this.insertInto(nodeElement);
			}
		}
		if (!this._renders) this._renders = [];
		this._renders.push(c);
	}
};


// хранение данных
const unitData = new class UnitData {
	constructor () {
		this._activeSet = null;
		this.unitClassesSet = [];
		this._viewsHelper = [];
		this._events = {};
	}

	get activeSetName() {
		return this._activeSet.setName;
	}

	get activeSetID() {
		return this._activeSet.setID;
	}

	toJSON() {
		return {
			"active": this.activeSetName,
			"sets": this.unitClassesSet
		}
	}

	fromJSON(json) {
		this.unitClassesSet = json['sets'].map(ucs => UnitClassSet.fromJSON(ucs));
		this.unitClassesSet.forEach(ucs => ucs.render());
		this.activateSet(json['active']);
	}

	/**
	 * активация указанного набора.
	 * @param  {string | UnitClassSet} needle ИД или название набора | объект набора.
	 */
	activateSet(needle) {
		if (needle === this._activeSet?.setID 
		|| needle === this._activeSet?.setName
		|| needle === this._activeSet) {
			return;
		}

		if (typeof needle === "string") {
			var result = this.unitClassesSet.find(cls => cls.setID === needle || cls.setName === needle) ?? false;
		} 
		else if (needle instanceof UnitClassSet) {
			var result = (needle === this._activeSet) ? false : needle;
		}

		if (result) {
			this._activeSet?.clean();
			this._activeSet = result;
			this._activeSet.renderItems();
			this.updateRender();
			this.trigger("changeset", {id: this._activeSet.setID, name: this._activeSet.setName});
		}
	}

	get activeSet() {
		return this._activeSet;
	}

	newSet(name) {
		const class_set = new UnitClassSet(name);
		class_set.render();
		this.unitClassesSet.push(class_set);
		this.activateSet(class_set);
	}

	listNames() {
		return this.unitClassesSet.map(item => item.setName);
	}

	save() {
		window.localStorage.setItem("UNIT_DATA", JSON.stringify(this));
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

	bindView(callbackFunc) {
		this._viewsHelper.push(callbackFunc);
	}

	updateRender() {
		// TODO: Вот пример почему нужно решить задания для каждой 
		// вьюшной функции привязки к своему рендеру! ! !
		this._viewsHelper.forEach(func => func(this._activeSet));
	}

	// сервис событий.
	trigger(eventName, ...eventArgs) {
		if ( !this._events[eventName]) return;
		this._events[eventName].forEach(handler => handler.apply(this, eventArgs));
	}
	on(eventName, handler) {
		if (!this._events[eventName]) this._events[eventName] = [];
		this._events[eventName].push(handler);
	}
	off(eventName, handler) {
		if (this._events[eventName]) {
			for (let i = this._events[eventName].length - 1; i >= 0; i--) {
				if (this._events[eventName][i] === handler) {
					this._events[eventName].splice(i, 1);
				}
			}
		}
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
	constructor(setName, id=null) {
		this.constructor._count_class_sets += 1;

		this.setName = setName;
		this.setID = id ?? (Date.now() + this.constructor._count_class_sets).toString(24);
		// общее количество пастилок для всех существ во всех сословиях.
		this.allPastils = 0;
		// общее количество пастилок выделенных на 1 существо из каждого сословия.
		this.pastilsForUnits = 0;
		this.allUnits = 0;
		this._units = [];
		this._views = [];
	}

	get allClasses() {
		return this._units.length;
	}

	add(...unit_class) {
		unit_class.forEach((element) => {
			element.bindSet(this); // TODO: Избавиться от этого связывания. Это ОЧЕНЬ плохо.
			this.pastilsForUnits += element.pastilsForUnit;
			this.allPastils += element.pastilsForClass;
			this.allUnits += element.numberOfUnits;
			this._units.push(element);
		});
		for (let element of this._units) {
			element.updateRender();
		}
	}
	// псевдо события
	changePastils(count) {
		this.allPastils = this.allPastils + count;
		this._units.forEach(unit => unit.updateRender());
	}

	// отображение хранимых классов.
	renderItems() {
		this._units.forEach(item => item.render());
	}

	toJSON() {
		return {
			"name": this.setName,
			"units": this._units
		}
	}

	static fromJSON(json) {
		const unit = new this(json['name']);
		unit.add(...json["units"].map(e => UnitClassHub.fromJSON(e)));
		return unit;
	};

	render() {
		for (let renderView of this.constructor._renders) {
			let view = new renderView(this);
			view.update();
			view.show();
			this._views.push(view);
		}
	}

	updateRender() {
		this._views.forEach(view =>  view.update());
	}

	clean() {
		this._units.forEach(u => u.clean());
	}

	static _count_class_sets = 0;
}
Object.assign(UnitClassSet, mixin_bindRender);


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
	    this._classset = null;
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
		return Math.floor((this._numberOfUnints / (this._classset.allUnits / 100)) * 100) / 100;
	}

	get percentOfPastils() {
		if (this._pastils < 1) return 0;
		// переключение процентов
		switch (2) {
			case 1: // процент пастилок от всего их количества.
				return Math.floor((this.pastilsForClass / (this._classset.allPastils / 100)) * 100) / 100;	
			case 2: // процент пастилок выделенных на 1 унита.
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
		this._views.forEach(view => view.update());
	}

	render() {
		for (let render of this.constructor._renders) {
			let view = new render(this);
			view.show();
			this._views.push(view);
		}
		this.updateRender();
	}

	clean() {
		this._views.forEach(view => view.goodbyeDOM());
		this._views.length = 0;
	}

	// установка ссылки на агрегирующий объект типа UnitClassSet.
	bindSet(classset) {
		this._classset = classset;
	};

	toString() {
		return `${this._name} ${this._pastils} ${this._numberOfUnints}`;
	}

	toJSON() {
		return {
			"id": this.id,
			"name": this._name,
			"pastils": this._pastils,
			"units": this._numberOfUnints
		}
	}

	static fromJSON({name, pastils, units, id}) {
		return new this(name, pastils, units, id);
	}
}
Object.assign(UnitClassHub, mixin_bindRender);
