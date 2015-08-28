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
    if(!this.creep.memory.hasOwnProperty('homeSourceId')){
        this.creep.memory.homeSourceId = this.resourceManager.getAvailableSource(this.creep.memory.homeSourceId);
        console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.homeSourceId));
    }

    this.act();


}

CreepHarvester.prototype.act = function(){

    if(this.creep.carryCapacity == this.creep.carry.energy){

        var linkDeposit = this.creep.pos.findInRange(FIND_MY_STRUCTURES,1, {filter: { structureType: STRUCTURE_LINK }});
        if (linkDeposit.length > 0) {
            if (linkDeposit[0].energy == linkDeposit[0].energyCapacity){
                this.resourceManager.transferToControllerLink(linkDeposit[0]);
            }
            if(linkDeposit[0].energy < linkDeposit[0].energyCapacity){
                this.creep.transferEnergy(linkDeposit[0]);
            }
        }
    }
    this.creep.moveTo(Game.getObjectById(this.creep.memory.homeSourceId));
    this.creep.harvest(Game.getObjectById(this.creep.memory.homeSourceId));

}

module.exports = CreepHarvester;