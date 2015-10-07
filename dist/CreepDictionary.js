var CREEP_TYPE = {
    SUPPORT:0,
    DEFENSE:1,
    ATTACK:2
};

function CreepDictionary(roomName){
    console.log("this shouldn't happen more than once " + roomName);
    this.roomName = roomName;
    this.init();
 }


CreepDictionary.prototype.init = function(){

    console.log(this.roomName);
    ////***HOME UNITS***////
    defineUnit("CreepMiner", 2,
        [
            [WORK, CARRY, MOVE], //200 (startup creep)
            [WORK, WORK, CARRY, MOVE], //300
            [WORK, WORK, CARRY, MOVE, MOVE], //350
            [WORK, WORK, WORK, CARRY, MOVE], //400
            [WORK, WORK, WORK, WORK, CARRY, MOVE], //500
            [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], //550 (or a spawn and 5 extensions)
            [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //800
            [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //850 - Biggest miner we'll need
            [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //1050 - Biggest miner we'll need
        ],
        {
            priority: 1,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );

    defineUnit("CreepCarrier", 4,
        [
            [CARRY, CARRY, MOVE, MOVE], //200 (startup creep)
            [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //300
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //350
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //400
            [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //500
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //550
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //800 (10 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //1050 (15 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //1300 (20 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //30 parts
        ],
        {
            priority: 1,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );

    defineUnit("CreepRemoteMiner", 3,
        [
            [WORK, CARRY, MOVE], //200 (startup creep)
            [WORK, WORK, CARRY, MOVE], //300
            [WORK, WORK, CARRY, MOVE, MOVE], //350
            [WORK, WORK, WORK, CARRY, MOVE], //400
            [WORK, WORK, WORK, WORK, CARRY, MOVE], //500
            [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], //550 (or a spawn and 5 extensions)
            [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //800
            [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //850 - Biggest miner we'll need
        ],
        {
            priority: 5,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );

    defineUnit("CreepRemoteCarrier", 6,
        [
            [CARRY, CARRY, MOVE, MOVE], //200 (startup creep)
            [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //300
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //350
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //400
            [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //500
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //550
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //800 (10 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //1050 (15 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //1300 (20 extensions)
        ],
        {
            priority: 6,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );

    defineUnit("CreepBuilder", 3,
        [ //TODO define body arrays for Builder
            [WORK, CARRY, MOVE], //200 (startup creep)
            [WORK, WORK, CARRY, MOVE], //300
            [WORK, WORK, CARRY, MOVE, MOVE], //350
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],//400
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],//500
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],//550
            [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//800
            [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],//1050
            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],//1500
            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]//1800 + 25 parts

        ],
        {
            priority: 3,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );

    defineUnit("CreepRoadMaintainer", 1,
        [
            [WORK, CARRY, MOVE], //200 (startup creep)
            [WORK, WORK, CARRY, MOVE], //300
            [WORK, WORK, CARRY, MOVE, MOVE], //350
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE],//400
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],//500
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],//550
            [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//800
            [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],//1050
            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],//1500
            [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]//1800 + 25 parts

        ],
        {
            priority: 7,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );


    defineUnit("CreepCourier", 1,
        [
            [CARRY, CARRY, MOVE, MOVE], //200 (startup creep)
            [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //300
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], //350
            [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //400
            [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //500
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //550
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //800 (10 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], //1050 (15 extensions)
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //1300 (20 extensions)
        ],
        {
            priority: 4,
            purpose: CREEP_TYPE.SUPPORT
        },
        this.roomName
    );

    defineUnit("CreepRampartDefender", 0,
        [
            [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK], //400
            [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], //550
            [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE], //600
            [MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE], //800
            [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE] //1050
        ],
        {
            priority: 4,
            purpose: CREEP_TYPE.DEFENSE
        },
        this.roomName
    );
};

CreepDictionary.prototype.setTargetCount = function(role,count){
    if(typeof Memory.rooms[this.roomName].unitDictionary[role] === 'undefined'){
        console.log('Role (' + role + ') does not exist.  Unable to set count');
    }
    Memory.rooms[this.roomName].unitDictionary[role].targetCount = count;
};

CreepDictionary.prototype.getTargetCount = function(role){
    return Memory.rooms[this.roomName].unitDictionary[role].targetCount;
};



function defineUnit(unitType, targetCount, body, options, room) {
    console.log(room);
    if (typeof Memory.rooms[room].unitDictionary === 'undefined') {
        Memory.rooms[room].unitDictionary = {};
    }

    if (options === undefined) {
        console.log('YOU FORGOT TO DEFINE OPTIONS FOR ' + unitType);
        return;
    }

    options.role = unitType;
    options.unitType = unitType;
    options.homeRoom = room;

    Memory.rooms[room].unitDictionary[unitType] = {
        targetCount: targetCount,
        body: body,
        options: options
    };
}

module.exports = CreepDictionary;

/* BODY PART SIZES
 TOUGH: 10
 MOVE: 50
 CARRY: 50
 ATTACK: 80
 WORK: 100
 RANGED_ATTACK: 150
 HEAL: 250
*/
//console.log('unitDictionary defined (length): ' + Memory.unitDictionary.length);
