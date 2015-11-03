/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */
var ACTIONS = {
    HARVEST: 1,
    DEPOSIT: 2
};
var DEPOSIT_FOR = {
    CONSTRUCTION: 1,
    POPULATION: 2
};
function CreepRemoteCarrier(creep) {
    this.creep = creep;
}

CreepRemoteCarrier.prototype.init = function () {
    this.creep.memory.role = 'CreepRemoteCarrier';
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

CreepRemoteCarrier.prototype.act = function () {
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
                    return;
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
                this.creep.moveMeTo(this.creep.getNearestSpawn());
            }
            //this.creep.findEnergy();
        }
    }

};

//
////TODO clean this up so it'll work for multiple rooms
//function setTargetRoom(creep) {
//    var miningFlags = creep.getSourceFlags();
//    //for each flag
//    var bestRoomEnergy = 0;
//    var bestRoomName = undefined;
//    for (var flag in miningFlags) {
//        var room = Game.rooms[miningFlags[flag].pos.roomName]; //get the room object
//        //console.log(room);
//        if (room === undefined) { //if we don't have a presence in the room, it will be undefined (aka best room ever).
//            continue;
//        }
//
//        var energy = creep.findEnergy(false, room);
//        if(energy !== undefined){
//
//
//            if (energy.energy > bestRoomEnergy) {
//                bestRoomEnergy = energy.energy;
//                bestRoomName = room.name;
//                //console.log("Room " + room.name);
//            }
//            //console.log("energy: " + energy);
//        }
//    }
//
//    //find out how many sources
//    //find out how many are occupied
//    //find least occupied source.
//    creep.setTargetRoom(bestRoomName);
//}
module.exports = CreepRemoteCarrier;
