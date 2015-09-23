var rooms = [];
var roomHandlers = {};

var RoomHandler = {};
RoomHandler.set = function(name, handler) {
    rooms.push(name);
    roomHandlers[name] = handler;
};

RoomHandler.get = function(name) {
    if(this.isOurRoom(name)) {
        return roomHandlers[name];
    }

    return false;
};

RoomHandler.isOurRoom = function(name) {
    return rooms.indexOf(name) != -1;


};

RoomHandler.getRoomHandlers = function() {
    return roomHandlers;
};

RoomHandler.requestReinforcement = function(room) {
    var rooms = this.getRoomHandlers();
    for(var n in rooms) {
        var r = rooms[n];
        if(r.room.name != room.room.name) {
            r.sendReinforcements(room);
        }

    }
};

module.exports = RoomHandler;