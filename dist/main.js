// Your code goes here...

var config = require('init');
var populator = require('populator');

RoomPosition.prototype.hasPathTo = function(target, opts){
    return this.isNearTo(target) || this.findClosest([target], opts);
};

// Process the spawns

for(var name in Game.creeps){
    var minion = Game.creeps[name];
    var role = minion.memory.role;
    
    if (minion.memory.role) {
        config.actions[role](minion);
    }
}


//make da creeep(s)!
for(var name in Game.spawns) {
    var spawn = Game.spawns[name];
    for (var role in config.roles){
        var roleConfig = config.roles[role];
        populator.makeCreep(spawn,role,roleConfig);
        
    }

}
