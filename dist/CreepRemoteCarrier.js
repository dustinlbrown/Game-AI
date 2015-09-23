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
function CreepRemoteCarrier(creep){
    this.creep = creep;

}

CreepRemoteCarrier.prototype.init = function() {
    this.creep.memory.role = 'CreepRemoteCarrier';
    if (this.creep.getTargetRoom() === undefined){
        setTargetRoom(this.creep);
    }


    this.act();


};

CreepRemoteCarrier.prototype.act = function(){

    if(this.creep.carry.energy === this.creep.carryCapacity || this.creep.memory.action === ACTIONS.DEPOSIT){
        this.creep.memory.action = ACTIONS.DEPOSIT;
        this.creep.moveToHomeRoomIfSet();
        if (this.creep.room.name === this.creep.getHomeRoom() && this.creep.memory.action === ACTIONS.DEPOSIT){
            this.creep.depositEnergy();
        }
    }

    if (this.creep.carry.energy < 50 || this.creep.memory.action === ACTIONS.HARVEST){
        this.creep.memory.action = ACTIONS.HARVEST;
        this.creep.moveToTargetRoomIfSet();

        if(this.creep.room.name === this.creep.getTargetRoom()){
            this.creep.findEnergy();
        }
    }

};



//TODO clean this up so it'll work for multiple rooms
function setTargetRoom(creep){
    var miningFlags = _.filter(Game.flags, {color: COLOR_BLUE});
    console.log('Flags' + miningFlags.length);
    creep.setTargetRoom(miningFlags[0].pos.roomName);
}

module.exports = CreepRemoteCarrier;
