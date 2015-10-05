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

function CreepFactory(depositManager,  resourceManager, roomManager){
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



module.exports = CreepFactory;