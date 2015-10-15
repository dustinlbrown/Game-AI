/**
 * Created by Dustin on 10/15/2015.
 */
'use strict';

Flag.prototype.isFlag = true;

Flag.prototype.role = function(role) {
    if (role !== void 0) {
        this.memory.role = role;
    }
    return this.memory.role;
};

Flag.prototype.sourceId = function(id) {

    if (id !== void 0) {
        this.memory.source_id = id;
    } else if(this.memory.source_id === undefined){
        var sources = this.pos.lookFor('source');
        if(sources.length){
            this.memory.source_id = sources[0].id;
        }
    }
    return this.memory.source_id;
};

Flag.prototype.source = function(source) {

    if (source !== undefined) {
        this.sourceId(source.id);
    }
    return Game.getObjectById(this.sourceId());
};

// the max number of harvesters that can be assigned to this source
Flag.prototype.minerCountMax = function(value) {

    if(this.memory.harvester_count_max === undefined){
        this.memory.harvester_count_max = 1;
    }
    if (value !== undefined) {
        this.memory.harvester_count_max = value;
    }
    return this.memory.harvester_count_max;
};

Flag.prototype.carrierCountMax = function(value) {

    if(this.memory.carrier_count_max === undefined){
        this.memory.carrier_count_max = 3;
    }
    if (value !== undefined) {
        this.memory.carrier_count_max = value;
    }
    return this.memory.carrier_count_max;
};

Flag.prototype.creepsByRole = function(role){
    if(typeof this.memory.occupants === 'undefined'){
        this.memory.occupants = {};
        this.memory.occupants[role] = [];
        return 0;
    }
    if(typeof this.memory.occupants[role] === 'undefined'){
        this.memory.occupants[role] = [];
        return 0;
    }

    this.unassignDeadCreeps();

    return this.memory.occupants[role].length
};

Flag.prototype.assignCreep = function(creep){
    if(typeof this.memory.occupants === 'undefined'){
        this.memory.occupants = {};
        this.memory.occupants[creep.getRole()] = [];
    }
    if(typeof this.memory.occupants[creep.getRole()] === 'undefined'){
        this.memory.occupants[creep.getRole()] = [];
    }

    this.memory.occupants[creep.getRole()].push(creep.id);
    return this.id;
};

Flag.prototype.unassignDeadCreeps = function(){
    if(typeof this.memory.occupants === 'undefined'){
        this.memory.occupants = {};
    }

    for(var role in this.memory.occupants){
        if(!this.memory.occupants[role].length){
            this.memory.occupants[role] = [];
        }
        //console.log('---- Name ' + this.name );
        for(var id in this.memory.occupants[role]) {
            //console.log('deleting: ' + Game.getObjectById(this.memory.occupants[role][id]));
            if (Game.getObjectById(this.memory.occupants[role][id]) == null) {
                console.log('deleting: ' + this.memory.occupants[role][id]);
                //console.log('deleting: ' + this.pos.roomName);
                this.memory.occupants[role].splice(id, 1);
            }
        }
    }
};