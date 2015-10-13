
var HelperFunctions = require('HelperFunctions');
var Room = require('Room');
var RoomHandler = require('RoomHandler');
var CpuAverager = require('util-cpu_averager');
var global = require('global');

require('proto-creep');
require('proto-room');
require('proto-spawn');
require('proto-structure');

require('CreepDictionary');


//Game.spawns.Spawn1.createCreep([CARRY,CARRY,MOVE,MOVE],null,{role:'CreepCarrier'})
//Game.spawns.Spawn1.createCreep([WORK,WORK,MOVE],null,{role:'CreepMiner'})

//setup rooms
for(var n in Game.rooms) {
    var roomHandler = new Room(Game.rooms[n], RoomHandler);
    RoomHandler.set(Game.rooms[n].name, roomHandler);
}

// Load rooms
var rooms = RoomHandler.getRoomHandlers();
for (var name in Memory.creeps) {
    //console.log(Memory.creeps[name]);
    if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Creep ' + name + ' memory deleted');
    }
}

for (var spawn in Game.spawns) {
    if (typeof Memory.spawns[spawn] !== "object") {
        global.setupSpawn(spawn);
    }
}

module.exports.loop = function() {

    for(var i in rooms) {
        var room = rooms[i];
        room.loadCreeps();
        room.populate();
    }
    //console.log('loop end');
    CpuAverager();
};