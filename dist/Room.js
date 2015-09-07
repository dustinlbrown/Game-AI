/**
 * Created by Dustin on 8/24/2015.
 */

var CreepFactory = require('CreepFactory');
var PopulationManager = require('population');
var Resources = require('Resources');
var Deposits = require('Deposits');
var CreepManager = require('CreepManager');

function Room(room, roomHandler) {
    this.room = room;
    this.roomHandler = roomHandler;
    this.creeps = [];
    this.structures = [];

    this.populationManager = new PopulationManager(this.room);
    this.depositManager = new Deposits(this.room);
    this.resourceManager = new Resources(this.room, this.populationManager);
    //this.constructionManager = new Constructions(this.room);
    this.populationManager.typeDistribution.CreepBuilder.max = 3;
    this.populationManager.typeDistribution.CreepCourier.max = 3;
    this.populationManager.typeDistribution.CreepHarvester.max = ((this.resourceManager.getSources().length+1)*2) - 1;
    this.populationManager.typeDistribution.CreepCarrier.max = this.populationManager.typeDistribution.CreepHarvester.max;
    this.creepFactory = new CreepFactory(this.depositManager,  this.populationManager, this.resourceManager, this.roomHandler);

    this.creepManager = CreepManager;
    //this.memory.controllerSource = this.findControllerSource();
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
            var getNumOfNeededCreeps = this.creepManager.getNumOfNeededCreep(this.room,unitRoles[i]);

            if(unitRoles[i] === 'CreepRemoteHarvester' || unitRoles[i] === 'CreepRemoteCarrier'){
                //TODO make this work better for more remote mining rooms
                var remoteMiningCreepCount = 0;
                var flags = this.getRemoteMiningFlags();
                for(var j = 0; j < flags.length; j++){
                    //console.log('There are '+ this.creepManager.getCreepCount(flags[j].pos.roomName,unitRoles[i]) +' mining creeps in ' + flags[j].pos.roomName);
                    remoteMiningCreepCount += this.creepManager.getCreepCount(flags[j].pos.roomName,unitRoles[i]);
                }
                getNumOfNeededCreeps = this.creepManager.getNumOfNeededCreep(this.room,unitRoles[i]) - remoteMiningCreepCount;
            }

            if (getNumOfNeededCreeps > 0) {
                spawn.spawnCreep(spawn,unitRoles[i]);
                break;
            }

        }

    }
    //
    //for(var i = 0; i < this.depositManager.spawns.length; i++) {
    //    var spawn = this.depositManager.spawns[i];
    //    if(spawn.spawning) {
    //        continue;
    //    }
    //
    //    if((this.depositManager.energy() / this.depositManager.energyCapacity()) > 0.2) {
    //        var types = this.populationManager.getTypes()
    //        for(var i = 0; i < types.length; i++) {
    //            var ctype = this.populationManager.getType(types[i]);
    //            if(this.depositManager.deposits.length > ctype.minExtensions) {
    //                if((ctype.goalPercentage > ctype.currentPercentage && ctype.total < ctype.max) || ctype.total == 0 || ctype.total < ctype.max*0.75) {
    //                    this.creepFactory.new(types[i], this.depositManager.getSpawnDeposit());
    //                    break;
    //                }
    //            }
    //        }
    //    }
    //}

};


Room.prototype.loadCreeps = function() {
    var creeps = this.room.find(FIND_MY_CREEPS);
    for(var n in creeps) {
        var c = this.creepFactory.load(creeps[n]);
        if(c) {
            this.creeps.push(c);
        }
    }
    //this.distributeBuilders();
    //this.distributeResources('CreepMiner');
    //this.distributeResources('CreepCarrier');
    //this.distributeCarriers();
};

Room.prototype.getRemoteMiningFlags = function(){
    var miningFlags = _.filter(Game.flags, {color: COLOR_BLUE});
    return miningFlags;
}


module.exports = Room;