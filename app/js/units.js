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
		this.allPastils = 0;
		this.allUnits = 0;
		this._units = [];
	}

	add(...unit_class) {
		unit_class.forEach((element) => {
			element.bindSet(this);
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
}


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
		return this._numberOfUnints / (this._classset.allUnits / 100);
	}

	get percentOfPastils() {
		return this.pastilsForClass / (this._classset.allPastils / 100);
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
	    this._renders.forEach(render => this._views.push(new render.view()));
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
UnitClassHub.bindRender = function(viewConstructor, callbackHelper) {
	this.prototype._renders.push({view: viewConstructor, helper: callbackHelper});
};

UnitClassHub.prototype.bindSet = function(classset) {
	this._classset = classset;
};
