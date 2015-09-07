function defineUnit(unitType, targetCount, body, options)
{
    if(Memory.unitDictionary === undefined)
    {
        Memory.unitDictionary = {};
    }

    if(options === undefined)
    {
        console.log('YOU FORGOT DO DEFINE OPTIONS FOR ' + unitType);
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
defineUnit("CreepHarvester", 4,
    [
        [WORK, CARRY, MOVE], //200 (startup creep)
        [WORK, WORK, CARRY, MOVE], //300
        [WORK, WORK, CARRY, MOVE, MOVE], //350
        [WORK, WORK, WORK, CARRY, MOVE], //400
        [WORK, WORK, WORK, WORK, CARRY, MOVE], //500
        [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], //550 (or a spawn and 5 extensions)
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //800
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //850 - Biggest harvester we'll need
    ],
    {
        role: 'CreepHarvester',
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
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //1300 (20 extensions)
    ],
    {
        role: 'CreepCarrier',
        priority: 1
    }
);

defineUnit("CreepBuilder", 4,
    [ //TODO define body arrays for Builder
        [WORK, CARRY, MOVE], //200 (startup creep)
        [WORK, WORK, CARRY, MOVE], //300
        [WORK, WORK, CARRY, MOVE, MOVE], //350
        [WORK, WORK, CARRY, CARRY, MOVE, MOVE],//400
        [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],//500
        [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],//550
        [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//800
        [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]//1050
        //1300
    ],
    {
        role: 'CreepBuilder',
        priority: 3
    }
);

defineUnit("CreepCourier", 3,
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

defineUnit("CreepRemoteHarvester", 2,
    [
        [WORK, CARRY, MOVE], //200 (startup creep)
        [WORK, WORK, CARRY, MOVE], //300
        [WORK, WORK, CARRY, MOVE, MOVE], //350
        [WORK, WORK, WORK, CARRY, MOVE], //400
        [WORK, WORK, WORK, WORK, CARRY, MOVE], //500
        [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], //550 (or a spawn and 5 extensions)
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], //800
        [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //850 - Biggest harvester we'll need
    ],
    {
        role: 'CreepRemoteHarvester',
        priority: 5
    }
);

defineUnit("CreepRemoteCarrier", 4,
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


console.log('unitDictionary defined (length): ' + Memory.unitDictionary.length);
//defineUnit("CreepCarrier", [CARRY, CARRY, MOVE, MOVE], {role: 'CreepCarrier', priority: 0.5});
//defineUnit("CreepHarvester", [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'balancer', priority: 1});
//
//defineUnit("microMiner", [WORK, WORK, CARRY, MOVE], {role: 'miner', priority: 2});
//defineUnit("miniMiner", [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], {role: 'miner', priority: 2});
//defineUnit("miner", [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], {role: 'miner', priority: 2});
//defineUnit("speedyMiner", [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'miner', priority: 2});
//
//defineUnit("microHauler", [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], {role: 'hauler', priority: 2});
//defineUnit("miniHauler", [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], {role: 'hauler', priority: 2});
//defineUnit("hauler", [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'hauler', priority: 2});
//
//defineUnit("roadMan", [WORK, CARRY, CARRY, MOVE, MOVE, MOVE], {role: 'roadMan'});
//defineUnit("builder", [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'builder'});
//defineUnit("repairMan", [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'repairMan'});
//
//defineUnit("microMaid", [WORK, CARRY, MOVE, MOVE], {role: 'cleaningLady', priority: 4});
//defineUnit("miniMaid", [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], {role: 'cleaningLady', priority: 4});
//defineUnit("cleaningLady", [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'cleaningLady', priority: 4});
////defineUnit("cleaningLady", [WORK, CARRY, MOVE], {role: 'cleaningLady', priority: 4});
//
//defineUnit("roomUpgrader2", [WORK, WORK, CARRY, MOVE], {role: 'roomUpgrader', priority: 4});
//defineUnit("roomUpgrader3", [WORK, WORK, WORK, CARRY, MOVE], {role: 'roomUpgrader', priority: 4});
//defineUnit("roomUpgrader6", [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], {role: 'roomUpgrader', priority: 4});
//defineUnit("roomUpgrader9", [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], {role: 'roomUpgrader', priority: 4});
//defineUnit("roomUpgrader12", [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], {role: 'roomUpgrader', priority: 4});
//defineUnit("roomUpgrader15", [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], {role: 'roomUpgrader', priority: 4});
//defineUnit("roomUpgrader18", [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], {role: 'roomUpgrader', priority: 4});
//
//defineUnit("upgradeFeeder", [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], {role: 'upgradeFeeder', priority: 4});
//defineUnit("miniUpgradeFeeder", [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], {role: 'upgradeFeeder', priority: 4});
//
//
//////***REMOTE UNITS***////
//defineUnit('remoteMinerStd', [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'remoteMiner'});
//defineUnit("remoteMinerLite", [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'remoteMiner'});
//defineUnit("remoteMinerMini", [WORK, CARRY, CARRY, MOVE], {role: 'remoteMiner'});
//
//defineUnit("energyRetriever", [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'energyRetriever'});
//defineUnit("remoteBuilderStd", [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], {role: 'remoteBuilder', priority: 1.5});
//
//
//////***COMBAT UNITS***////
//defineUnit("brawler", [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], {role: 'warrior', priority: 1.5});
//defineUnit("batteringRam", [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], {role: 'warrior', priority: 1.5});
//defineUnit("medic", [HEAL, HEAL, HEAL, MOVE, MOVE, MOVE], {role: 'medic', priority: 1.5});
//defineUnit("rampartDefender", [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,], {role: 'rampartDefender', priority: 1.5});
//defineUnit("littleScout", [TOUGH, MOVE], {role: 'scout', priority: 1.5});
//defineUnit("bigScout", [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE], {role: 'scout', priority: 1.5});
//defineUnit("combatMedic", [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, RANGED_ATTACK, ATTACK, RANGED_ATTACK, HEAL, MOVE], {role: "combatMedic", priority: 1.5});
//
//////***OTHER***////
//defineUnit('tempCreep', [MOVE, CARRY], {role: 'pipeSegment'});
//defineUnit('pipeSegment', [MOVE, CARRY], {role: 'pipeSegment', priority: 2});
//defineUnit('roomTrader', [MOVE], {role: 'roomTrader', priority: 1});
