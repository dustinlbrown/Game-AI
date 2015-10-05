/**
 * Created by Dustin on 8/25/2015.
 */
function Resources(room, population) {
    this.room = room;
    this.populationManager = population;
}

//Resources.prototype.getAvailableSources = function() {
//    // Some kind of unit counter per resource (with Population)
//    var srcs = this.getSources();
//    var srcIndex = Math.floor(Math.random()*srcs.length);
//
//    return srcs[srcIndex];
//};

//Resources.prototype.isControllerSource = function(room, source) {
//    var closestSource = this.room.controller.pos.findClosest(this.getSources());
//    if (closestSource == source){
//        return true;
//    }
//    return false;
//
//}

//Resources.prototype.transferToControllerLink = function (link) {
//   this.link = link;
//    var controllerLink = this.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, {
//        filter: {structureType: STRUCTURE_LINK}
//    });

//if (controllerLink.id != this.link.id && controllerLink.energy < controllerLink.energyCapacity) {
//   this.link.transferEnergy(Game.getObjectById(controllerLink.id));
//}

//};

//Resources.prototype.occupantsByRole = function(source, role){
//    var occupants = source.pos.findInRange(FIND_MY_CREEPS, 1);
//    //var occupants = source.pos.findInRange(FIND_MY_CREEPS, 3, { filter: { memory: {role: role}} });
//
//    return occupants.length;
//
//}

Resources.prototype.assignSourceOccupant = function(creep, room){
    if (typeof room === 'undefined'){
        room = this.room;
    }else{
        room = Game.rooms[room]; //@TODO when we pass in the room, its actually the roomName (TODO clean that up)
    }
    //console.log(room);
    var sources = this.getSources(room);
    var bestSourceIndex = 0;
    var bestSourceOccupancy = 99;


    if (sources.length > 0){
        for (var i in sources){
            var sourceOccupants = creep.getSourceOccupants(sources[i].id);
            console.log('sourceOccupants.length: ' + sourceOccupants.length);
            if(sourceOccupants && sourceOccupants.length < bestSourceOccupancy){
                bestSourceIndex = i;
                bestSourceOccupancy = sourceOccupants.length;
            }
        }
        return creep.setSourceOccupant(sources[bestSourceIndex].id, creep)
    }else{
        return ERR_NOT_FOUND;
    }
};

Resources.prototype.getSources = function(room) {
    if (typeof room === 'undefined'){
        room = this.room;
        //console.log('getSources: room ' + room);
    }

    if(!room.memory.sources){
        room.memory.sources = [];
        var roomSources = room.find(FIND_SOURCES);
        for(var i in roomSources){
            room.memory.sources.push(roomSources[i])
        }

    }

    return room.memory.sources;
};

Resources.prototype.getRemoteSources = function(room){

    if(!room.memory.sources){
        room.memory.sources = [];
        var roomSources = room.find(FIND_SOURCES);
        for(var i in roomSources){
            room.memory.sources.push(roomSources[i])
        }
    }

    return room.memory.sources;
};

module.exports = Resources;
