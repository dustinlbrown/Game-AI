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
function CreepRemoteCarrier(creep, resourceMgr) {
    this.creep = creep;
    this.resourceMgr = resourceMgr

}

CreepRemoteCarrier.prototype.init = function () {
    this.creep.memory.role = 'CreepRemoteCarrier';
    //console.log(this.creep.getTargetRoom());


//TODO Write some code to find the closest exit, and store it in memory!

    this.act();


};

CreepRemoteCarrier.prototype.act = function () {

    if (this.creep.carry.energy === this.creep.carryCapacity || this.creep.memory.action === ACTIONS.DEPOSIT) {
        this.creep.memory.action = ACTIONS.DEPOSIT;
        this.creep.setTargetRoom(undefined); //set it to undefined so it picks a new one!
        this.creep.moveToHomeRoomIfSet();
        if (this.creep.room.name === this.creep.getHomeRoom() && this.creep.memory.action === ACTIONS.DEPOSIT) {
            this.creep.depositEnergy();
        }
    }

    if (this.creep.carry.energy < 50 || this.creep.memory.action === ACTIONS.HARVEST) {
        this.creep.memory.action = ACTIONS.HARVEST;
        if (this.creep.getTargetRoom() === undefined) {
            setTargetRoom(this.creep, this.resourceMgr);
        }
        this.creep.moveToTargetRoomIfSet();

        if (this.creep.room.name === this.creep.getTargetRoom()) {
            this.creep.findEnergy();
        }
    }

};


//TODO clean this up so it'll work for multiple rooms
function setTargetRoom(creep, resourceMgr) {
    var miningFlags = creep.getRemoteMiningFlags();
    //for each flag
    var bestRoomEnergy = 0;
    var bestRoomName = undefined;
    for (var flag in miningFlags) {
        var room = Game.rooms[miningFlags[flag].pos.roomName]; //get the room object
        //console.log(room);
        if (room === undefined) { //if we don't have a presence in the room, it will be undefined (aka best room ever).
            continue;
        }


        var energy = creep.findEnergy(false, room).energy;
        if (energy > bestRoomEnergy) {
            bestRoomEnergy = energy;
            bestRoomName = room.name;
            //console.log("Room " + room.name);
        }
    }

    //find out how many sources
    //find out how many are occupied
    //find least occupied source.
    creep.setTargetRoom(bestRoomName);
}
module.exports = CreepRemoteCarrier;
