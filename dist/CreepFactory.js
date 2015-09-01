/**
 * Created by Dustin on 8/25/2015.
 */

var CreepBuilder = require('CreepBuilder');
var CreepCarrier = require('CreepCarrier');
var CreepHarvester = require('CreepHarvester');
var CreepSoldier = require('CreepSoldier');
var CreepShooter = require('CreepShooter');

function CreepFactory(depositManager, populationManager, resourceManager, roomManager){
    this.populationManager = populationManager;
    this.resourceManager = resourceManager;
    this.roomManager = roomManager;
    this.depositManager = depositManager;
};

CreepFactory.prototype.load = function(creep){
    var loadedCreep = null;
    var role = creep.memory.role;

    if(!role) {
        role = creep.name.split('-')[0];
    }

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
        case 'CreepSoldier':
            loadedCreep = new CreepSoldier(creep);
            break;
        case 'CreepShooter':
            loadedCreep = new CreepShooter(creep);
            break;
    }

    if(!loadedCreep){
        return false;
    }

    loadedCreep.init();
}

CreepFactory.prototype.new = function(creepType, spawn) {
    var abilities = [];
    var id = new Date().getTime();
    var creepLevel = this.populationManager.getTotalPopulation() / this.populationManager.populationLevelMultiplier;
    var resourceLevel = this.depositManager.getFullDeposits().length / 5;
    var level = Math.floor(creepLevel + resourceLevel);

    var maxEnergyLevel =this.depositManager.getMaxEnergyCapacity();
    var currentEnergyLevel = this.depositManager.getCurrentEnergyLevel();
    var goalEnergyLevel = maxEnergyLevel * .75;
    var extensionCount = this.depositManager.deposits.length;

    if(this.populationManager.getTotalPopulation() < 5){
        level = 1;
    }

    if (goalEnergyLevel < 300){
        goalEnergyLevel = 300;
    }
    // TOUGH          10
    // MOVE           50
    // CARRY          50
    // ATTACK         80
    // WORK           100
    // RANGED_ATTACK  150
    // HEAL           200

    //MAX Creep Energy at level 5 controller: 1550
    console.log('creepType: ' + creepType  + ' | level: ' + level + ' | extension count: ' + extensionCount);
    switch(creepType) {
        case 'CreepHarvester':

            if(extensionCount = 0) {
                abilities = [WORK, WORK, CARRY, MOVE];
            } else
            if(extensionCount = 1) {
                abilities = [WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(extensionCount = 2) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE];
            } else
            if(extensionCount <= 4) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE];
            } else
            if(extensionCount <= 5) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(extensionCount <= 10) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            } else
            if(extensionCount <= 15) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(extensionCount <= 20) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                //abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(extensionCount <= 25) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(extensionCount <= 30) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(extensionCount <= 35) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            }
        break;
        case 'CreepBuilder':
            if(level < 1) {
                abilities = [WORK, WORK, CARRY, MOVE];
            } else
            if(level <= 2) {
                abilities = [WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 3) {
                abilities = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 4) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY,CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 6) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY,CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 7) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; //1300 Energy
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
                abilities = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 2) {
                abilities = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 3) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 4) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 6) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else
            if(level <= 7) {
                abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //1200
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
        // TOUGH          10
        // MOVE           50
        // CARRY          50
        // ATTACK         80
        // WORK           100
        // RANGED_ATTACK  150
        // HEAL           200
        case 'CreepSoldier':
            if(level <= 1) {
                abilities = [TOUGH, ATTACK, MOVE];
            } else
            if(level <= 2) {
                abilities = [TOUGH, MOVE, ATTACK, MOVE];
            } else
            if(level <= 3) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
            } else
            if(level <= 4) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
            } else
            if(level <= 6) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
            } else
            if(level <= 7) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
            } else
            if(level <= 8) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
            } else
            if(level <= 9) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
            } else
            if(level >= 10) {
                abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
            }
            break;

        case 'CreepShooter':
            if(level <= 4) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, MOVE];
            } else
            if(level <= 6) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
            } else
            if(level <= 7) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
            } else
            if(level <= 8) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
            } else
            if(level <= 9) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
            } else
            if(level >= 10) {
                abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
            }
    }

    var canBuild = spawn.canCreateCreep(
        abilities,
        creepType + '-' + id,
        {
            role: creepType
        }
    );
    if(canBuild !== 0) {
        if (canBuild == -6) {
            console.log('Not enough resources to create ' + creepType);
        } else {
            console.log('Can not build creep: ' + creepType + ' @ ' + level);
        }

        return;
    }

    spawn.createCreep(abilities, creepType + '-' + level + '-' + id, {role: creepType});
};

module.exports = CreepFactory;