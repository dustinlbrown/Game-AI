function CreepShooter(creep) {
    this.creep = creep;
};

CreepShooter.prototype.init = function() {
    this.creep.memory.role = 'CreepShooter';
    if(!this.creep.memory.srcRoom) {
        this.creep.memory.srcRoom = this.creep.room.name;
    }
    //if(this.moveToNewRoom() == true) {
    //    return;
    //}

    this.act();
};

CreepShooter.prototype.act = function() {


    if(this.attackHostiles()) {
        console.log('attackHostiles');
        return;
    }
    if(this.attackSpawns()) {
        console.log('attackSpawns');
        return;
    }

    this.creep.moveTo(25,25);
};

CreepShooter.prototype.attackHostiles = function() {
    var targets = this.creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
        // Do something other if targets[0].owner == 'Source Keeper';
        var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(rangedTargets.length > 0) {
            this.creep.rangedAttack(rangedTargets[0]);
            return true;
        }

        this.creep.moveTo(targets[0]);
        return true;
    }
}

CreepShooter.prototype.attackSpawns = function() {
    var targets = this.creep.room.find(FIND_HOSTILE_SPAWNS);
    if(targets.length) {
        var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_SPAWNS, 3);
        if(rangedTargets.length > 0) {
            this.creep.rangedAttack(rangedTargets[0]);
            return true;
        }

        this.creep.moveTo(targets[0]);
        return true;
    }
}




module.exports = CreepShooter;