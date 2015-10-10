/**
 * Created by Dustin on 10/7/2015.
 */
var CreepManager = require('CreepManager');
var CreepDictionary = require('CreepDictionary');
Spawn.prototype.getCreepDefinition = function (role) {
    return Memory.rooms[this.room.name].unitDictionary[role];
};

Spawn.prototype.getUnitRoles = function () {

    return CreepDictionary.getUnitRoles(this.room.name);
};


Spawn.prototype.spawnCreep = function (role) {
    //TODO Add Emergency handling: build best body w/ available energy.
    //console.log(room);
    var definition = Memory.rooms[this.room.name].unitDictionary[role];

    var body = CreepManager.getBestBody(this.room, definition.body);
    if (this.room.energyAvailable < CreepManager.calculateCost(body) || this.spawning) {
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
    var creepOptions ={
        role: definition.options.role,
        homeRoom: definition.options.homeRoom,
        roleId: nameCount
    };


    this.createCreep(body, name, creepOptions);
};