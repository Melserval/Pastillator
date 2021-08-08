"use strict";

// хранит сериализованные объекты унитов.
// поскольку один объект может состоять в различный наборах, то в 
// хранилище он сам по себе, не будучи связан какой либо коллекцией.
// 
// для определения к какому набору объект принадлежит его ID хранится
// в именнованном наборе, и при воссоздани набора объекты извлекаются
// из общего хранилища по этим ключам из набора.
function LocalStorager(setName) {
	this.setName = setName;
	this.unitsInfoSet = window.localStorage.getItem(setName) 
		? JSON.parse(window.localStorage[setName])
		: [];
}

LocalStorager.prototype.addItem = function (unitInfo) {
	// добаление id обекта в набор 
	this.unitsInfoSet.push(unitInfo["id"]);
	window.localStorage.setItem(this.setName, JSON.stringify(this.unitsInfoSet));
	// добавление самого объекта в хранилище.
	window.localStorage.setItem(unitInfo["id"], JSON.stringify(unitInfo));
};

LocalStorager.prototype.removeItem = function (unitInfo) {
	window.localStorage.removeItem(unitInfo.id);
	// перезапись хранилища.
	this.unitsInfoSet = this.unitsInfoSet.filter(unit => unit.id != unitInfo.id);
	window.localStorage.setItem(this.setName, JSON.stringify(this.unitsInfoSet));
};

LocalStorager.prototype.getElements = function() {
	return this.unitsInfoSet.map((unit_id) => {
		const unit = window.localStorage.getItem(unit_id);
		return unit && JSON.parse(unit);
	});
};

LocalStorager.prototype.clearInfoset = function() {
	this.unitsInfoSet.forEach(unit_id => window.localStorage.removeItem(unit_id));
	this.unitsInfoSet = [];
	window.localStorage.removeItem(this.setName);
};