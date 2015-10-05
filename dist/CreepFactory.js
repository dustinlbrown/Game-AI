/**
 * Created by Dustin on 8/25/2015.
 */

var CreepBuilder = require('CreepBuilder');
var CreepCarrier = require('CreepCarrier');
var CreepMiner = require('CreepMiner');
var CreepSoldier = require('CreepSoldier');
var CreepShooter = require('CreepShooter');
var CreepCourier = require('CreepCourier');
var CreepRemoteMiner = require('CreepRemoteMiner');
var CreepRemoteCarrier = require('CreepRemoteCarrier');
var CreepRoadMaintainer = require('CreepRoadMaintainer');
var CreepBase = require('CreepBase');
var globalStructure = require('globalStructure');

function CreepFactory(depositManager, populationManager, resourceManager, roomManager){
    this.populationManager = populationManager;
    this.resourceManager = resourceManager;
    this.room = roomManager;
    this.depositManager = depositManager;
};

CreepFactory.prototype.load = function(creep){
    var loadedCreep = null;
    var role = creep.memory.role;

    if(!role) {
        role = creep.name.split('-')[0];
    }

    switch(role){
        case 'CreepMiner':
            loadedCreep = new CreepMiner(creep, this.resourceManager, this.room);
            break;
        case 'CreepCarrier':
            loadedCreep = new CreepCarrier(creep);
            break;
        case 'CreepBuilder':
            loadedCreep = new CreepBuilder(creep, this.depositManager);
            break;
        case 'CreepCourier':
            loadedCreep = new CreepCourier(creep);
            break;
        case 'CreepSoldier':
            loadedCreep = new CreepSoldier(creep);
            break;
        case 'CreepShooter':
            loadedCreep = new CreepShooter(creep);
            break;
        case 'CreepRemoteMiner':
            loadedCreep = new CreepRemoteMiner(creep, this.resourceManager, this.room);
            break;
        case 'CreepRemoteCarrier':
            loadedCreep = new CreepRemoteCarrier(creep, this.resourceManager);
            break;
        case 'CreepRoadMaintainer':
            loadedCreep = new CreepRoadMaintainer(creep, this.depositManager);
            break;
    }

    if(!loadedCreep){
        return false;
    }


    loadedCreep.init();

};

CreepFactory.prototype.new = function(creepType, spawn) {
    var abilities = [];
    var id = new Date().getTime();
    var creepLevel = this.populationManager.getTotalPopulation() / this.populationManager.populationLevelMultiplier;
    var resourceLevel = this.depositManager.getFullDeposits().length / 5;
    var level = Math.floor(creepLevel + resourceLevel);

    var maxEnergyLevel =this.room.energyCapacityAvailable;
    var currentEnergyLevel = this.room.energyAvailable;
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
    console.log('creepType: ' + creepType  + ' | level: ' + level + ' | extension count: ' + extensionCount);
    spawn.createCreep(abilities, creepType + '-' + level + '-' + id, {role: creepType});
};


module.exports = CreepFactory;