// Wander around maintaining roads.

var profiler = require('util-profiler');
require('proto-structure');

var ACTIONS = {
    WITHDRAW: 1,
    CONSTRUCTION: 2
};


var CreepRoadMaintainer = function (creep) {
    this.creep = creep;
};

CreepRoadMaintainer.prototype.init = function () {


    this.creep.memory.role = 'CreepRoadMaintainer';

    if (!this.creep.memory.action) {
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.action = ACTIONS.CONSTRUCTION
        } else {
            this.creep.memory.action = ACTIONS.WITHDRAW;
        }
    }

    if (!this.creep.memory.server) {
        this.creep.memory.server = null;
    }
    this.act();

};

CreepRoadMaintainer.prototype.act = function () {
    var energyUnderfoot = this.creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
    if (this.creep.carry.energy < this.creep.carryCapacity && energyUnderfoot.length > 0) {
        this.creep.pickup(energyUnderfoot[0]);
    }

    if (this.creep.carry.energy === 0) {
        this.creep.memory.action = ACTIONS.WITHDRAW;
    } else if (this.creep.carry.energy === this.creep.carryCapacity) {
        this.creep.memory.action = ACTIONS.CONSTRUCTION;
    }


    if (this.creep.carry.energy === 0 || this.creep.memory.action === ACTIONS.WITHDRAW) {
        this.creep.memory.action = ACTIONS.WITHDRAW;

        this.creep.withdrawEnergy();

    }
    // find target
    else {
        this.creep.memory.action = ACTIONS.CONSTRUCTION;
        repairRoads(this.creep);


    }
};
var repairRoads = function (creep) {


    // If there's energy underfoot, grab it
    var energyUnderfoot = creep.pos.findInRange(FIND_DROPPED_ENERGY, 0);
    if (creep.carry.energy < creep.carryCapacity && energyUnderfoot.length > 0) {
        creep.pickup(energyUnderfoot[0]);
    }

    // If the creep is out of energy, go get more
    if (creep.carry.energy == 0) {
        var storage = creep.getNearestStorage();
        // Source will be spawn in the early game, storage in the later game
        var source = creep.getSpawn();
        var sourceEnergy = source.energy;
        if (storage != undefined) {
            source = storage;
            sourceEnergy = source.store.energy;
        }

        creep.moveTo(source);

        if (sourceEnergy > creep.carryCapacity) {
            source.transferEnergy(creep, creep.carryCapacity);
        }
    } else {

        if (creep.memory.repairSite == undefined) {

            var structuresNeedRepair = creep.room.find(FIND_STRUCTURES, {
                filter: function (i) {
                    return (i.hits / i.hitsMax) < 0.99 && i.structureType == STRUCTURE_ROAD;
                }
            }).sort(function (a, b) {
                return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
            });


            if (structuresNeedRepair.length > 0) {
                // Jitter the site based on roleId, within the first 4 results
                var repSiteChoice = (creep.memory.roleId % 4) % structuresNeedRepair.length;

                creep.memory.repairSite = structuresNeedRepair[repSiteChoice].id;
            }
        }

        if (creep.memory.repairSite != undefined) {
            var site = Game.getObjectById(creep.memory.repairSite);

            // Wipe the assigned site when complete
            if (site == null || site.hits >= site.hitsMax) {
                //console.log("wiping road site for creep " + creep.name + " because null site "+ site + " "+creep.memory.repairSite);
                creep.memory.repairSite = undefined;
            }
            else {
                creep.moveTo(site);
                creep.repair(site);
                //console.log(creep.name + " maintaining road "+site);
            }
        } //else console.log("Road maintainer is bored");

        // Repair roads underfoot as we pass
        var underfoot = creep.pos.findInRange(FIND_STRUCTURES, 0, {
            filter: function (i) {
                return (i.hits < i.hitsMax) && i.structureType == STRUCTURE_ROAD;
            }
        });
        if (underfoot.length > 0) creep.repair(underfoot[0]);
    }
};


module.exports = CreepRoadMaintainer;