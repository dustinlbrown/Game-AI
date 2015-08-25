/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod  = require('upgrader'); // -> 'a thing'
 */
 
 var states = {
	harvesting: 'harvesting',
	upgrading: 'upgrading'
};

module.exports = function (minion) {
    if (minion.carry.energy === 0) {
        minion.memory.action = states.harvesting;
    }

	var canCarry = minion.carry.energy < minion.carryCapacity;
	var isHarvesting = minion.memory.action === states.harvesting;

	if (canCarry && isHarvesting) {
		var sources = minion.room.find(FIND_SOURCES);
		minion.moveTo(sources[1]);
		minion.harvest(sources[1]);
	}
	else {
		minion.moveTo(minion.room.controller);
        minion.upgradeController(minion.room.controller);
        minion.memory.action = states.upgrading;
	}
}