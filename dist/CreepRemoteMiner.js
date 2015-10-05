/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */

function CreepRemoteMiner(creep,resources, room){
    this.creep = creep;
    this.resourceManager = resources;
    this.room = room;
}

CreepRemoteMiner.prototype.init = function() {
    this.creep.memory.role = 'CreepRemoteMiner';
    if (this.creep.getTargetRoom() === undefined){
        setTargetRoom(this.creep, this.resourceManager);
    }

    if(!this.creep.memory.hasOwnProperty('targetSourceId') && this.creep.room.name === this.creep.getTargetRoom()){
        console.log(this.creep.name);
        this.creep.memory.targetSourceId = this.resourceManager.assignSourceOccupant(this.creep,this.creep.getTargetRoom()); //TODO is this the right place for this?
        console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.targetSourceId));
    }

    this.act();


};

CreepRemoteMiner.prototype.act = function(){
    if (this.creep.room.name !== this.creep.getTargetRoom()){
        this.creep.moveToTargetRoomIfSet();
        return;
    }

    this.creep.moveTo(Game.getObjectById(this.creep.memory.targetSourceId));
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSourceId));

};

//TODO clean this up so it'll work for multiple rooms
function setTargetRoom(creep, resourcemgr){

    var miningFlags = _.filter(Game.flags, {color: COLOR_BLUE});
    //for each flag
    var bestSourceCount = 99;
    var bestRoomCount = 99;
    var bestRoomName = undefined;
    for(var flag in miningFlags){
        var room = Game.rooms[miningFlags[flag].pos.roomName]; //get the room object

        if (room === undefined){ //if we don't have a presence in the room, it will be undefined (aka best room ever).
            bestRoomName = miningFlags[flag].pos.roomName;
            break;
        }

        var sources = resourcemgr.getRemoteSources(room);

        for (var i in sources){
            if(sources[i].CreepRemoteMinerId === undefined){
                //creep.setTargetRoom(room.roomname);
                bestSourceCount = 0;
                break;
            }else{
                //console.log(creep.getSourceOccupants(sources[i].id, room, 'CreepRemoteMiner'));
                var occupancy = creep.getSourceOccupants(sources[i].id, room, 'CreepRemoteMiner').length;
                //console.log(resourcemgr.getSourceOccupants(sources[i].id));
                if (occupancy < bestSourceCount){
                    bestSourceCount = occupancy;
                }
            }

        }
    //console.log(bestRoomName)
        if (bestSourceCount < bestRoomCount){
            bestRoomCount = bestSourceCount;
            bestRoomName = room.name;
            //console.log(bestSourceCount + bestRoomName);
        }
    }

    //find out how many sources
    //find out how many are occupied
    //find least occupied source.
    creep.setTargetRoom(bestRoomName);
}

function setTargetSource(){


}

module.exports = CreepRemoteMiner;
