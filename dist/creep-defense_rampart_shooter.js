function CreepRampartDefender(creep) {
    this.creep = creep;
}
CreepRampartDefender.prototype.init = function () {
    this.creep.memory.role = 'CreepRampartDefender';
    if (!this.creep.memory.homeRoom) {
        this.creep.memory.homeRoom = this.creep.room.name;
    }
    this.creep.memory.targetRoom = false;
    //if (this.moveToNewRoom() == true) {
    //    return;
    //}
    this.enemyArray = this.creep.room.find(FIND_HOSTILE_CREEPS);
    this.act();
};

CreepRampartDefender.prototype.act = function () {


    if (this.creep.memory.assignedRampartId === undefined) {
        // find unassigned rampart
        this.creep.memory.assignedRampartId = chooseRampart(this.creep, this.enemyArray);
    }

    var assignedRampart = Game.getObjectById(this.creep.memory.assignedRampartId);
    if (assignedRampart === null) {
        //idleTask.doTask(creep, 'RampartRally');
    }
    else if (this.creep.pos.x !== assignedRampart.pos.x || this.creep.pos.y !== assignedRampart.pos.y) {
        this.creep.moveTo(assignedRampart);
    }

    var hostileCreeps = this.creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

    if (hostileCreeps.length > 1) this.creep.rangedMassAttack();
    else if (hostileCreeps.length === 1) this.creep.rangedAttack(hostileCreeps[0]);

    if (typeof Memory.mostRecentAttacker === 'undefined' || Memory.mostRecentAttacker === '') {
        Memory.mostRecentAttacker = hostileCreeps[0].owner.username;
    }
};

function chooseRampart(creep, enemyArray) {
    var unassignedRampartArray = getUnassignedRamparts(creep.room);

    if (unassignedRampartArray.length === 0) {
        return null;
    }

    //get array of unassigned ramparts
    //pick an enemy at random
    //find rampart closest to that enemy

    var randomEnemyIndex = Math.floor(Math.random() * enemyArray.length);
    var randomEnemy = enemyArray[randomEnemyIndex];

    var chosenRampart = randomEnemy.pos.findClosest(unassignedRampartArray);

    if (typeof chosenRampart !== 'undefined') {
        console.log(creep.name + " assigned to " + creep.memory.assignedRampartId);
        return chosenRampart.id;
    }
}

function getUnassignedRamparts(room) {
    var defenders = room.find(FIND_MY_CREEPS, {
        filter: function (c) {
            return c.memory.role == 'CreepRampartDefender' && c.memory.assignedRampartId !== undefined;
        }
    });

    var assignedRampartIds = {};
    for (var i in defenders) {
        assignedRampartIds[defenders[i].memory.assignedRampartId] = true;
    }

    return room.find(FIND_STRUCTURES, {
        filter: function (r) {
            return r.structureType === STRUCTURE_RAMPART && assignedRampartIds[r.id] === undefined;
        }
    });
}

module.exports = CreepRampartDefender;