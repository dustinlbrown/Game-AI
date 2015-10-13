/**
 * Created by Dustin on 8/25/2015.
 */

var CreepBuilder = require('creep-builder');
var CreepCarrier = require('creep-carrier');
var CreepMiner = require('creep-miner');
var CreepSoldier = require('creep-soldier');
var CreepShooter = require('creep-shooter');
var CreepCourier = require('creep-courier');
var CreepRemoteMiner = require('creep-remote_miner');
var CreepRemoteCarrier = require('creep-remote_carrier');
var CreepRoadMaintainer = require('creep-road_maintainer');
var CreepRampartDefender = require('creep-rampart_defender');

var CreepBase = require('proto-creep');
var globalStructure = require('proto-structure');

function CreepFactory(resourceManager, roomManager){
    this.resourceManager = resourceManager;
    this.room = roomManager;
    //this.depositManager = depositManager;
}
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
            loadedCreep = new CreepBuilder(creep);
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
            loadedCreep = new CreepRoadMaintainer(creep);
            break;
        case 'CreepRampartDefender':
            loadedCreep = new CreepRampartDefender(creep);
            break;
    }

    if(!loadedCreep){
        return false;
    }

    loadedCreep.init();
};



module.exports = CreepFactory;