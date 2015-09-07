var ACTIONS = {
    WITHDRAW: 1,
    DELIVER: 2
};

var CreepCourier = function(creep) {
    this.creep = creep;
};

CreepCourier.prototype.init = function() {

    this.creep.setRole('CreepCourier');


    if(typeof this.creep.memory.action === 'undefined') {
        this.creep.memory.action = ACTIONS.WITHDRAW;
        if (this.creep.carry.energy >= (this.creep.carryCapacity *.75) ) {
            this.creep.memory.action = ACTIONS.DELIVER;
        } else {
            this.creep.memory.action = ACTIONS.WITHDRAW;
        }
    }


    this.act();
};

CreepCourier.prototype.act = function() {
    if(this.creep.carry.energy === 0){
        this.creep.memory.action = ACTIONS.WITHDRAW;
    }else if (this.creep.carry.energy == this.creep.carryCapacity){
        this.creep.memory.action = ACTIONS.DELIVER;
    }
    //TODO add some roles so it uses all its energy before it gets more


    if(this.creep.memory.action == ACTIONS.WITHDRAW) this.retrieveEnergy();
    if(this.creep.memory.action == ACTIONS.DELIVER) this.deliverEnergy();
}

CreepCourier.prototype.retrieveEnergy = function(){

    this.creep.withdrawEnergy();

    //
    //if (this.creep.carry.energy == this.creep.carryCapacity){
    //    return false;
    //}
    //
    //var extension = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES,  {
    //    filter: function(object) {
    //        if (object.structureType == STRUCTURE_EXTENSION) {
    //            if (object.energy == object.energyCapacity) {
    //                return true;
    //            }
    //        }
    //        return false;
    //    }
    //});
    //
    //if(extension){
    //    this.collectEnergy(extension);
    //    if(this.creep.carry.energy >= this.creep.carryCapacity*.9 ) {
    //        this.creep.memory.action = ACTIONS.DELIVER;
    //    }
    //    return true;
    //}
    //
    //var spawn = this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    //    filter: function(object){
    //        if(object.structureType == STRUCTURE_SPAWN) {
    //            if (object.energy == object.energyCapacity ) {
    //                return true;
    //            }
    //        }
    //    }
    //})
    //
    //if(spawn){
    //    this.collectEnergy(spawn);
    //    if(this.creep.carry.energy >= this.creep.carryCapacity*.5 ) {
    //        this.creep.memory.action = ACTIONS.DELIVER;
    //    }
    //    return true;
    //}


}


CreepCourier.prototype.deliverEnergy = function(){

    var creep = this.creep;
    var builder = this.creep.room.find(FIND_MY_CREEPS,  {
        filter: function(object) {
            if (object.memory.server == creep.id) {
                return true;
            }
        }
    });

    if (builder.length == 0) {
        builder = this.findExistingBuilder(this.creep);
    }
    if (builder.length > 0) {
        var myBuilder = builder[0];
        myBuilder.memory.server = this.creep.id;
        this.creep.moveTo(myBuilder);
        if (this.creep.transferEnergy(myBuilder) == 0) {
            myBuilder.memory.server = null;
        }

    }


}

//handles creep behaviour for retrieving energy
CreepCourier.prototype.collectEnergy = function(target) {
    this.creep.moveTo(target);
    target.transferEnergy(this.creep);
}

CreepCourier.prototype.findExistingBuilder = function() {
    var builder = this.creep.room.find(FIND_MY_CREEPS, {
        filter: function (object) {

            if (object.carry.energy == object.carryCapacity) {
                object.memory.server == null;
                return false;
            }
            if (object.getRole() == 'CreepBuilder' && object.carry.energy < object.carryCapacity && object.memory.server == null) {
                return true;
            }
        }
    });
    return builder;
}

module.exports = CreepCourier;

