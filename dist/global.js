module.exports = {
    initStructureAssignments: function (structureClass) {
        if (Memory.assignedStructures === undefined) Memory.assignedStructures = {};
        if (Memory.assignedStructures[structureClass] === undefined) Memory.assignedStructures[structureClass] = {};
    },

    initMineAssignments: function (room) {
        if (Memory.assignedMines === undefined) Memory.assignedMines = {};
        if (Memory.assignedMines[room] === undefined) Memory.assignedMines[room] = {};
    },
    getSourceFlags: function(){
        return _.filter(Game.flags, function(flag){
            return flag.name.substring(0,3) === 'src';
        });
    },
    initSpawn: function (spawn) {
        Memory.spawns[spawn] = {};
        Memory.spawns[spawn].spawnPriorityQueue = [];
        Memory.spawns[spawn].spawnQueue = [];
    }
};