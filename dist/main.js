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
//return;

var HelperFunctions = require('HelperFunctions');
var Room = require('Room');
var RoomHandler = require('RoomHandler');
require('globalStructure');




// Init rooms

for(var n in Game.rooms) {
    var roomHandler = new Room(Game.rooms[n], RoomHandler);
    RoomHandler.set(Game.rooms[n].name, roomHandler);
}

// Load rooms
var rooms = RoomHandler.getRoomHandlers();
var safeToClearMem = true;

for (var name in Memory.creeps) {
    //console.log(Memory.creeps[name]);
    if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Creep ' + name + ' memory deleted');
    }
}

for(var n in rooms) {

    var room = rooms[n];
    //var spawns = room.room.find(FIND_MY_SPAWNS);
    //for (var i in spawns){
    //    if(spawns[i].spawning){
    //        //console.log('spawner spawning - don\'t clear memory');
    //        safeToClearMem = false;
    //    }
    //}

    room.loadCreeps();
    room.populate();

}

//
//RoomPosition.prototype.hasPathTo = function(target, opts){
//    return this.isNearTo(target) || this.findClosest([target], opts);
//};