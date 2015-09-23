var profiler = require('profiler');
require('globalStructure');

// @TODO : Change this, doesn't scale

var ACTIONS = {
    WITHDRAW: 1,
    CONSTRUCTION: 2
};

var CONST = {
    RAMPART_MAX: 3000000,
    RAMPART_FIX: 1500000,
    WALL_FIX: 1,
    WALL_MAX: 1
};

var CreepBuilder = function (creep, depositManager) {
    this.creep = creep;
    this.depositManager = depositManager;
};

CreepBuilder.prototype.init = function () {


    this.creep.memory.role = 'CreepBuilder';

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

    //if(!this.remember('srcRoom')) {
    //    this.remember('srcRoom', this.creep.room.name);
    //}
    //
    //if(this.moveToNewRoom() == true) {
    //    return;
    //}

    //this.forceControllerUpgrade = this.remember('forceControllerUpgrade');


    this.act();

    //}
};

CreepBuilder.prototype.act = function () {


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
        if (!(repairStructures(this.creep) ||
            buildStructures(this.creep) ||
            reinforceWalls(this.creep)||
            upgradeController(this.creep) )) {
            console.log("Builder " + this.creep.name + " has nothing to do");
        }


    }
};

function repairStructures(creep) {
    // If a structure needs repair, find the one in most need of repair - this takes precedence
    if (creep.memory.repairSite === undefined) {

        var structuresNeedRepair = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function (i) {
                return (i.hits / i.hitsMax) < 0.75 && i.structureType !== STRUCTURE_ROAD && i.structureType !== STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART;
            }
        }).sort(function (a, b) {
            return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
        });


        if (structuresNeedRepair.length > 0) {
            // Jitter the site based on roleId, within the first 4 results
            var repSiteChoice = (creep.getRoleId() % 4) % structuresNeedRepair.length;

            creep.memory.repairSite = structuresNeedRepair[repSiteChoice].id;
        }
    }

    if (creep.memory.repairSite !== undefined) {
        var site = Game.getObjectById(creep.memory.repairSite);
        console.log('creepBuilder.site'+ site);
        // Wipe the assigned site when complete
        if (site == null || site.hits >= site.hitsMax) {
            console.log("wiping repair site for creep " + creep.name + " because null site " + site + " " + creep.memory.repairSite);
            delete creep.memory.repairSite;
            return repairStructures(creep); // Just finished. Recurse.
        }
        else {
            creep.moveTo(site);
            creep.repair(site);
           console.log(creep.name + " repairing " + site + " ("+site.hits+"/"+site.hitsMax+")");
            return true;
        }
    }
    return false;
}

function buildStructures(creep) {
    if (creep.memory.buildSite === undefined) {
        // Find the site that is the furthest built and focus on that
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES).sort(function (a, b) {
            return a.progress - b.progress;
        });
        if (sites.length > 0) {

            // Jitter the site based on roleId, within the first 3 results
            var siteChoice = (creep.getRoleId() % 3) % sites.length;
           // console.log(creep.getRoleId());
            // If there has not been any progress, pick the closest target and assign to this creep
            creep.memory.buildSite = sites[siteChoice].id;
        }
    }
    if (creep.memory.buildSite !== undefined) {
        var site = Game.getObjectById(creep.memory.buildSite);

        // Wipe the assigned site when complete
        if (site == null || site.progress >= site.progressTotal) {
            console.log("wiping build site for creep " + creep.name + " because null site " + site + " " + creep.memory.buildSite);
            delete creep.memory.buildSite;
            return buildStructures(creep); // Just finished. Recurse.
        }
        else {
            creep.moveTo(site);
            creep.build(site);
            //console.log(creep.name + " building " + site + " ("+site.progress+"/"+site.progressTotal+")");
            return true;
        }
    }
    return false;
}

function upgradeController(creep) {
    //if (creep.getRoleId() % 3 == 2) {
        // If there are no constructions, upgrade the controller
        var controller = creep.room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_CONTROLLER}
        });

        if (controller[0].level <= 7) {
            creep.moveTo(controller[0]);
            creep.upgradeController(controller[0]);
            return true;
        }
        else return false;
    //}
    return false;
}

function reinforceWalls(creep) {
    var spawn = creep.getNearestSpawn();
    if (spawn === undefined){
        console.log('reinforceWalls: spawn is undefined');
        return false;
    }

    var assignedWall = creep.getStructureAssignedToCreep('reinforce');
    // If no wall assigned, assign a wall

    if (typeof assignedWall === 'undefined') {
        // If there is nothing left to do, and the creep isn't designated to upgrade, build up walls
        var reinforce = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (s) {
                if (s.pos.x === 0 || s.pos.x === 49 || s.pos.y === 0 || s.pos.y === 49) return false; // Ignore starter walls
                return ( (s.structureType === STRUCTURE_RAMPART && (s.hits < Number(CONST.RAMPART_MAX)) ) || ( s.structureType === STRUCTURE_WALL && s.hits < Number(CONST.WALL_MAX)) && !s.structureIsAssigned('reinforce'));
                //return ( s.structureType == STRUCTURE_RAMPART && (s.hits < s.hitsMax - 25000) ) || ( s.structureType == STRUCTURE_WALL && s.hits < 975000);
            }
        });
        //console.log('reinforce '+reinforce);
        if (!reinforce) return false;
        //console.log(reinforce);
        creep.assignStructure('reinforce', reinforce);
        assignedWall = reinforce;
        //console.log("assigned " + creep.name + " to reinforce " + reinforce);
    }

    if (assignedWall !== undefined) {
        if (assignedWall === null) return false;
        //console.log(creep.name + " reinforcing " + assignedWall);
        if (creep.pos.getRangeTo(assignedWall) > 1) {
            creep.moveTo(assignedWall);
        }

        creep.repair(assignedWall);

        // If the structure is built up, deassign the builder
        if (
            (assignedWall.structureType === STRUCTURE_RAMPART && assignedWall.hits >= Number(CONST.RAMPART_MAX))
            ||
            (assignedWall.structureType === STRUCTURE_WALL && assignedWall.hits >= Number(CONST.WALL_MAX))
        ) {
            assignedWall.unassignStructure('reinforce');
            console.log("unassigned reinforce " + reinforce);
        }

        return true;
    }

    return false;
}

module.exports = CreepBuilder;