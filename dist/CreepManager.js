/**
 * Created by Dustin on 9/3/2015.
 */
//TODO Find a way to reduce the number of Miners to one per source once their WORK hits 5x
//creep manager will be called from Room


//var profiler = require('profiler');


//function creepDefinition(role, targetCount, body)
//{
//    this.role = role;
//    this.targetCount = targetCount;
//    this.body = body;
//    this.options =
//    this.cost = calculateCost(body);
//}

//
// TODO  FIX THIS WHOLE THING...maybe merge it into room, move the spawn functions out, make it moar better
//


function initDefinitions(roomName) {
    if (typeof Memory.rooms[roomName].unitDictionary === 'undefined') {
         //Hopefully this works
        creepDictionary = new CreepDictionary(roomName);

    }

}

Spawn.prototype.getCreepDefinition = function (role) {
    return Memory.rooms[this.room.name].unitDictionary[role];
};

Spawn.prototype.getUnitRoles = function () {
    return Object.keys(Memory.rooms[this.room.name].unitDictionary);
};


Spawn.prototype.spawnCreep = function (spawner, role) {
    //TODO Add Emergency handling: build best body w/ available energy.
    var definition = Memory[this.room.name].unitDictionary[role];

    var body = getBestBody(this.room, definition.body);
    if (this.room.energyAvailable < calculateCost(body) || this.spawning) {
        return;
    }

    console.log('SPAWNING ' + definition.options.role + ' in ' + this.room.name);

    var nameCount = 0;
    var name = null;
    while (name === null){
        nameCount++;
        var tryName = definition.options.role + nameCount;
        if (typeof Game.creeps[tryName] === 'undefined'){
            name = tryName;
        }
    }

    this.createCreep(body, name, {roleId: nameCount});
};

function getCreepCount(workingRoomName, creepRole) {
    if (Game.rooms[workingRoomName] === undefined){
        //console.log('getCreepCount: workingRoom is undefined');
        return 0;
    }
    var myCreepArray = Game.rooms[workingRoomName].find(FIND_MY_CREEPS, {filter:{memory:{role: creepRole}}});
    //myCreepArray = _.filter(myCreepArray, {memory: {role: targetRole}});
    return myCreepArray.length;
}

exports.getNumOfNeededCreep = function(workingRoom, creepRole) {
    var creepCount = getCreepCount(workingRoom.name, creepRole);
    var creepTarget = creepDictionary.getTargetCount(creepRole);

    return Math.max(creepTarget - creepCount, 0);
};


exports.getCreepCount = getCreepCount;
/*
PRIVATE FUNCTIONS
*/

function getBestBody(workingRoom, bodiesArray) {

    var energyCapacity = workingRoom.energyCapacityAvailable;
    for (var i in bodiesArray) {
        var cost = calculateCost(bodiesArray[i]);
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
}

function calculateCost(partArray) {
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

