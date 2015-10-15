/**
 * Created by Dustin on 8/26/2015.
 */

var ACTIONS = {
    HARVEST: 1,
    DEPOSIT: 2
};
var DEPOSIT_FOR = {
    CONSTRUCTION: 1,
    POPULATION: 2
};

function CreepCarrier(creep) {
    this.creep = creep;

}
CreepCarrier.prototype.init = function() {
    this.creep.memory.role = 'CreepCarrier';
    this.act();
};


CreepCarrier.prototype.act = function() {
    var energyUnderfoot = this.creep.pos.lookFor('energy');
    if (this.creep.carry.energy < this.creep.carryCapacity && energyUnderfoot.length > 0) {
        this.creep.pickup(energyUnderfoot[0]);
    }

    if (this.creep.carry.energy < 50) {
       this.creep.findEnergy();
    }else{
        this.creep.depositEnergy();
    }
};


module.exports = CreepCarrier;