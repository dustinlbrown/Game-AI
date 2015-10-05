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

function initDefinitions() {
    if (typeof Memory.unitDictionary === 'undefined') {
        require('CreepDictionary'); //Hopefully this works
    }

}

Spawn.prototype.getCreepDefinition = function (role) {
    if (typeof Memory.unitDictionary === 'undefined') {
        initDefinitions();
    }
    return Memory.unitDictionary[role];
};

Spawn.prototype.getUnitRoles = function () {
    if (typeof Memory.unitDictionary === 'undefined') {
        initDefinitions();
    }
    return Object.keys(Memory.unitDictionary);
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

exports.getNumOfNeededCreep = function (workingRoom, creepRole) {
    var creepCount = getCreepCount(workingRoom.name, creepRole);
    var creepTarget = Memory.unitDictionary[creepRole].targetCount;

    return Math.max(creepTarget - creepCount, 0);
};

exports.getCreepCount = getCreepCount;

function calculateCost(partArray) {
    var cost = 0;

    for (var i = 0; i < partArray.length; i++) {
        var workingPart = partArray[i];

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

Spawn.prototype.spawnCreep = function (spawner, role) {
    //TODO Add Emergency handling: build best body w/ available energy.
    var definition = Memory.unitDictionary[role];

    var body = getBestBody(spawner.room, definition.body);
    if (spawner.room.energyAvailable < calculateCost(body) || this.spawning) {
        return;
    }

    console.log('SPAWNING ' + definition.options.role + ' in ' + spawner.room.name);

    var nameCount = 0;
    var name = null;
    while (name == null)
    {
        nameCount++;
        var tryName = definition.options.role + nameCount;
        if (Game.creeps[tryName] == undefined)
            name = tryName;
    }

    spawner.createCreep(body, name, {role: definition.options.role, roleId: nameCount, homeRoom: spawner.room.name});
};


function getBestBody(workingRoom, bodiesArray) {

    var energyCapacity = workingRoom.energyCapacityAvailable;
    for (var i in bodiesArray) {


        var cost = calculateCost(bodiesArray[i]);


        if (cost == energyCapacity) {
            return bodiesArray[i]
        }
        if (cost > energyCapacity) {
            return bodiesArray[i - 1];
        }

        if (cost < energyCapacity) {
            if (i == bodiesArray.length - 1) { //if the max body is affordable we select that one
                return bodiesArray[i];
            }

        }

    }
}
