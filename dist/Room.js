/**
 * Created by Dustin on 8/24/2015.
 */

var CreepFactory = require('CreepFactory');
var PopulationManager = require('population');
var Resources = require('Resources');
var Deposits = require('Deposits');

function Room(room, roomHandler) {
    this.room = room;
    this.roomHandler = roomHandler;
    this.creeps = [];
    this.structures = [];

    this.populationManager = new PopulationManager(this.room);
    this.depositManager = new Deposits(this.room);
    this.resourceManager = new Resources(this.room, this.populationManager);
    //this.constructionManager = new Constructions(this.room);
    this.populationManager.typeDistribution.CreepBuilder.max = 4;
    this.populationManager.typeDistribution.CreepHarvester.max = (this.resourceManager.getSources().length+1)*2;
    this.populationManager.typeDistribution.CreepCarrier.max = this.populationManager.typeDistribution.CreepHarvester.max;
    this.creepFactory = new CreepFactory(this.depositManager,  this.populationManager, this.resourceManager, this.roomHandler);

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

        if((this.depositManager.energy() / this.depositManager.energyCapacity()) > 0.2) {
            var types = this.populationManager.getTypes()
            for(var i = 0; i < types.length; i++) {
                var ctype = this.populationManager.getType(types[i]);
                if(this.depositManager.deposits.length > ctype.minExtensions) {
                    if((ctype.goalPercentage > ctype.currentPercentage && ctype.total < ctype.max) || ctype.total == 0 || ctype.total < ctype.max*0.75) {
                        this.creepFactory.new(types[i], this.depositManager.getSpawnDeposit());
                        break;
                    }
                }
            }
        }
    }

};

Room.prototype.getSpawns = function(){
    return this.depositManager.spawns;
}

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

module.exports = Room;