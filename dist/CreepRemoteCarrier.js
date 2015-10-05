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
function CreepRemoteCarrier(creep, resourceMgr){
    this.creep = creep;
    this.resourceMgr = resourceMgr

}

CreepRemoteCarrier.prototype.init = function() {
    this.creep.memory.role = 'CreepRemoteCarrier';
    //console.log(this.creep.getTargetRoom());
    if (this.creep.getTargetRoom() === undefined){
        setTargetRoom(this.creep, this.resourceMgr);
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
function setTargetRoom(creep, resourceMgr){
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

        var sources = resourceMgr.getRemoteSources(room);

        for (var i in sources){
            //console.log(sources[i].CreepRemoteMinerId);
            if(sources[i].CreepRemoteMinerId === undefined){ //no need to retrieve from here as we don't have a min
                //creep.setTargetRoom(room.roomname);
                continue;
            }else{

                var occupancy = creep.getSourceOccupants(sources[i].id, room, 'CreepRemoteMiner').length;
                ////console.log(sources[i].id);
                //console.log("occupancy  "+creep.getSourceOccupants(sources[i].id, room,'CreepRemoteMiner').length);
                if (occupancy < bestSourceCount){
                    //console.log("bestSourceCount " + bestSourceCount + " occupancy " + occupancy );
                    if (occupancy === undefined){
                        occupancy = 0;
                    }
                    bestSourceCount = occupancy;
                }
            }

        }

        if (bestSourceCount < bestRoomCount){
            bestRoomCount = bestSourceCount;
            bestRoomName = room.name;
            //console.log("Room " + room.name);
        }
    }

    //find out how many sources
    //find out how many are occupied
    //find least occupied source.
    creep.setTargetRoom(bestRoomName);
}

function setTargetSource(creep){
    var sources = creep.getSources();
    var bestSourceIndex = 0;
    var bestSourceOccupancy = 99;

    for (var i in sources){
        var sourceOccupants = creep.getSourceOccupants(sources[i].id);
        console.log('sourceOccupants.length: ' + sourceOccupants.length);
        if(sourceOccupants && sourceOccupants.length < bestSourceOccupancy){
            bestSourceIndex = i;
            bestSourceOccupancy = sourceOccupants.length;
        }
    }
    return creep.setSourceOccupant(sources[bestSourceIndex].id, creep);

}

module.exports = CreepRemoteCarrier;
