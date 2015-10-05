var CONSTS = {
    EMPTY_LEVEL: 0.5
};

function Deposits(room) {
    this.room = room;
    this.deposits = this.room.find(
        FIND_MY_STRUCTURES,
        {
            filter: filterExtensions
        }
    );

    this.spawns = [];
    for(var n in Game.spawns) {
        var s = Game.spawns[n];
        if(s.room == this.room) {
            this.spawns.push(s);
        }
    }
};

Deposits.prototype.energy = function() {
    var energy = 0;
    var resources = this.deposits;

    for(var i = 0; i < resources.length; i++) {
        var res = resources[i];
        energy += res.energy;
    }

    for(var i = 0; i < this.spawns.length; i++) {
        energy += this.spawns[i].energy;
    }

    return energy;

};

Deposits.prototype.energyCapacity = function() {
    var energyCapacity = 0;
    var resources = this.deposits;
    for(var i = 0; i < resources.length; i++) {
        var res = resources[i];
        energyCapacity += res.energyCapacity;
    }

    for(var i = 0; i < this.spawns.length; i++) {
        energyCapacity += this.spawns[i].energyCapacity;
    }

    return energyCapacity;

};

// PRIVATE
function filterExtensions(structure) {
    if(structure.structureType == STRUCTURE_EXTENSION) {
        return true;
    }

    return false;
}


module.exports = Deposits;
