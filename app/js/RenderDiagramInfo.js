'use strict';

/**
 * DOM элемент отображающий графическую информацию,
 * в виде диаграммы, где высота - количество пастилок на класс,
 * а ширина - количество существ в этом классе.
 *
 * @property {string} nameOfClass Название класса существ.
 * @property {number} numberOfUnits Количество существ.
 * @property {number} numberOfPastils Количество пастилок на 1 существо.
 * @property {number} numberOfTotalPastils Количество пастилок на класс.
 * @property {number} persentOfUnits Процент существ в классе от всех существ.
 * @property {number} persentOfPastils Процент пастилок на класс от всех пастилок.
 * @method insertInto размещает элемент в переданном аргументе-родителе.
 */
class RenderDiagramInfo {

	constructor() {

		// главный контейнер для всех элементов представления.
		this._elementNode = document.createElement('div');
		this._elementNode.setAttribute('class', 'class-conteiner');
		this._elementNode.onmousedown = this.drag; // TODO: позже делегировать общему методу.

		// элемент выполняющий роль диаграммы.
		this._diagramConteiner = document.createElement('div');
		this._diagramConteiner.setAttribute('class', 'diagram-conteiner');
		this._diagramConteiner.style.backgroundColor = randomColor();

		// отдельный контейнер для текстовой информации рядом с диаграммой.
		this._infoConteiner = document.createElement('div');
		this._infoConteiner.setAttribute('class', 'info-conteiner');

		// название класса существ.
		this._infoClassName = document.createElement('div');
		this._infoClassName.setAttribute('class', 'class-name');
		// количество пастилок на существо из класса.
		this._infoPastelsForUnit = document.createElement('div');
		this._infoPastelsForUnit.setAttribute('class', 'pastel-for-unit');
		// количество существ в классе.
		this._infoAllUnits = document.createElement('div');
		this._infoAllUnits.setAttribute('class', 'all-units');
		// общее количество пастилок на всех существ в классе.
		this._infoAllPastels = document.createElement('div');
		this._infoAllPastels.setAttribute('class', 'all-pastels');

		this._infoConteiner.append(
			this._infoClassName, 
			this._infoPastelsForUnit, 
			this._infoAllUnits, 
			this._infoAllPastels
		);

		this._elementNode.append(
			this._diagramConteiner, 
			this._infoConteiner
		);
	}

	set nameOfClass(value) {
		this._infoClassName.textContent = value;
	}

	set numberOfUnits(value) {
		this._infoAllUnits = value;
	}

	set numberOfPastils(value) {
		this._infoPastelsForUnit = value;
	}

	set numberOfTotalPastils(value) {
		this._infoAllPastels = value;
	}

	set persentOfUnits(value) {
		// вычисляет и устанавливает ширину диаграммы количества существ.
		let width = this._elementNode.parentElement.clientWidth / 100 * persent.toFixed(2) - 2;
		this._diagramConteiner.style.width = width + 'px';
	}

	set persentOfPastils(value) {
		// вычисляет и задает высоту диаграммы количества пастилок.
		let height = this._elementNode.clientHeight - this._infoConteiner.offsetHeight;
		let show = height / 100 * count;
		this._diagramConteiner.style.height = show + 'px';
		this._diagramConteiner.style.marginTop = height - show + 'px';
	}

	/**
	 * Помещает элемент внуть указанного родителя.
	 * @param {HTMLElement} parentNode корневой элемент.
	 */
	
	/**
	 * Помещает DOM элемент RenderDiagramInfo в указанный узел.
	 * @param  {HTMLElement} parentNode родительский узел.
	 * @return {HTMLElement}      вставляемый элемент.
	 */
	insertInto(parentNode) {
		let comment = document.createComment("Сгенерирован " + Date());
		parentNode.append(comment);
		parentNode.append(this._elementNode);
		return this._elementNode;
	};

	// Экспериментальный функционал для перетаскивания.
	drag(event) {
		console.log(this);
		console.log(event);
		document.body.appendChild(this);
		this.style.position = 'absolute';
	};
}
