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
    if(!this.creep.memory.hasOwnProperty('targetFlag')){
        this.creep.assignFlag();
        //console.log(this.creep.name + ' ' + Game.getObjectById(this.creep.memory.targetSourceId));
    }

    if(!this.creep.memory.hasOwnProperty('targetSource') && this.creep.room.name === this.creep.getTargetRoom()){
        this.creep.memory.targetSource = Game.getObjectById(this.creep.memory.targetFlag).sourceId(); //TODO is this the right place for this?
    }


    this.act();


};

CreepMiner.prototype.act = function(){

    if (this.creep.room.name !== this.creep.getTargetRoom()){
        this.creep.moveToTargetRoomIfSet({reusePath:20});
        return;
    }


    //console.log(this.creep.memory.targetSourceId);
    this.creep.moveMeTo(Game.getObjectById(this.creep.memory.targetSource));
    if(this.creep.getHomeRoom() === this.creep.getTargetRoom() && this.creep.carry.energy === this.creep.carryCapacity){
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
    this.creep.harvest(Game.getObjectById(this.creep.memory.targetSource));

};

module.exports = CreepMiner;