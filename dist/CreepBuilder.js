/**
 * Created by Dustin on 8/26/2015.
 */
var CreepBuilder = function(creep, depositManager) {
    this.creep = creep;
    this.depositManager = depositManager;
};

CreepBuilder.prototype.init = function() {
    this.creep.memory.role = 'CreepBuilder';
    //if(!this.remember('srcRoom')) {
    //    this.remember('srcRoom', this.creep.room.name);
    //}
    //
    //if(this.moveToNewRoom() == true) {
    //    return;
    //}

    //this.forceControllerUpgrade = this.remember('forceControllerUpgrade');

    //if(this.randomMovement() == false) {
    this.act();
    //}
};

CreepBuilder.prototype.act = function() {
    if (this.creep.carry.energy === 0) {

        var linkDeposit = this.creep.pos.findInRange(FIND_MY_STRUCTURES,1, {filter: { structureType: STRUCTURE_LINK }});
        if(linkDeposit.length > 0 && linkDeposit[0].energy > 0){
            linkDeposit[0].transferEnergy(this.creep);
            return;
        }
        var extensions = this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_EXTENSION}
        });

        extensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });

        //console.log(extensions.length);
        if (extensions.length) {
            var target = this.creep.pos.findClosest(extensions);

            if (target === null) {
                target = Game.flags.roadBlock;
                this.creep.moveTo(target);
            } else {
                this.creep.moveTo(target);
                target.transferEnergy(this.creep);
            }


        } else {
            this.creep.moveTo(Game.flags.timeOut);
        }
    }
    // find target
    else {
        var target = this.creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
        if (target) {
            (!this.creep.build(target)) || this.creep.moveTo(target);
        }
        else {
            to = this.creep.pos.findClosest(FIND_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_ROAD) && (structure.hits < (structure.hitsMax / 2))
                }
            });

            if (to) {
                (!this.creep.repair(to)) || this.creep.moveTo(to);
            } else {
                var controller = Game.spawns.VileSpawn.room.controller;
                this.creep.moveTo(controller);
                this.creep.upgradeController(controller);
            }
        }

        var walls = this.creep.room.find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_WALL}
        });

        var filter = _.filter(walls, function (r) {
            return r.hits < 100000 && r.hitsMax != 1;
        });

        if (filter.length) {
            var target = this.creep.pos.findClosest(filter);

            this.creep.moveTo(target);
            var ok = this.creep.repair(target);

            if (ok === OK) {
                this.creep.memory.target = target.id;
            }

            return;
        }

        // repair ramparts
        var sites = this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_RAMPART}
        });

        var filter = _.filter(sites, function (r) {
            return r.hits < (r.hitsMax / 20);
        });

        if (!filter.length) {
            filter = _.filter(sites, function (r) {
                return r.hits < (r.hitsMax / 15);
            });
        }

        if (!filter.length) {
            filter = _.filter(sites, function (r) {
                return r.hits < (r.hitsMax / 10);
            });
        }

        if (!filter.length) {
            filter = _.filter(sites, function (r) {
                return r.hits < (r.hitsMax / 5);
            });
        }

        if (!filter.length) {
            filter = _.filter(sites, function (r) {
                return r.hits < (r.hitsMax / 2);
            });
        }

        if (!filter.length) {
            filter = _.filter(sites, function (r) {
                return r.hits < (r.hitsMax * 0.9);
            });
        }

        if (filter.length) {
            var target = this.creep.pos.findClosest(filter);

            this.creep.moveTo(target);
            var ok = this.creep.repair(target);

            if (ok === OK) {
                this.creep.memory.target = target.id;
            }

            return;
        }
    }
    ;
}
module.exports = CreepBuilder;