/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('miner'); // -> 'a thing'
 */

function CreepMiner(creep,resources){
    this.creep = creep;
    this.resourceManager = resources;


}

CreepMiner.prototype.init = function() {
    this.creep.memory.role = 'CreepMiner';
    if(!this.creep.memory.hasOwnProperty('targetSourceId')){
        this.creep.memory.targetSourceId = this.resourceManager.assignSourceOccupant(this.creep);
        console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.targetSourceId));
    }

    this.act();


};

CreepMiner.prototype.act = function(){

    //console.log(this.creep.memory.targetSourceId);
    this.creep.moveTo(Game.getObjectById(this.creep.memory.targetSourceId));
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSourceId));

};

module.exports = CreepMiner;