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

    //console.log(this.creep.getTargetRoom());
    if (this.creep.getTargetRoom() === undefined){
        this.creep.assignFlag();
    }

    if(!this.creep.memory.hasOwnProperty('targetSource') && this.creep.room.name === this.creep.getTargetRoom()){
        this.creep.memory.targetSource = Game.getObjectById(this.creep.memory.targetFlag).sourceId(); //TODO is this the right place for this?
    }

//TODO Write some code to find the closest exit, and store it in memory!

    this.act();


};


CreepCarrier.prototype.act = function() {
    var energyUnderfoot = this.creep.pos.lookFor('energy');
    if (this.creep.carry.energy < this.creep.carryCapacity && energyUnderfoot.length > 0) {
        this.creep.pickup(energyUnderfoot[0]);
    }

    if (this.creep.carry.energy === this.creep.carryCapacity || this.creep.memory.action === ACTIONS.DEPOSIT) {
        this.creep.memory.action = ACTIONS.DEPOSIT;
        //this.creep.setTargetRoom(undefined); //set it to undefined so it picks a new one!
        this.creep.moveToHomeRoomIfSet({reusePath:20});
        if (this.creep.room.name === this.creep.getHomeRoom() && this.creep.memory.action === ACTIONS.DEPOSIT) {
            this.creep.depositEnergy();
        }
    }

    if (this.creep.carry.energy < 50 || this.creep.memory.action === ACTIONS.HARVEST) {
        this.creep.memory.action = ACTIONS.HARVEST;
        //if (this.creep.getTargetRoom() === undefined) {
        //    setTargetRoom(this.creep);
        //}
        this.creep.moveToTargetRoomIfSet({reusePath:20});

        if (this.creep.room.name === this.creep.getTargetRoom()) {
            var targetSource =  Game.getObjectById(this.creep.memory.targetSource);
            var targetFlag = Game.getObjectById(this.creep.memory.targetFlag);
            if (targetSource){
                if(!this.creep.pos.inRangeTo(targetSource,2)){
                    if(targetFlag){
                        var remoteMiners = targetFlag.creepIdsByRole('CreepRemoteMiner');
                        if (remoteMiners.length){
                            this.creep.moveMeTo(Game.getObjectById(remoteMiners[0]),{reusePath:20});
                            return;
                        }else{
                            remoteMiners = targetFlag.creepIdsByRole('CreepMiner');
                            if(remoteMiners.length){
                                this.creep.moveMeTo(Game.getObjectById(remoteMiners[0]),{reusePath:20});
                                return;
                            }
                        }
                    }
                    this.creep.moveMeTo(targetSource,{reusePath:20});
                    //return;
                }
            }

            var energy = targetFlag.pos.findInRange(FIND_DROPPED_ENERGY,1);
            if(energy.length){
                if(!this.creep.pos.isNearTo(energy[0])){
                    this.creep.moveTo(energy[0]);
                }
                this.creep.pickup(energy[0]);
            }

            if(this.creep.pos.isNearTo(targetSource)){
                this.creep.moveTo(this.creep.room.controller);
            }
            //this.creep.findEnergy();
        }
    }

};


module.exports = CreepCarrier;