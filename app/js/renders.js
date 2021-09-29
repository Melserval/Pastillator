'use strict';

/** 
 * DOM элемент отображающий текстовую  информацию.
 *
 * @property {string} numberOfUnits Количество существ.
 * @property {string} numberOfPastils Количество пастилок на 1 существо.
 * @property {string} nameOfClass Название класса существ.
 * @method insertInto размещает элемент в переданном аргументе-родителе.
 */
class RenderTextInfo {
    constructor() {
        this._tr              = document.createElement("tr");
        this._th_units        = document.createElement("td");
        this._spn_units_num   = document.createElement("span");
        this._spn_units_prc   = document.createElement("span");
        this._th_pastils      = document.createElement("td");
        this._spn_pastils_num = document.createElement("span");
        this._spn_pastils_prc = document.createElement("span");
        this._th_className    = document.createElement("td");

        this._th_units.append(this._spn_units_num, this._spn_units_prc);
        this._th_pastils.append(this._spn_pastils_num, this._spn_pastils_prc);
        this._tr.append(this._th_units, this._th_pastils, this._th_className);
    }

    set numberOfUnits(value) {
        this._spn_units_num.textContent = value;
    }

    set percentOfUnits(value) {
        this._spn_units_prc.textContent = value;
    }

    set numberOfPastils(value) {
        this._spn_pastils_num.textContent = value;
    }

    set percentOfPastils(value) {
        this._spn_pastils_prc.textContent = value;
    }

    set nameOfClass(value) {
        this._th_className.textContent = value;
    }

    /**
     * Помещает DOM элемент RenderDiagramInfo в указанный узел.
     * @param  {HTMLElement} parentNode родительский узел.
     * @return {HTMLElement}      вставляемый элемент.
     */
    insertInto(parentNode) {
        let comment = document.createComment("Сгенерирован " + Date());
        parentNode.append(comment);
        parentNode.append(this._tr);
        return this._tr;
    };
}

/**
 * DOM элемент отображающий графическую информацию - диаграмму.
 * ширина - процентное количество существ в классе.
 * высота - процентное количество пастилок на класс / на существо.
 *
 * @property {string} nameOfClass Название класса существ.
 * @property {number} numberOfUnits Количество существ.
 * @property {number} numberOfPastils Количество пастилок на 1 существо.
 * @property {number} numberOfTotalPastils Количество пастилок на класс.
 * @property {number} percentOfUnits Процент существ в классе от всех существ.
 * @property {number} percentOfPastils Процент пастилок на класс от всех пастилок.
 * @method insertInto размещает элемент в переданном аргументе-родителе.
 */
class RenderDiagramInfo {

    constructor() {
        // главный контейнер для всех элементов представления.
        this._elementNode = document.createElement('div');
        this._elementNode.setAttribute('class', 'class-conteiner');

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
        this._infoAllUnits.textContent = value;
    }

    set numberOfPastils(value) {
        this._infoPastelsForUnit.textContent = value;
    }

    set numberOfTotalPastils(value) {
        this._infoAllPastels.textContent = value;
    }

    set percentOfUnits(value) {
        // вычисляет и устанавливает ширину диаграммы количества существ.
        this._elementNode.style.width = value + "%";
    }

    set percentOfPastils(value) {
        // вычисляет и задает высоту диаграммы количества пастилок.
        let height = this._elementNode.clientHeight - this._infoConteiner.offsetHeight;
        let show = height / 100 * value;
        this._diagramConteiner.style.height = show + 'px';
        this._diagramConteiner.style.marginTop = height - show + 'px';
    }
    
    /**
     * Помещает DOM элемент RenderDiagramInfo в указанный узел.
     * @param  {HTMLElement} parentNode родительский узел.
     * @return {HTMLElement}      вставляемый элемент.
     */
    insertInto(parentNode) {
        let comment = document.createComment("Сгенерирован " + Date());
        parentNode.append(comment, this._elementNode);
        return this._elementNode;
    };
}
