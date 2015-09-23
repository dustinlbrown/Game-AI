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
Creep.prototype.onAgeOut = function(){

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

Creep.prototype.getNearestSpawn = function() {
    return this.pos.findClosestByRange(FIND_MY_SPAWNS);
};


Creep.prototype.setTargetRoom = function(room) {
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

Creep.prototype.hasCarryCapacity = function() {
    return this.carryCapacity > this.carry.energy;
};

Creep.prototype.getSpawn = function() {
    return Game.getObjectById(this.memory.spawnedAt.id);
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

//miner specifics
Creep.prototype.assignMine = function (roomName) {
    global.initMineAssignments(roomName);

    // See if this creep is already assigned
    for (var i in Memory.assignedMines[roomName]){
        if (Memory.assignedMines[roomName][i] == this.memory.roleId) {
            console.log(this.name + " Already assigned to mine");
            this.memory.assignedMine = i;
            return true;
        }
    }

    var initialRoom = Game.rooms[roomName];
    var roomsToCheck = [roomName];
    // Look for mining flags in the room to find other rooms to check
    if (this.memory.assignedMine == undefined) {
        var flags = initialRoom.find(FIND_FLAGS, {filter: {color:COLOR_YELLOW}});
        for (var i in flags) {
            var adjacentRoomName = flags[i].name;
            roomsToCheck.push(adjacentRoomName);
        }
    }

    // @TODO - Big problem here.. Can't get room data unless we have a creep in the room...
    // Out of all rooms to check, find an open source
    var assignedInRoom = undefined;
    for (var roomIndex in roomsToCheck) {
        var checkRoom = Game.rooms[roomsToCheck[roomIndex]];
        //console.log(checkRoom + " - " + roomsToCheck[roomIndex] + " -  " + roomIndex);
        if (checkRoom == undefined) {
            console.log("Could not look up room data from "+roomsToCheck[roomIndex] + ", unable to assign miner "+this.name);
            return false;
        }

        var sources = checkRoom.find(FIND_SOURCES);
        for (var i in sources) {
            if (Memory.assignedMines[roomName][sources[i].id] == undefined) {
                Memory.assignedMines[roomName][sources[i].id] = this.memory.roleId;
                this.memory.assignedMine = sources[i].id;
                console.log("Assigned " + this.name + " to mine " +this.memory.assignedMine + " in room " + checkRoom.name);
                return true;
            }

        }
    }
    console.log("Unable to assign " + this.name +", not enough mines");
    return false;
};
Creep.prototype.withdrawEnergy = function() {
	var structures = this.room.find(FIND_MY_STRUCTURES);
    var target; //undefined
    var link = _.filter(structures,{structureType: STRUCTURE_LINK});
    if (link.length){
        for (var i in link){
            if (this.pos.inRangeTo(link,1)){
                target = link[i];
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

        extensions = _.filter(extensions, function (r) {
            return r.energy > 0;
        });
        if (extensions.length) {
            target = this.pos.findClosestByRange(extensions);
        }
    }
    //if we still don't have a target and we don't have too many extensions, we'll borrow from the spawn
    if (target === undefined && extensions.length < 5) {
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
	var target;

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
     	   target = this.pos.findClosestByPath(extensions);
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
        this.moveTo(target);
        this.transferEnergy(target);
        //this.memory.withdrawalSource = undefined;
    }
};
Creep.prototype.findEnergy = function(isTargetStorage){

    var energy = this.room.find(FIND_DROPPED_ENERGY);
    // collect

    if (energy) {
        energy.sort(function (a, b) {
            return b.energy - a.energy
        });

        //Check if the first 3 energy objects are close (within 8)
        var targetEnergyIndex = false;
        for (var i = 0; i < 2; i++) {
            if (!energy[i]){continue};
            if (this.pos.inRangeTo(energy[i], 8)) {
                targetEnergyIndex = i;
                break;
            }
        }

        if (targetEnergyIndex === true) {
            this.moveTo(energy[targetEnergyIndex]);
            this.pickup(energy[targetEnergyIndex]);
            return;
        }

        //var closestEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        this.moveTo(energy[0]);
        this.pickup(energy[0]);

    } else{
        isTargetStorage = isTargetStorage || false;
        if(isTargetStorage === false){
            var target = this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
            if (target.length && target[0].store.energy > 0){
                this.moveTo(target[0]);
                target[0].transferEnergy(this);
            }else{
                //Storage has not yet  been built, or is empty.
            }
        }else{
            console.log(this.name + ': Target is storage');
        }
    }
    //}
};

Creep.prototype.getRoleId = function(){
    if (this.memory.roleId === undefined){
        console.log('Creep RoleId: ' + this.name.substr(this.name.length - 1));
        this.memory.roleId = Number(this.name.substr(this.name.length - 1));
    }
    return this.memory.roleId;
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
