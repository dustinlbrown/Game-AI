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

Resources.prototype.transferToControllerLink = function (link) {
    this.link = link;
    var controllerLink = this.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_LINK}
    });

    if (controllerLink.id != this.link.id && controllerLink.energy < controllerLink.energyCapacity) {
        this.link.transferEnergy(Game.getObjectById(controllerLink.id));
    }

}

//Resources.prototype.occupantsByRole = function(source, role){
//    var occupants = source.pos.findInRange(FIND_MY_CREEPS, 1);
//    //var occupants = source.pos.findInRange(FIND_MY_CREEPS, 3, { filter: { memory: {role: role}} });
//
//    return occupants.length;
//
//}

Resources.prototype.assignSourceOccupant = function(creep){
    var sources = this.getSources();
    var bestSourceIndex = 0;
    var bestSourceOccupancy = 99;


    if (sources.length > 0){
        for (var i in sources){
            var sourceOccupants = this.getSourceOccupants(sources[i].id);
            console.log('sourceOccupants.length: ' + sourceOccupants.length);
            if(sourceOccupants && sourceOccupants.length < bestSourceOccupancy){
                bestSourceIndex = i;
                bestSourceOccupancy = sourceOccupants.length;
            }
        }
        return this.setSourceOccupant(sources[bestSourceIndex].id, creep)
    }else{
        return ERR_NOT_FOUND;
    }
}

Resources.prototype.getSources = function() {
    if(!this.room.memory.sources){
        this.room.memory.sources = [];
        var roomSources = this.room.find(FIND_SOURCES)
        for(var i in roomSources){
            this.room.memory.sources.push(roomSources[i])
        }

    }

    return this.room.memory.sources;
};

Resources.prototype.setSourceOccupant = function(sourceId, creep){
    for (var i in this.room.memory.sources){
        if (this.room.memory.sources[i].id == sourceId) {

            if(!this.room.memory.sources[i].occupantIds){
                this.room.memory.sources[i].occupantIds = [];
            }
            this.room.memory.sources[i].occupantIds.push(creep.id);
            break;
        }
    }


    return sourceId;
}

Resources.prototype.getSourceOccupants = function(sourceId){
    this.clearDeadCreeps();

    for (var i in this.room.memory.sources){
        if (this.room.memory.sources[i].id != sourceId) {
            continue;
        } else {
            if (!this.room.memory.sources[i].occupantIds){
                this.room.memory.sources[i].occupantIds = [];
            }
            return this.room.memory.sources[i].occupantIds;
        }
    }
    console.log(this.room.memory.sources[i]);

}

Resources.prototype.clearDeadCreeps = function(){
    for(var i in this.room.memory.sources){
        for(var j in this.room.memory.sources[i].occupantIds){
            if(Game.getObjectById(this.room.memory.sources[i].occupantIds[j]) == null){
                console.log('deleting: ' +  this.room.memory.sources[i].occupantIds[j]);
                this.room.memory.sources[i].occupantIds.splice(j,1);
            }
        }
    }
}

module.exports = Resources;
