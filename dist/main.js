"use strict";
var SpawnManager = require('SpawnManager');
//var RoomHandler = require('RoomHandler');
var CpuAverager = require('util-cpu_averager');
var global = require('global');

require('proto-creep');
require('proto-flag');
require('proto-room');
require('proto-spawn');
require('proto-structure');

require('CreepDictionary');


//Game.spawns.Spawn1.createCreep([CARRY,CARRY,MOVE,MOVE],null,{role:'CreepCarrier'})
//Game.spawns.Spawn1.createCreep([WORK,WORK,MOVE],null,{role:'CreepMiner'})

//setup rooms
//for(var n in Game.rooms) {
//    var roomHandler = new SpawnManager(Game.rooms[n], RoomHandler);
//    RoomHandler.set(Game.rooms[n].name, roomHandler);
//}

// Load rooms
//var rooms = RoomHandler.getRoomHandlers();
for (var name in Memory.creeps) {
    //console.log(Memory.creeps[name]);
    if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Creep ' + name + ' memory deleted');
    }
}

for (var spawn in Game.spawns) {
    if (typeof Memory.spawns[spawn] !== "object") {
        global.initSpawn(spawn);
    }
}
var myRooms = [];
for (let room in Game.rooms){
    if(!_.includes(myRooms,Game.rooms[room])) {
        myRooms.push(Game.rooms[room]);
    }
}

module.exports.loop = function() {

    for(let room in myRooms) {
        //console.log(myRooms[room]);
        var spawnManager = new SpawnManager(myRooms[room]);
        spawnManager.loadCreeps();
        spawnManager.populate();
    }
    //console.log('loop end');
    CpuAverager();
};