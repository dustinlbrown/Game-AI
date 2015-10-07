var global = require('global');

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
    return this.memory.homeRoom;
};


Creep.prototype.getNearestSpawn = function() {
    return this.pos.findClosestByRange(FIND_MY_SPAWNS);
};

Creep.prototype.getSpawn = function() {
    return Game.getObjectById(this.memory.spawnedAt.id);
};


Creep.prototype.getSources = function() {
    return this.room.find(FIND_SOURCES);
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

Creep.prototype.getRemoteMiningFlags = function(){
    return global.getRemoteMiningFlags();
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

Creep.prototype.getNearestController = function() {
    return this.room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTROLLER }
    })[0];
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

Creep.prototype.moveToTargetRoomIfSet = function() {
    if (this.memory.targetRoom != undefined && this.memory.targetRoom != this.room.name && !this.spawning) {
        var exitDir = this.room.findExitTo(this.memory.targetRoom);
        var exit = this.room.find(exitDir);
        if (exit.length > 0) {
            this.moveMeTo(exit[0]);
        }
    }
};
Creep.prototype.moveToHomeRoomIfSet = function() {
    if (this.memory.homeRoom != undefined && this.memory.homeRoom != this.room.name && !this.spawning) {
        var exitDir = this.room.findExitTo(this.memory.homeRoom);
        var exit = this.room.find(exitDir);
        if (exit.length > 0) {
            this.moveMeTo(exit[0]);
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
    var link = _.filter(structures,{structureType: STRUCTURE_LINK});
    if (link.length){
        for (var i in link){
            if (this.pos.inRangeTo(link[i],2)){
                if(link[i].energy > 0){
                    target = link[i];
                }
                break;
            }
        }
    }

    var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});

    if (storage.length) {
        storage = _.filter(storage, function (r) {
            return r.store.energy > 0;
        });
    }

    if (storage.length){
        target = storage[0];
    }

    //We don't have storage, or it's empty.
    if (typeof target === 'undefined') {
        var extensions = _.filter(structures, {structureType: STRUCTURE_EXTENSION});

        var filledExtensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });
        if (filledExtensions.length) {
            target = this.pos.findClosestByRange(filledExtensions);
        }
    }
    //if we still don't have a target and we don't have too many extensions, we'll borrow from the spawn
    if (typeof target === 'undefined' && extensions.length < 1) {
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
            var storage = _.filter(structures,{structureType: STRUCTURE_STORAGE});
            if (storage.length) {

                storage = _.filter(storage, function (r) {
                    return r.store.energy < r.storeCapacity;
                });
            }

            if (storage.length){
                target = storage[0];
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

Creep.prototype.findEnergy = function(isTargetStorage, room){
    //console.log(room);
    if(room === undefined){
        room = this.room;
    }

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
        isTargetStorage = isTargetStorage || false;
        if(isTargetStorage === false){
            target = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}})[0];
            if (target.store.energy > 0){
                this.moveTo(target);
                target.transferEnergy(this);
            }
        }else{
            console.log(this.name + ': Target is storage');
        }
    }
    return target;
    //}
};


Creep.prototype.assignStructure = function (structureClass, structure) {
    //console.log('assignStructure ' + structure);
    var structureId = (typeof structure == 'object') ? structure.id : structure;
    global.initStructureAssignments(structureClass);
    this.unassignCreep(structureClass);
    Memory.assignedStructures[structureClass][structureId] = this.getRoleId();
    //console.log("assigned " + this.memory.roleId + " to " +structure.id);
    return structureId;
};

Creep.prototype.getStructureAssignedToCreep = function (structureClass) {
    global.initStructureAssignments(structureClass);
    //console.log(structureClass);
    for (var i in Memory.assignedStructures[structureClass]) {
        if (Memory.assignedStructures[structureClass][i] === this.getRoleId()){
            Game.getObjectById(i);
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
