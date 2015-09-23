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


};

CreepRemoteHarvester.prototype.act = function(){
    if (this.creep.room.name !== this.creep.getTargetRoom()){
        this.creep.moveToTargetRoomIfSet();
        return;
    }

    this.creep.moveTo(Game.getObjectById(this.creep.memory.targetSourceId));
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSourceId));

};

//TODO clean this up so it'll work for multiple rooms
function setTargetRoom(creep){
    var miningFlags = _.filter(Game.flags, {color: COLOR_BLUE});
    //for each flag
    for(var flag in miningFlags){
        var room = Game.rooms[miningFlags[flag].pos.roomName]; //get the room object
        var sources = this.resourceManager.getRemoteSources(room);
        for (var i in sources){
            if(sources[i].occupantIds === undefined){
                creep.setTargetRoom(room.roomname);
                break;
            }else{
                this.resourceManager.assignSourceOccupant(creep, room);
            }

        }
    }

    //find out how many sources
    //find out how many are occupied
    //find least occupied source.
    creep.setTargetRoom(miningFlags[0].pos.roomName);
}

module.exports = CreepRemoteHarvester;
