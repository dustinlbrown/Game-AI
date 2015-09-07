/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */

function CreepRemoteHarvester(creep,resources){
    this.creep = creep;
    this.resourceManager = resources;


}

CreepRemoteHarvester.prototype.init = function() {
    this.creep.memory.role = 'CreepRemoteHarvester';
    if (this.creep.getTargetRoom() === undefined){
        setTargetRoom(this.creep);
    }

    if(!this.creep.memory.hasOwnProperty('targetSourceId') && this.creep.room.name === this.creep.getTargetRoom()){
        this.creep.memory.targetSourceId = this.resourceManager.assignSourceOccupant(this.creep);
        console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.targetSourceId));
    }

    this.act();


}

CreepRemoteHarvester.prototype.act = function(){
    if (this.creep.room.name !== this.creep.getTargetRoom()){
        this.creep.moveToTargetRoomIfSet();
        return;
    }

    this.creep.moveTo(Game.getObjectById(this.creep.memory.targetSourceId));
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSourceId));

}

//TODO clean this up so it'll work for multiple rooms
function setTargetRoom(creep){
    var miningFlags = _.filter(Game.flags, {color: COLOR_BLUE});
    console.log('Flags' + miningFlags.length);
    creep.setTargetRoom(miningFlags[0].pos.roomName);
}

module.exports = CreepRemoteHarvester;
