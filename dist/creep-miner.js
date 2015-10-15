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
        this.creep.memory.targetSourceId = this.creep.assignSourceOccupant();
        console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.targetSourceId));
    }

    this.act();


};

CreepMiner.prototype.act = function(){

    //console.log(this.creep.memory.targetSourceId);
    this.creep.moveTo(Game.getObjectById(this.creep.memory.targetSourceId));
    if(this.creep.carry.energy === this.creep.carryCapacity){
        //TODO store neartolink in creep memory
        var link = this.creep.getNearToLink();
        if(typeof link !== 'undefined'){
            if(link.energy < link.energyCapacity){
                this.creep.transferEnergy(link);
            }
            if (link.energy === link.energyCapacity){
                this.creep.transferToControllerLink(link);
            }
        }
    }
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSourceId));

};

module.exports = CreepMiner;