
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
	    this._renders.forEach(render => {
			const view = new render.view();
			render.helper(view, this);
			this._views.push(view);
		});
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
}

UnitClass.prototype._renders = [];

UnitClass.bindRender = function(viewConstructor, callbackHelper) {
	this.prototype._renders.push({view: viewConstructor, helper: callbackHelper});
};
