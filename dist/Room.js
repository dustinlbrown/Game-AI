/**
 * Created by Dustin on 8/24/2015.
 */
"use strict";

var CreepFactory = require('CreepFactory');
var Resources = require('Resources');
var Deposits = require('Deposits');
var CreepManager = require('CreepManager');
var global = require('global');

function Room(room, roomHandler) {
    this.room = room;
    this.roomHandler = roomHandler;
    this.creeps = [];

    this.depositManager = new Deposits(this.room);
    this.resourceManager = new Resources(this.room, this.populationManager);
    this.creepFactory = new CreepFactory(this.depositManager, this.resourceManager, this.roomHandler);
    this.creepManager = CreepManager;

}

Room.prototype.populate = function() {
    //if(this.depositManager.spawns.length == 0 && this.populationManager.getTotalPopulation() < 10) {
    //    this.askForReinforcements()
    //}
    for(var i = 0; i < this.depositManager.spawns.length; i++) {
        var spawn = this.depositManager.spawns[i];
        if(spawn.spawning) {
            continue;
        }
        var unitRoles = spawn.getUnitRoles();
        for(var i in unitRoles){
            var neededCreeps = this.creepManager.getNumOfNeededCreep(this.room,unitRoles[i]);

            if(unitRoles[i] === 'CreepRemoteMiner' || unitRoles[i] === 'CreepRemoteCarrier'){
                //TODO make this work better for more remote mining rooms
                var remoteMiningCreepCount = 0;
                var flags = global.getRemoteMiningFlags();
                for(var j = 0; j < flags.length; j++){
                    //console.log('There are '+ this.creepManager.getCreepCount(flags[j].pos.roomName,unitRoles[i]) +' mining creeps in ' + flags[j].pos.roomName);
                    remoteMiningCreepCount += this.creepManager.getCreepCount(flags[j].pos.roomName,unitRoles[i]);
                }
                neededCreeps = this.creepManager.getNumOfNeededCreep(this.room,unitRoles[i]) - remoteMiningCreepCount;

                if(this.room.controller.level < 3){
                    neededCreeps = 0;
                }
            }

            if (neededCreeps > 0) {
                if( //Safety switch!
                    (unitRoles[i] === 'CreepCarrier' && neededCreeps === Memory.unitDictionary[unitRoles[i]].targetCount - 1)
                    || (unitRoles[i]=== 'CreepMiner' && neededCreeps === Memory.unitDictionary[unitRoles[i]].targetCount)
                ){
                    console.log('EMERGENCY: room about to die...killing energy consumers');
                    //TODO: find a way to pause energy consumers... for now...kill them all!
                    var energyConsumers = ['CreepBuilder','CreepCourier','CreepRoadMaintainer'];
                    for(var name in Memory.creeps){
                        if(name.homeRoom === this.room && _.includes(energyConsumers,name)){
                            Game.creeps[name].suicide();
                        }

                    }
                }

                spawn.spawnCreep(spawn,unitRoles[i]);
                break;
            }

        }

    }


};


Room.prototype.loadCreeps = function() {
    var creeps = this.room.find(FIND_MY_CREEPS);
    for(var n in creeps) {
        var c = this.creepFactory.load(creeps[n]);
        if(c) {
            this.creeps.push(c);
        }
    }
};

module.exports = Room;