var profiler = require('profiler');

var ACTIONS = {
    WITHDRAW : 1,
    CONSTRUCTION : 2
};

var CONST = {
    RAMPART_MAX: 1000000,
    RAMPART_FIX: 50000,
};

var CreepBuilder = function(creep, depositManager) {
    this.creep = creep;
    this.depositManager = depositManager;
};

CreepBuilder.prototype.init = function() {


    this.creep.memory.role = 'CreepBuilder';

    if(!this.creep.memory.action) {
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.action = ACTIONS.CONSTRUCTION
        } else {
            this.creep.memory.action = ACTIONS.WITHDRAW;
        }
    }

    if(!this.creep.memory.server){
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

CreepBuilder.prototype.act = function() {


    if(this.creep.carry.energy === 0){
        this.creep.memory.action = ACTIONS.WITHDRAW;
    }else if (this.creep.carry.energy == this.creep.carryCapacity){
        this.creep.memory.action = ACTIONS.DELIVER;
    }


    if (this.creep.carry.energy === 0 ||
        this.creep.memory.action == ACTIONS.WITHDRAW) {
        this.creep.memory.action = ACTIONS.WITHDRAW;

        this.creep.withdrawEnergy();

    }
    // find target
    else{
        this.creep.memory.action = ACTIONS.CONSTRUCTION;
        if (!(repairStructures(creep) ||
            buildStructures(creep) ||
            upgradeController(creep) ||
            reinforceWalls(creep) )) {
            console.log("Builder " + creep.name + " has nothing to do");
        }


        //TODO THis needs to be wayyyy more efficient

        //var target = this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        //if (target) {
        //    (!this.creep.build(target)) || this.creep.moveTo(target);
        //}
        //else {
        //    var to = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
        //        filter: function (structure) {
        //            return (structure.structureType == STRUCTURE_ROAD) && (structure.hits < (structure.hitsMax / 5))
        //        }
        //    });
        //
        //    if (to) {
        //        (!this.creep.repair(to)) || this.creep.moveTo(to);
        //    } else {
        //        var controller = this.creep.room.controller;
        //        this.creep.moveTo(controller);
        //        this.creep.upgradeController(controller);
        //    }
        //}
        //
        //var walls = this.creep.room.find(FIND_STRUCTURES, {
        //    filter: {structureType: STRUCTURE_WALL}
        //});
        //
        //var filter = _.filter(walls, function (r) {
        //    return r.hits < 50000 && r.hitsMax != 1;
        //});
        //
        //if (filter.length) {
        //    var target = this.creep.pos.findClosestByRange(filter);
        //
        //    this.creep.moveTo(target);
        //    var ok = this.creep.repair(target);
        //
        //    if (ok === OK) {
        //        this.creep.memory.target = target.id;
        //    }
        //
        //    return;
        //}
        //
        ////repair ramparts
        //var sites = this.creep.room.find(FIND_MY_STRUCTURES, {
        //    filter: {structureType: STRUCTURE_RAMPART}
        //});
        //
        //var filter = _.filter(sites, function (r) {
        //    return r.hits < CONST.RAMPART_MAX;
        //});
        //
        //
        ////TODO@ Temp to get stuff done!
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (CONST.RAMPART_MAX / 10);
        //    });
        //}
        //
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (CONST.RAMPART_MAX / 5);
        //    });
        //}
        //
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (CONST.RAMPART_MAX / 2);
        //    });
        //}
        //
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (CONST.RAMPART_MAX * 0.9);
        //    });
        //}
        //
        //if (filter.length) {
        //    var target = this.creep.pos.findClosestByPath(filter);
        //
        //    this.creep.moveTo(target);
        //    var ok = this.creep.repair(target);
        //
        //    if (ok === OK) {
        //        this.creep.memory.target = target.id;
        //    }
        //
        //    return;
        //}
    }
    ;
}

function repairStructures(creep){
    // If a structure needs repair, find the one in most need of repair - this takes precedence
    if (creep.memory.repairSite == undefined) {

        var structuresNeedRepair = creep.room.find(FIND_STRUCTURES, {
            filter: function(i) {
                return (i.hits / i.hitsMax) < 0.75 && i.structureType != STRUCTURE_ROAD && i.structureType != STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART;
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
            console.log("wiping repair site for creep " + creep.name + " because null site "+ site + " "+creep.memory.repairSite);
            creep.memory.repairSite = undefined;
            return repairStructures(creep); // Just finished. Recurse.
        }
        else {
            creep.moveTo(site);
            creep.repair(site);
            //console.log(creep.name + " repairing " + site + " ("+site.hits+"/"+site.hitsMax+")");
            return true;
        }
    }
    return false;
}

function buildStructures(creep)
{
    if (creep.memory.buildSite == undefined) {
        // Find the site that is the furthest built and focus on that
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES).sort(function (a, b) {
            return a.progress - b.progress;
        });
        if (sites.length > 0) {

            // Jitter the site based on roleId, within the first 3 results
            var siteChoice = (creep.memory.roleId % 3) % sites.length;

            // If there has not been any progress, pick the closest target and assign to this creep
            creep.memory.buildSite = sites[siteChoice].id;
        }
    }
    if (creep.memory.buildSite != undefined) {
        var site = Game.getObjectById(creep.memory.buildSite);

        // Wipe the assigned site when complete
        if (site == null || site.progress >= site.progressTotal) {
            console.log("wiping build site for creep " + creep.name + " because null site "+ site + " "+creep.memory.buildSite);
            creep.memory.buildSite = undefined;
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

function upgradeController(creep)
{
    if (creep.memory.roleId%3 == 2) {
        // If there are no constructions, upgrade the controller
        var controller = creep.room.find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_CONTROLLER}
        });
        if (controller[0].level < 3) {
            creep.moveTo(controller[0]);
            creep.upgradeController(controller[0]);
            return true;
        }
        else return false;
    }
    return false;
}

function reinforceWalls(creep)
{
    var spawn = creep.getNearestSpawn();
    if (spawn == undefined) return false;

    var assignedWall = creep.getStructureAssignedToCreep('reinforce');

    // If no wall assigned, assign a wall
    if (assignedWall == undefined) {
        // If there is nothing left to do, and the creep isn't designated to upgrade, build up walls
        var reinforce = spawn.pos.findClosest(FIND_STRUCTURES, {
            filter: function (s) {
                if (s.pos.x == 0 || s.pos.x == 49 || s.pos.y == 0 || s.pos.y == 49) return false; // Ignore starter walls
                return ( (s.structureType == STRUCTURE_RAMPART && (s.hits < rampartHits) ) || ( s.structureType == STRUCTURE_WALL && s.hits < wallHits) && !s.structureIsAssigned('reinforce'));
                //return ( s.structureType == STRUCTURE_RAMPART && (s.hits < s.hitsMax - 25000) ) || ( s.structureType == STRUCTURE_WALL && s.hits < 975000);
            }
        });
        if (reinforce == undefined) return false;
        creep.assignStructure('reinforce', reinforce);
        assignedWall = reinforce;
        console.log("assigned " + creep.name + " to reinforce " + reinforce);
    }

    if (assignedWall != undefined) {
        //console.log(creep.name + " reinforcing " + assignedWall);
        if (creep.pos.getRangeTo(assignedWall) > 1)
            creep.moveTo(assignedWall);
        creep.repair(assignedWall);

        // If the structure is built up, deassign the builder
        if
        (
            (assignedWall.structureType == STRUCTURE_RAMPART && assignedWall.hits >= 20000000)
            ||
            (assignedWall.structureType == STRUCTURE_WALL && assignedWall.hits >= wallHits)
        ) {
            assignedWall.unassignStructure('reinforce');
            console.log("unassigned reinforce " + reinforce);
        }

        return true;
    }

    return false;
}

module.exports = CreepBuilder;