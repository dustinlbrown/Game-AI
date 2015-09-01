// Your code goes here...this is a test wooo!

var HelperFunctions = require('HelperFunctions');

var Room = require('Room');
var RoomHandler = require('RoomHandler');





// Init rooms
for(var n in Game.rooms) {
    var roomHandler = new Room(Game.rooms[n], RoomHandler);
    RoomHandler.set(Game.rooms[n].name, roomHandler);
};

// Load rooms
var rooms = RoomHandler.getRoomHandlers();
var safeToClearMem = true;

for(var n in rooms) {
    var room = rooms[n];

    room.loadCreeps();
    room.populate();

    var spawns = room.getSpawns();

    for (var i in spawns){
        if(spawns[i].spawning){
            safeToClearMem= false;
        }
    }
};

if(safeToClearMem){HelperFunctions.garbageCollection();}


RoomPosition.prototype.hasPathTo = function(target, opts){
    return this.isNearTo(target) || this.findClosest([target], opts);
};


//
//for(var name in Game.creeps){
//    var minion = Game.creeps[name];
//    var role = minion.memory.role;
//
//    if (role) {
//        if(role != 'CreepHarvester' && role != 'CreepCarrier' && role != 'CreepBuilder'){
//            config.actions[role](minion);
//        }
//
//    }
//};

//for(var name in Game.spawns) {
//    var spawn = Game.spawns[name];
//    for (var role in config.roles){
//        var roleConfig = config.roles[role];
//        populator.makeCreep(spawn,role,roleConfig);
//    };
//};



// Process the spawns
//
//for(var name in Game.creeps){
//    var minion = Game.creeps[name];
//    var role = minion.memory.role;
//
//    if (minion.memory.role) {
//        config.actions[role](minion);
//    }
//}
//
//
////make da creeep(s)!
//for(var name in Game.spawns) {
//    var spawn = Game.spawns[name];
//    for (var role in config.roles){
//        var roleConfig = config.roles[role];
//        populator.makeCreep(spawn,role,roleConfig);
//
//    }
//
//}
