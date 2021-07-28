
/**
 * Конструктор социальных "классов" распределитель судеб и пастилок.
 * Представляет социальный класс, содержащий количество унитов-членов
 * класса и количество пастилок выделяемого на каждого из них.
 *
 * @method valueOf сериализованные данные.
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
class UnitClass {

	/**
	 * [constructor description]
	 * @param  {string} className      название класса существ.
	 * @param  {number} pastilsForUnit количество пастилок на каждое существо.
	 * @param  {number} unitCount      количество существ в классе.
	 * @param  {number} [id]           дата создания (в виде миллисекунд).
	 */
	constructor(className, pastilsForUnit, unitCount, id) {
		this._id =  id || +new Date();
		this._name = className;
		this._pastils = Number(pastilsForUnit);
	    this._numberOfUnints = Number(unitCount);
	    this._views = [];

	    // создание вьюшек и установка стартовых значений.
	    // при пропуске создания view, в _views должен быть 
	    // вставлен заполнитель (null), для совпадений индексов
	    // массивов _views и prototype._renders !!!
	    this._renders.forEach(render => this._views.push(new render.view()));

	    this._renderUpdate();
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
		return 25; //HACK: заглушка значения.
	}

	get percentOfPastils() {
		return 50.0; //HACK: заглушка значения.
	}

	valueOf() {
		return {
			"id":      this._id,
			"name":    this._name,
			"pastils": this._pastils,
			"units":   this._numberOfUnints
		};
	}
	/**
	 * Добавляет пастилки для каждого юнита в классе.
	 * @param {number} count количество пастилок
	 */
	addPastils(count) {
		this.pastils += count;
	}

	/**
	 * Удаляет пастилки у каждого юнита
	 * @param  {number} count количество пастилок.
	 */
	disPastils(count) {
		this.pastils -= count;
	}

	_renderUpdate() {
		this._views.forEach((view, index) => {
			if (view) // может быть null (обеспечение совпадений индексов)!
				this._renders[index].helper(view, this);
		});
	}
}

UnitClass.prototype._renders = [];

/**
 * Назначает конструктор для view-элемента-объекта.
 * и функцию для работы с экземпляром созданного view.
 * 
 * @param  {Class} viewConstructor конструктор объектов view.
 * @param  {Function} callbackHelper  функция для работы с экземпяром view.
 *                                    арг 1: экземпляр view.
 * 
 */
UnitClass.bindRender = function(viewConstructor, callbackHelper) {
	this.prototype._renders.push({view: viewConstructor, helper: callbackHelper});
};
