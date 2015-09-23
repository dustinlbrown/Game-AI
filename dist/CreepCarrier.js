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

};

CreepCarrier.prototype.init = function() {
    this.creep.memory.role = 'CreepCarrier';
    this.act();
};


CreepCarrier.prototype.act = function() {
    var target = this.getTargetStructure();
    if (target !== null) {
        if (this.creep.carry.energy < 50) {
            var isTargetStorage = false;
            if(target.structureType == STRUCTURE_STORAGE){
                isTargetStorage = true;
            }
            this.findEnergy(isTargetStorage);
        }else{
            this.creep.moveTo(target);
            this.creep.transferEnergy(target);
        }
    }
};

CreepCarrier.prototype.findEnergy = function(isTargetStorage){

        var energy = this.creep.room.find(FIND_DROPPED_ENERGY);
        // collect

        if (energy) {
            energy.sort(function (a, b) {
                return b.energy - a.energy
            });

            //Check if the first 3 energy objects are close (within 8)
            var targetEnergyIndex = false;
            for (var i = 0; i < 2; i++) {
                if (!energy[i]){continue};
                if (this.creep.pos.inRangeTo(energy[i], 8)) {
                    targetEnergyIndex = i;
                    break;
                }
            }

            if (targetEnergyIndex !== false) {
                this.creep.moveTo(energy[targetEnergyIndex]);
                this.creep.pickup(energy[targetEnergyIndex]);
                return;
            }

            //var closestEnergy = this.creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            this.creep.moveTo(energy[0]);
            this.creep.pickup(energy[0]);

        } else{
            isTargetStorage = isTargetStorage || false;
            if(isTargetStorage === false){
                var target = this.creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
                if (target.length && target[0].store.energy > 0){
                    this.creep.moveTo(target[0]);
                    target[0].transferEnergy(this.creep);
                }else{
                    //Storage has not yet  been built, or is empty.
                }
            }else{
                console.log(this.creep.name + ': Target is storage');
            }
        }
    //}
};


CreepCarrier.prototype.getTargetStructure = function() {
    var target;

    //@TODO OPTIMIZATION: Find all structures, then filter the results for optimization
    //Check Spawn Energy
    var spawns = _.filter(Game.spawns, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (spawns.length) {
        target = this.creep.pos.findClosestByRange(spawns);
        return target;
    }

    //Check Extension Energy
    var extensions = this.creep.room.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_EXTENSION}
    });

    extensions = _.filter(extensions, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (extensions.length) {
        target = this.creep.pos.findClosestByPath(extensions);
        return target;
    }

    //Check Link Energy
    var links = this.creep.room.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_LINK}
    });

    links = _.filter(links, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (links.length) {
        target = this.creep.pos.findClosestByPath(links);
        return target;
    }

    //Check Storage Energy
    var storage = this.creep.room.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_STORAGE}
    });

    if (storage.length) {

        storage = _.filter(storage, function (r) {
            return r.store.energy < r.storeCapacity;
        });
    }

    if (storage.length){
        target = storage[0];

        return target;
    }

    return null;

};


module.exports = CreepCarrier;