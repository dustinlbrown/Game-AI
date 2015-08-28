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
}

function CreepCarrier(creep) {
    this.creep = creep;

};

CreepCarrier.prototype.init = function() {
    this.creep.memory.role = 'CreepCarrier';
    this.act();
};


CreepCarrier.prototype.act = function() {
    var creep = this.creep;
    var energy = creep.room.find(FIND_DROPPED_ENERGY);
    // collect
    if (creep.carry.energy < (creep.carryCapacity / 2) && energy.length) {
        creep.moveTo(energy[0]);
        creep.pickup(energy[0]);
        return;
    }


    // feed spawns
    var spawns = _.filter(Game.spawns, function (r) {
        return r.energy < r.energyCapacity;
    });


    if (spawns.length) {
        var target = creep.pos.findClosest(spawns);

        creep.moveTo(target);
        creep.transferEnergy(target);
        return;
    }

    //feed extensions
    var extensions = creep.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });

    extensions = _.filter(extensions, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (extensions.length){
        var target = creep.pos.findClosest(extensions);

        creep.moveTo(target);
        creep.transferEnergy(target);
        return;
    }

    var links = creep.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_LINK }
    });

    links = _.filter(links, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (links.length){
        var target = creep.pos.findClosest(links);

        creep.moveTo(target);
        creep.transferEnergy(target);
        return;
    }

    //feed storage
    var storage = creep.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    });

    storage = _.filter(storage, function (r) {
        return r.store.energy < r.storeCapacity;
    });

    if (storage.length){
        var target = creep.pos.findClosest(storage);

        creep.moveTo(target);
        creep.transferEnergy(target);
        return;
    }


    return;
};


module.exports = CreepCarrier;