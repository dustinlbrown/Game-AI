/**
 * Created by Dustin on 8/25/2015.
 */

var CreepBuilder = require('CreepBuilder');
var CreepCarrier = require('CreepCarrier');
var CreepHarvester = require('CreepHarvester');

function CreepFactory(depositManager, population, resourceManager, roomManager){
    this.population = population;
    this.resourceManager = resourceManager;
    this.roomManager = roomManager;
    this.depositManager = depositManager;
};

CreepFactory.prototype.load = function(creep){
    var loadedCreep = null;
    var role = creep.memory.role;

    switch(role){
        case 'CreepHarvester':
            loadedCreep = new CreepHarvester(creep, this.resourceManager, this.roomManager);
            break;
        case 'CreepCarrier':
            loadedCreep = new CreepCarrier(creep);
            break;
        case 'CreepBuilder':
            loadedCreep = new CreepBuilder(creep, this.depositManager);
            break;
    }

    if(!loadedCreep){
        return false;
    }

    loadedCreep.init();
}

CreepFactory.prototype.new = function(creepType, spawn) {
    console.log(creepType);
    var abilities = [];
    var id = new Date().getTime();
    var creepLevel = this.population.getTotalPopulation() / this.population.populationLevelMultiplier;

    var resourceLevel = this.depositManager.getFullDeposits().length / 5;
    var level = Math.floor(creepLevel + resourceLevel);
    if(this.population.getTotalPopulation() < 5){
        level = 1;
    }
    // TOUGH          10
    // MOVE           50
    // CARRY          50
    // ATTACK         80
    // WORK           100
    // RANGED_ATTACK  150
    // HEAL           200

    switch(creepType) {
        case 'CreepHarvester':
            console.log('we know its a harvester');
            if(level <= 1) {
                abilities = [WORK, CARRY, MOVE];
            } else
            if(level <= 2) {
                abilities = [WORK, WORK, CARRY, MOVE];
            } else
            if(level <= 3) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE];
            } else
            if(level <= 4) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 6) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 7) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 8) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 9) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level >= 10) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            }
        break;
        case 'CreepBuilder':
            if(level <= 1) {
                abilities = [WORK, CARRY, MOVE];
            } else
            if(level <= 2) {
                abilities = [WORK, WORK, CARRY, MOVE];
            } else
            if(level <= 3) {
                abilities = [WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 4) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 6) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 7) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 8) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 9) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level >= 10) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            }
            break;
        case 'CreepCarrier':
            if(level <= 1) {
                abilities = [CARRY, MOVE];
            } else
            if(level <= 2) {
                abilities = [CARRY, CARRY, MOVE];
            } else
            if(level <= 3) {
                abilities = [CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 4) {
                abilities = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 6) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 7) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 8) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 9) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level >= 10) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            }
            break;

    }

    var canBuild = spawn.canCreateCreep(
        abilities,
        creepType + '-' + id,
        {
            role: creepType
        }
    );
    if(canBuild !== 0) {
        console.log('Can not build creep: ' + creepType + ' @ ' + level);
        console.log(abilities,
            creepType + '-' + id,
            {
                role: creepType
            });
        console.log(canBuild.toString());
        return;
    }

    console.log('Spawn level ' + level + ' ' + creepType + '(' + creepLevel + '/' + resourceLevel + ')');
    spawn.createCreep(abilities, creepType + '-' + id, {role: creepType});
};

module.exports = CreepFactory;