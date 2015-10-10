/**
 * Created by Dustin on 9/3/2015.
 */
//TODO Find a way to reduce the number of Miners to one per source once their WORK hits 5x
//creep manager will be called from Room
//var profiler = require('profiler');

// TODO  FIX THIS WHOLE THING...maybe merge it into room, move the spawn functions out, make it moar better
//

var CreepDictionary = require('CreepDictionary');

module.exports = {
    initDefinitions: function (roomName) {
        if (typeof Memory.rooms[roomName].unitDictionary === 'undefined') {
            //Hopefully this works
            CreepDictionary.initDictionary(roomName);
        }
    },
    getCreepCount: function(workingRoomName, creepRole){
        if (Game.rooms[workingRoomName] === undefined){
            //console.log('getCreepCount: workingRoom is undefined');
            return 0;
        }
        var myCreepArray = Game.rooms[workingRoomName].find(FIND_MY_CREEPS, {filter:{memory:{role: creepRole}}});
        //myCreepArray = _.filter(myCreepArray, {memory: {role: targetRole}});
        return myCreepArray.length;
    },
    getBestBody: function(workingRoom, bodiesArray) {

        var energyCapacity = workingRoom.energyCapacityAvailable;
        for (var i in bodiesArray) {
            var cost = this.calculateCost(bodiesArray[i]);
            //console.log(energyCapacity);
            if (cost === energyCapacity) {
                //console.log(bodiesArray[i]);
                return bodiesArray[i];
            }
            if (cost > energyCapacity) {
                return bodiesArray[i - 1];
            }
            if (cost < energyCapacity) {
                //console.log(typeof (bodiesArray.length - 1) + '  ' + i);
                if (i == bodiesArray.length - 1) { //if the max body is affordable we select that one
                    return bodiesArray[i];
                }

            }

        }
    },
    getNumOfNeededCreep: function(workingRoom, creepRole) {
        var creepCount = this.getCreepCount(workingRoom.name, creepRole);
        var creepTarget = CreepDictionary.getTargetCount(workingRoom.name,creepRole);

        return Math.max(creepTarget - creepCount, 0);
    },
    calculateCost: function (partArray) {
        var cost = 0;

        for (var part in partArray) {
            var workingPart = partArray[part];

            if (workingPart === MOVE) cost += 50;
            if (workingPart === WORK) cost += 100;
            if (workingPart === CARRY) cost += 50;
            if (workingPart === ATTACK) cost += 80;
            if (workingPart === RANGED_ATTACK) cost += 150;
            if (workingPart === HEAL) cost += 250;
            if (workingPart === TOUGH) cost += 10;
        }

        return cost;
    }

};




