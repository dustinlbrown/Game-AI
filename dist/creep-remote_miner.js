/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */

function CreepRemoteMiner(creep, room){
    this.creep = creep;
    this.room = room;
}

CreepRemoteMiner.prototype.init = function() {
    this.creep.memory.role = 'CreepRemoteMiner';
    if (this.creep.getTargetRoom() === undefined){
        this.creep.assignFlag();
    }

    if(!this.creep.memory.hasOwnProperty('targetSource') && this.creep.room.name === this.creep.getTargetRoom()){
        this.creep.memory.targetSource = Game.getObjectById(this.creep.memory.targetFlag).sourceId(); //TODO is this the right place for this?
    }

    this.act();


};

CreepRemoteMiner.prototype.act = function(){
    if (this.creep.room.name !== this.creep.getTargetRoom()){
        this.creep.moveToTargetRoomIfSet({reusePath:20});
        return;
    }

    this.creep.moveMeTo(Game.getObjectById(this.creep.memory.targetSource));
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSource));

};

module.exports = CreepRemoteMiner;
