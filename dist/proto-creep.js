var global = require('global');
var profiler = require('util-profiler');
//Energy Related Functions

//TODO 
//


Creep.prototype.setRole = function(role){
    this.memory.role = role;
};

Creep.prototype.getRole = function(){
    return this.memory.role;
};


Creep.prototype.getRoleId = function(){
    if (this.memory.roleId === undefined){
        console.log('Creep RoleId: ' + this.name.substr(this.name.length - 1));
        this.memory.roleId = Number(this.name.substr(this.name.length - 1));
    }
    return this.memory.roleId;
};

Creep.prototype.setTargetRoom = function(room) {
    //console.log(room);
    this.memory.targetRoom = room;
};

Creep.prototype.getTargetRoom = function() {
    return this.memory.targetRoom;
};

Creep.prototype.setHomeRoom = function(room) {
    this.memory.homeRoom = room;
};

Creep.prototype.getHomeRoom = function() {
    if(typeof this.memory.homeRoom === 'undefined'){
        this.memory.homeRoom = this.room.name;
    }
    return this.memory.homeRoom;
};


Creep.prototype.getNearestSpawn = function() {
    return this.pos.findClosestByRange(FIND_MY_SPAWNS);
};

Creep.prototype.getSpawn = function() {
    return Game.getObjectById(this.memory.spawnedAt.id);
};


Creep.prototype.getSources = function(room) {
    if (typeof room === 'undefined'){
        room = this.room;
        //console.log('getSources: room ' + room);
    }

    if(typeof room.memory.sources === 'undefined'){
        room.memory.sources = [];
        var roomSources = room.find(FIND_SOURCES);
        for(var i in roomSources){
            room.memory.sources.push(roomSources[i])
        }

    }

    return room.memory.sources;
};

Creep.prototype.setSourceOccupant = function(sourceId){
    var sources = this.room.memory.sources;
    for (var i in sources){
        if (this.room.memory.sources[i].id == sourceId) {

            if(!this.room.memory.sources[i][this.getRole() + 'Id']){
                this.room.memory.sources[i][this.getRole() + 'Id'] = [];
            }
            this.room.memory.sources[i][this.getRole() + 'Id'].push(this.id);
            break;
        }
    }

    return sourceId;
};

Creep.prototype.getSourceFlags = function(){
    return global.getSourceFlags();
};

Creep.prototype.transferToControllerLink = function (link) {
    var controllerLink = this.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_LINK}
    });

    if (controllerLink.id != link.id && controllerLink.energy < controllerLink.energyCapacity) {
        link.transferEnergy(Game.getObjectById(controllerLink.id));
    }

};

Creep.prototype.getSourceOccupants = function(sourceId, room, role){
    this.clearDeadCreeps();
    if (room === undefined){
        room = this.room;
    }
    if (role === undefined){
        role = this.getRole();
    }

    //console.log('getSourcesOccupants: room ' + room.memory.sources.length);
    for (var i in room.memory.sources){
        if (room.memory.sources[i].id != sourceId) {
            //console.log('no source');

        } else {
            if (!room.memory.sources[i][role + 'Id']){
                room.memory.sources[i][role + 'Id'] = [];
            }
            //console.log(room.memory.sources[i][role + 'Id']);
            return room.memory.sources[i][role + 'Id'];
        }
    }
    //console.log(this.room.memory.sources[i]);

};

Creep.prototype.getNearToLink = function() {
    return this.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: {structureType: STRUCTURE_LINK}
    })[0];
}

Creep.prototype.getController = function() {
    return this.room.controller;
};

Creep.prototype.getNearestStorage = function() {
    return this.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    })[0];
};

Creep.prototype.onAgeOut = function(){

};

Creep.prototype.clearDeadCreeps = function(){
    for(var i in this.room.memory.sources){
        for(var j in this.room.memory.sources[i][this.getRole() + 'Id']){
            if(Game.getObjectById(this.room.memory.sources[i][this.getRole() + 'Id'][j]) == null){
                console.log('deleting: ' +  this.room.memory.sources[i][this.getRole() + 'Id'][j]);
                this.room.memory.sources[i][this.getRole() + 'Id'].splice(j,1);
            }
        }
    }
};

Creep.prototype.moveToTargetRoomIfSet = function(opts) {
    if (this.memory.targetRoom != undefined && this.memory.targetRoom != this.room.name && !this.spawning) {
        var exitDir = this.room.findExitTo(this.memory.targetRoom);
        var exit = this.pos.findClosestByPath(exitDir);
        if (exit) {
            this.moveMeTo(exit,opts);
        }
    }
};
Creep.prototype.moveToHomeRoomIfSet = function(opts) {
    if (this.memory.homeRoom != undefined && this.memory.homeRoom != this.room.name && !this.spawning) {
        var exitDir = this.room.findExitTo(this.memory.homeRoom);
        var exit = this.pos.findClosestByPath(exitDir);
        if (exit) {
            this.moveMeTo(exit,opts);
        }
    }
};

Creep.prototype.moveMeTo = function(object, opts) {
    var ret = this.moveTo(object, opts);

    if (ret == ERR_NO_PATH) {
        var builders = this.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: function (c) { return ( c.memory.role=='CreepBuilder' || c.memory.role=='CreepCourier'); }
        });
        if (builders.length > 0) {
            var builder = Math.floor(Math.random()*builders.length);
            //console.log(this.name + " moving builder " + builders[0]);
            var builderPos = builders[builder].pos;
            builders[builder].moveTo(this.pos.x, this.pos.y);
            return this.moveTo(builderPos.x, builderPos.y);
        }
    }
    return ret;
};


Creep.prototype.hasCarryCapacity = function() {
    return this.carryCapacity > this.carry.energy;
};


Creep.prototype.withdrawEnergy = function() {
    var structures = this.room.find(FIND_MY_STRUCTURES);
    var target; //undefined
    var hasStorage = false;
    var link = _.filter(structures,{structureType: STRUCTURE_LINK});
    if (link.length){
        for (var i in link){
            if (this.pos.isNearTo(link[i])){
                if(link[i].energy > 0){
                    target = link[i];
                }
                break;
            }
        }
    }

    if(typeof target === 'undefined'){
        //var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
        var storage = this.room.storage;

        if (typeof storage !== 'undefined' ){
            hasStorage = true;
            if (storage.store.energy > 0) {
                target = storage;
            }
        }

    }

    //We don't have storage, or it's empty.
    if (typeof target === 'undefined' && !hasStorage) {
        var extensions = _.filter(structures, {structureType: STRUCTURE_EXTENSION});

        var filledExtensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });
        if (filledExtensions.length) {
            target = this.pos.findClosestByRange(filledExtensions);
        }
    }
    //if we still don't have a target and we don't have too many extensions, we'll borrow from the spawn
    if (typeof target === 'undefined' && _.filter(structures, {structureType: STRUCTURE_EXTENSION}).length < 1 && !hasStorage) {
        var spawns = _.filter(structures, {structureType: STRUCTURE_SPAWN});
        if (spawns.length){
            target = spawns[0];
        }

        //first spawn is fine as we'll never take from it by the time we have 2
    }

    if (typeof target !== 'undefined') { //todo figure out why we move to a target we don't have....
        this.moveTo(target);
        target.transferEnergy(this);
        this.memory.withdrawalSource = target.structureType;
        if(this.carry.energy === this.carryCapacity){this.memory.action = ACTION.CONSTRUCTION;}
    }

    return target;
};

Creep.prototype.depositEnergy = function() {
    var target = undefined;

    var structures = this.room.find(FIND_MY_STRUCTURES);

    //Check Spawn Energy
    var spawns = _.filter(structures,{structureType: STRUCTURE_SPAWN});
    spawns = _.filter(Game.spawns, function (r) {
        return r.energy < r.energyCapacity;
    });

    if (spawns.length) {
        target = this.pos.findClosestByRange(spawns);
    }

    //Check Extension Energy
    if (typeof target === 'undefined'){
        var extensions = _.filter(structures,{structureType: STRUCTURE_EXTENSION});
        extensions = _.filter(extensions, function (r) {
            return r.energy < r.energyCapacity;
        });

        if (extensions.length) {
            target = this.pos.findClosestByRange(extensions);
        }
    }


    if (typeof target === 'undefined'){
        //Check Link Energy
        var links = _.filter(structures,{structureType: STRUCTURE_LINK});

        links = _.filter(links, function (r) {
            return r.energy < r.energyCapacity;
        });

        if (links.length) {
            target = this.pos.findClosestByPath(links);
        }
    }

    if (typeof target === 'undefined'){
        //Check Storage Energy
        if (this.memory.withdrawalSource !== STRUCTURE_STORAGE){

            //var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
            var storage = this.room.storage;
            //console.log(storage);
            if (typeof storage !== 'undefined' && storage.store.energy < storage.storeCapacity) {
                target = storage;
            }
        }
    }

    //We hopefully have a target, now lets get it!
    if (typeof target !== 'undefined'){
        this.moveMeTo(target);
        this.transferEnergy(target);
        //this.memory.withdrawalSource = undefined;
    }
};

Creep.prototype.assignedCreep = function(creepId){
    //TODO Finish this!!!!
    var assignedCreep = this.memory.assignedCreep;
    if(typeof assignedCreep === 'undefined' || !Game.getObjectById(assignedCreep)){
        //find a creep to assign
        var miners =[];
        for(var creep in Game.creeps){
            if (Game.creeps[creep].memory.homeRoom === this.room.name && Game.creeps[creep].memory.role === 'CreepMiner'){
                miners.push(Game.creeps[creep])
            }
        }
    }

    return assignedCreep;
};

Creep.prototype.energyTarget = function(target){
    //if (typeof this.memory.energyTarget === 'undefined'){
    //    this.memory.energyTarget = {};
    //}
    if(typeof target === 'undefined'){
        return this.memory.energyTarget;
    }

    this.memory.energyTarget = target;
    return this.memory.energyTarget;
};

Creep.prototype.findEnergy = function(isTargetStorage, room){
   //profiler.openProfile('Creep.prototype.findEnergy');
    //console.log(room);
    if(typeof room === 'undefined'){
        room = this.room;
    }

    //TODO finish this part
    //if(this.getRole === 'CreepCarrier'){
    //    this.getAssignedCreepId
    //}

    //console.log(this.name);

    var energy = room.find(FIND_DROPPED_ENERGY);
    var target = undefined;
    // collect

    if (energy !== undefined) {
        var targetEnergyIndex = false;

        if(energy.length > 1){
            energy.sort(function (a, b) {
                return b.energy - a.energy
            });
            for (var i = 0; i < 2; i++) {
                if (!energy[i]) {
                    continue
                }
                if (this.pos.inRangeTo(energy[i], 8)) {
                    targetEnergyIndex = i;
                    break;
                }
            }

        }

        if (targetEnergyIndex === true) {
            target = energy[targetEnergyIndex]
        }else{
            target = energy[0];
        }
        //var closestEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);

        this.moveTo(target);
        this.pickup(target);

    } else{
        if (typeof isTargetStorage === 'undefined'){
            isTargetStorage = false;
        }
        if(isTargetStorage === false){
            target = this.room.storage;
            if (target.store.energy > 0){
                this.moveTo(target);
                target.transferEnergy(this);
            }
        }else{
            console.log(this.name + ': Target is storage');
        }
    }
   // profiler.closeProfile('Creep.prototype.findEnergy');
    //profiler.showProfiles();
    return target;
    //}
};

Creep.prototype.assignFlag = function(){

    //console.log(room);
    var sourceFlags = global.getSourceFlags();
    for (flag in sourceFlags){
        //TODO TEMPORARY FIX
        if(sourceFlags[flag].creepsByRole('CreepMiner') === 0  && sourceFlags[flag].creepsByRole('CreepRemoteMiner') === 0){
            this.memory.targetFlag = sourceFlags[flag].assignCreep(this);
            this.memory.targetRoom = sourceFlags[flag].pos.roomName;
            break;
        }
    }

};


Creep.prototype.assignStructure = function (structureClass, structure) {
    //console.log('assignStructure ' + structure);
    var structureId = (typeof structure == 'object') ? structure.id : structure;
    global.initStructureAssignments(structureClass);
    this.unassignCreep(structureClass);
    Memory.assignedStructures[structureClass][structure.id] = this.getRoleId();
    //console.log("assigned " + this.memory.roleId + " to " +structure.id);
    return structure.id;
};

Creep.prototype.getStructureAssignedToCreep = function (structureClass) {
    global.initStructureAssignments(structureClass);
    //console.log(structureClass);
    for (var i in Memory.assignedStructures[structureClass]) {
        if (Memory.assignedStructures[structureClass][i] === this.getRoleId()){
            //console.log('StructureAssigned to Creep: '+i + ' RoleId: ' + this.getRoleId());
            return Game.getObjectById(i);
        }
    }
    return undefined;
};

Creep.prototype.unassignCreep = function (structureClass) {
    global.initStructureAssignments(structureClass);
    for (var i in Memory.assignedStructures[structureClass]) {
        if (Memory.assignedStructures[structureClass][i] === this.getRoleId()){
            Memory.assignedStructures[structureClass][i] = undefined;
        }
    }
    return undefined;
};

/*
*
*  COPIED THIS SECTION....MAKE IT WORK FOR ME NOW
*
 */

Creep.prototype.isCreep = true;


Creep.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

// if this creep's role needs energy delivered
Creep.prototype.roleNeedsEnergy = function(){
    var role = this.role();
    if(rolesMeta.roles[role] !== undefined){
        return rolesMeta.roles[role].needs_energy_delivered;
    }
};

Creep.prototype.idle = function() {
    var job = this.job();
    var type;
    if(job){
        type = job.type();
    }
    return !job || type === 'idle';
};

Creep.prototype.jobId = function(id) {
    if(id !== void 0){
        this.memory.source_of_job_id = id;
    }
    return this.memory.source_of_job_id;
};

Creep.prototype.job = function(job) {
    if (job !== void 0) {
        this.jobId(job.id);
    }
    var jobId = this.jobId();
    if(!jobId){
        return false;
    }
    return this.room.jobList().get(jobId);
};

Creep.prototype.clearJob = function() {
    this.memory.source_of_job_id = undefined;
};

// if this creep has been replaced because it is about to die
Creep.prototype.replaced = function(replaced) {
    if (replaced !== undefined) {
        // remove to save memory
        if(!replaced){
            replaced = undefined;
        }
        this.memory.replaced = replaced;
    }
    return this.memory.replaced;
};

Creep.prototype.adjacentHostiles = function(filter) {
    var pos = this.pos;
    var top = pos.y - 1;
    var bottom = pos.y + 1;
    var left = pos.x - 1;
    var right = pos.y + 1;

    var result = this.room.lookForAtArea('creep', top, left, bottom, right);

    var targets = [];

    for(var x in result){
        var row = result[x];
        for(var y in row){
            var target = row[y];
            if(
                target &&
                !target.my
            ){

                targets.push(target);
            }
        }
    }

    if(filter){
        targets = targets.filter(filter);
    }
    return targets;
};

Creep.prototype.hurtLastTick = function(){
    return this.hits < this.memory.prev_hits;
};

Creep.prototype.attackDamage = function(){
    var parts = this.getActiveBodyparts(ATTACK);
    // ATTACK_POWER is undocumented
    return parts * (ATTACK_POWER || 30);
};

Creep.prototype.rangedAttackDamage = function(){
    var parts = this.getActiveBodyparts(RANGED_ATTACK);
    // RANGED_ATTACK_POWER is undocumented

    return parts * (RANGED_ATTACK_POWER || 10);
};

Creep.prototype.toString = function(){
    return '[creep ' + this.name + ': ' + this.role() + ']';
};


// true if creep can currently pick and have room to carry energy
Creep.prototype.energyCanCarryMore = function(){
    return (
        // make sure creep can carry at all
        this.carryCapacity &&
        this.carry.energy < this.carryCapacity
    );
};