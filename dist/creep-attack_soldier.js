function CreepAttackSoldier(creep) {
    this.creep = creep;
    this.maxApproachRange = 7;
}
CreepAttackSoldier.prototype.init = function() {
    this.creep.memory.role = 'CreepAttackSoldier';

    this.act();
};

CreepAttackSoldier.prototype.act = function() {

    if(this.attackHostiles()) { return; }
    if(this.attackSpawns()) { return; }


    this.creep.moveTo(18,33);
};
CreepAttackSoldier.prototype.attackHostiles = function() {
    var targets = this.creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
        this.creep.moveTo(targets[1]);
        this.creep.attack(targets[1]);
        return true;
    }
};
CreepAttackSoldier.prototype.attackSpawns = function() {
    var targets = this.creep.room.find(FIND_HOSTILE_SPAWNS);
    if(targets.length) {
        var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_SPAWNS, 3);
        if(rangedTargets.length > 0) {
            this.creep.rangedAttack(rangedTargets[0]);
        }

        this.creep.moveTo(targets[0]);
        this.creep.attack(targets[0]);
        return true;
    }
};

CreepAttackSoldier.prototype.moveToNewRoom = function() {
    var targetRoom = this.creep.memory.targetRoom;
    var homeRoom = this.creep.memory.homeRoom;

    if(targetRoom) {
        if(targetRoom != this.creep.room.name) {
            var exitDir = this.creep.room.findExitTo(targetRoom);
            var exit = this.creep.pos.findClosestByPath(exitDir);
            this.creep.moveTo(exit);
            return true;
        } else {
            this.creep.moveTo(30,30);
            targetRoom = false;
        }
    } else {
        return false;
    }

};


module.exports = CreepAttackSoldier;