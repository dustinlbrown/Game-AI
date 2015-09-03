// Your code goes here...this is a test wooo!
/*
* [20:38] <Hernanduer> just make the room keep track of how many are at each instead of searching for who's where every time
 [20:38] <mistamadd001> ok, well that could be a good start, when you first create a new room you can do a find
                        and store the id's in an array, you could also store the source id's as arrays and store
                        creep names in the array when they are assigned to that source,
 [20:39] <mistamadd001> then do a check for living creeps
 [20:41] <Dustin_> so do you guys have the room remember all the structures?
 [20:41] <mistamadd001> just iterate through your source arrays and look if(!Game.creeps[i]){delete bla}
 [20:42] <Dustin_> okay
 [20:42] <Dustin_> I can handle that
*
*
* */
var HelperFunctions = require('HelperFunctions');

var Room = require('Room');
var RoomHandler = require('RoomHandler');



Creep.prototype.setRole = function(role){
    this.memory.role = role;
}

Creep.prototype.getRole = function(){
    return this.memory.role;
}


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
