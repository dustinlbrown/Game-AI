
var HelperFunctions = require('HelperFunctions');
var Room = require('Room');
var RoomHandler = require('RoomHandler');
var CpuAverager = require('CpuAverager');
require('globalStructure');

//Game.spawns.Spawn1.createCreep([CARRY,CARRY,MOVE,MOVE],null,{role:'CreepCarrier'})
//Game.spawns.Spawn1.createCreep([WORK,WORK,MOVE],null,{role:'CreepMiner'})

module.exports.loop = function() {
    //console.log('loop start');
    // Init rooms

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

    for(var i in rooms) {
        var room = rooms[i];
        room.loadCreeps();
        room.populate();
    }
    //console.log('loop end');
    CpuAverager();
};
