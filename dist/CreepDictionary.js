function defineUnit(unitType, targetCount, body, options)
{
    if(Memory.unitDictionary === undefined)
    {
        Memory.unitDictionary = {};
    }

    if(options === undefined)
    {
        console.log('YOU FORGOT TO DEFINE OPTIONS FOR ' + unitType);
        return;
    }

    options.unitType = unitType;

    Memory.unitDictionary[unitType] = {
        targetCount: targetCount,
        body: body,
        options: options
    };
}


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
        role: 'CreepMiner',
        priority: 1
    }
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
        role: 'CreepCarrier',
        priority: 1
    }
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
        role: 'CreepRemoteMiner',
        priority: 5
    }
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
        role: 'CreepRemoteCarrier',
        priority: 6
    }
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
        role: 'CreepBuilder',
        priority: 3
    }
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
        role: 'CreepRoadMaintainer',
        priority: 7
    }
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
        role: 'CreepCourier',
        priority: 4
    }
);

console.log('unitDictionary defined (length): ' + Memory.unitDictionary.length);
