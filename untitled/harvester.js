/**
 * Created by Dustin on 10/21/2015.
 */

module.exports = function (creep) {

    var gameSources = creep.room.find(FIND_SOURCES);

    //console.log(creep.room.memory.sources);

    if (creep.room.memory.sources.length === 0){
        //console.log("harvester - in If Statement");

        creep.room.memory.sources = [];
        for (var i in gameSources){
            //console.log(gameSources[i]);
            creep.room.memory.sources.push(gameSources[i]);
        }
    }

    creep.moveTo(gameSources[0]);
    creep.harvest(gameSources[0]);

}