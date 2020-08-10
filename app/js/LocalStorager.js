"use strict";

function LocalStorager(setName, constructor, renerConteiner) {
	this.setName = setName;
	if (window.localStorage.getItem(setName) !== null)
		this.unitsInfoSet = JSON.parse(window.localStorage[setName]);
	else 
		this.unitsInfoSet = [];
	
	this.unitsInfoSet.forEach(function (id) {

		let unitInfo = window.localStorage.getItem(id);
		if (unitInfo !== null) {
			unitInfo = JSON.parse(unitInfo);
			new constructor(unitInfo.name, 
							unitInfo.pastils, 
							unitInfo.units, 
							renerConteiner, 
							unitInfo.id);
			}
	});
}

LocalStorager.prototype.addItem = function (unitInfo) {
	// хранение ключей - идентификаторов, для упорядоченного 
	// извлечения и воссоздания объектов Типа UnitClass.
	this.unitsInfoSet.push(unitInfo.id);
	window.localStorage.setItem(this.setName, JSON.stringify(this.unitsInfoSet));
	window.localStorage.setItem(unitInfo.id, JSON.stringify(unitInfo));
};

LocalStorager.prototype.removeItem = function (unitInfo) {
	const i = this.unitsInfoSet.indexOf(unitInfo.id);
	this.unitsInfoSet.slplice(i, 1);

	window.localStorage.removeItem(unitInfo.id);
	window.localStorage.setItem(this.setName, JSON.stringify(this.unitsInfoSet));
};