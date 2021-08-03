'use strict';

/** 
 * DOM элемент отображающий текстовую информацию.
 * 
 *
 * @property {number} numberOfUnits Количество существ.
 * @property {number} numberOfPastils Количество пастилок на 1 существо.
 * @property {string} nameOfClass Название класса существ.
 * @method insertInto размещает элемент в переданном аргументе-родителе.
 */
class RenderTextInfo {
    constructor() {
        this._tr = document.createElement("tr");
        this._th_units = document.createElement("td");
        this._th_pastils = document.createElement("td");
        this._th_className = document.createElement("td");

        this._tr.append(this._th_units, this._th_pastils, this._th_className);
    }

    set numberOfUnits(value) {
        this._th_units.textContent = value;
    }

    set numberOfPastils(value) {
        this._th_pastils.textContent = value;
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