/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */
 module.exports = function(minion){

    var home = Game.spawns.VileSpawn;

   /* if(minion.carry.energy < minion.carryCapacity){*/
        var sweetNectars = minion.room.find(FIND_SOURCES);
        minion.moveTo(sweetNectars[0]);
        minion.harvest(sweetNectars[0]);
    //}else{
    //    minion.dropEnergy(minion.carryCapacity);
    //}
}