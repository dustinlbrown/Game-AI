var ACTION = {
    GET_ENERGY : 1,
    CONSTRUCTION : 2
};

var CreepBuilder = function(creep, depositManager) {
    this.creep = creep;
    this.depositManager = depositManager;
};

CreepBuilder.prototype.init = function() {


    this.creep.memory.role = 'CreepBuilder';

    if(!this.creep.memory.action) {
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.action = ACTION.CONSTRUCTION
        } else {
            this.creep.memory.action = ACTION.GET_ENERGY;
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

    //if(this.randomMovement() == false) {
    this.act();
    //}
};

CreepBuilder.prototype.act = function() {
    if (this.creep.carry.energy === 0 || this.creep.memory.action == ACTION.GET_ENERGY ) {
        this.creep.memory.action = ACTION.GET_ENERGY;

        var linkDeposit = this.creep.pos.findInRange(FIND_MY_STRUCTURES,1, {filter: { structureType: STRUCTURE_LINK }});
        if(linkDeposit.length > 0 && linkDeposit[0].energy > 0){
            linkDeposit[0].transferEnergy(this.creep);
            if(this.creep.carry.energy == this.creep.carryCapacity){this.creep.memory.action = ACTION.CONSTRUCTION}
            return;
        }
        //TODO use the deposits!!!
        var extensions = this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_EXTENSION}
        });

        extensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });

        if (extensions.length) {
            var target = this.creep.pos.findClosest(extensions);

            if (target === null) {
                target = Game.flags.roadBlock;
                this.creep.moveTo(target);
            } else {
                this.creep.moveTo(target);
                target.transferEnergy(this.creep);
                if(this.creep.carry.energy == this.creep.carryCapacity){this.creep.memory.action = ACTION.CONSTRUCTION};
            }
        } else { //no extensions, use spawn
            var spawn = this.creep.room.find(FIND_MY_SPAWNS)[0];
            this.creep.moveTo(spawn);
            spawn.transferEnergy(this.creep);
            if(this.creep.carry.energy == this.creep.carryCapacity){this.creep.memory.action = ACTION.CONSTRUCTION};
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
                    return (structure.structureType == STRUCTURE_ROAD) && (structure.hits < (structure.hitsMax / 5))
                }
            });

            if (to) {
                (!this.creep.repair(to)) || this.creep.moveTo(to);
            } else {
                var controller = this.creep.room.controller;
                this.creep.moveTo(controller);
                this.creep.upgradeController(controller);
            }
        }

        var walls = this.creep.room.find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_WALL}
        });

        var filter = _.filter(walls, function (r) {
            return r.hits < 50000 && r.hitsMax != 1;
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

        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (r.hitsMax / 15);
        //    });
        //}

        //TODO@ Temp to get stuff done!
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (r.hitsMax / 10);
        //    });
        //}
        //
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (r.hitsMax / 5);
        //    });
        //}
        //
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (r.hitsMax / 2);
        //    });
        //}
        //
        //if (!filter.length) {
        //    filter = _.filter(sites, function (r) {
        //        return r.hits < (r.hitsMax * 0.9);
        //    });
        //}

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