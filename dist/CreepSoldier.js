function CreepSoldier(creep) {
    this.creep = creep;
};

CreepSoldier.prototype.init = function() {
    this.creep.memory.role = 'CreepSoldier';
    if(!this.creep.memory.srcRoom) {
        this.creep.memory.srcRoom = this.creep.room.name;
    }
    this.creep.memory.targetRoom = false;
    if(this.moveToNewRoom() == true) {
        return;
    }

    this.act();
};

CreepSoldier.prototype.act = function() {

    if(this.attackHostiles()) { return; }
    if(this.attackSpawns()) { return; }


    this.creep.moveTo(18,33);
}
CreepSoldier.prototype.attackHostiles = function() {
    var targets = this.creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
        this.creep.moveTo(targets[1]);
        this.creep.attack(targets[1]);
        return true;
    }
}
CreepSoldier.prototype.attackSpawns = function() {
    var targets = this.creep.room.find(FIND_HOSTILE_SPAWNS);
    if(targets.length) {
        var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_SPAWNS, 3);
        if(rangedTargets.length > 0) {
            this.creep.rangedAttack(rangedTargets[0]);
        }

        this.creep.moveTo(targets[0]);
        this.creep.attack(targets[0]);
        return true;
    };
}

CreepSoldier.prototype.moveToNewRoom = function() {
    var targetRoom = this.creep.memory.targetRoom;
    var srcRoom = this.creep.memory.srcRoom;

    if(targetRoom) {
        if(targetRoom != this.creep.room.name) {
            var exitDir = this.creep.room.findExitTo(targetRoom);
            var exit = this.creep.pos.findClosestByPath(exitDir);
            this.creep.moveTo(exit);
            return true;
        } else {
            this.creep.moveTo(30,30);
            var targetRoom = false;
            var srcRoom = this.creep.room.name;
        }
    } else {
        return false;
    }

}

module.exports = CreepSoldier;