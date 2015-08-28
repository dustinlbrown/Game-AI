/**
 * Created by Dustin on 8/25/2015.
 */
function Resources(room, population) {
    this.room = room;
    this.population = population;
}

//Resources.prototype.getAvailableSources = function() {
//    // Some kind of unit counter per resource (with Population)
//    var srcs = this.getSources();
//    var srcIndex = Math.floor(Math.random()*srcs.length);
//
//    return srcs[srcIndex];
//};

Resources.prototype.isControllerSource = function(room, source) {
    var closestSource = this.room.controller.pos.findClosest(this.getSources());
    if (closestSource == source){
        return true;
    }
    return false;

}

Resources.prototype.transferToControllerLink = function (link) {
    this.link = link;
    var controllerLink = this.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_LINK}
    });

    if (controllerLink.id != this.link.id && controllerLink.energy < controllerLink.energyCapacity) {
        this.link.transferEnergy(Game.getObjectById(controllerLink.id));
    }

}

Resources.prototype.occupantsByRole = function(source, role){
    var occupants = source.pos.findInRange(FIND_MY_CREEPS, 1);
    //var occupants = source.pos.findInRange(FIND_MY_CREEPS, 3, { filter: { memory: {role: role}} });

    return occupants.length;

}

Resources.prototype.getAvailableSource = function(currentSourceId){
    var sources = this.getSources();
    var bestSourceIndex = 0;//@TODO
    var bestSourceOccupancy = 99;
    var isCurrentSource = false;
    console.log('current source:' + Game.getObjectById(currentSourceId));
    currentSourceId = currentSourceId || sources[0].id

    var currentSourceOccupants = this.occupantsByRole(Game.getObjectById(currentSourceId),'CreepHarvester');
    if (sources.length > 0){
        for (var i = 0 ; i < sources.length;i++){
            if (currentSourceId == sources[i].id){
                isCurrentSource = true;
            }
            var sourceOccupants = this.occupantsByRole(sources[i],'CreepHarvester');
            if (sourceOccupants < bestSourceOccupancy && sourceOccupants < currentSourceOccupants ){
                bestSourceIndex = i;
                bestSourceOccupancy = sourceOccupants;
            }

        }
        return sources[bestSourceIndex].id;
    }else{
        return ERR_NOT_FOUND;
    }
}

Resources.prototype.getSources = function(room) {
    return this.room.find(FIND_SOURCES);
        //FIND_SOURCES, {
        //    filter: function(src) {
        //        var targets = src.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        //        if(targets.length == 0) {
        //            return true;
        //        }
        //
        //        return false;
        //    }
        //}
        //);

};

module.exports = Resources;