/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */

function CreepHarvester(creep,resources){
    this.creep = creep;
    this.resourceManager = resources;


}

CreepHarvester.prototype.init = function() {
    this.creep.memory.role = 'CreepHarvester';
    if(!this.creep.memory.hasOwnProperty('targetSourceId')){
        this.creep.memory.targetSourceId = this.resourceManager.assignSourceOccupant(this.creep);
        console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.targetSourceId));
    }

    this.act();


}

CreepHarvester.prototype.act = function(){


    this.creep.moveTo(Game.getObjectById(this.creep.memory.targetSourceId));
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSourceId));

}

module.exports = CreepHarvester;