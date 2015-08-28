/**
 * Created by Dustin on 8/24/2015.
 */
function Population(room) {
    this.room = room;
    this.population = 0;
    this.populationLevelMultiplier = 8;
    this.typeDistribution = {
            CreepHarvester: {
                total: 0,
                goalPercentage: 0.2,
                currentPercentage: 0,
                max: 4,
                minExtensions: 0
            },
           CreepCarrier: {
               total: 0,
               goalPercentage: 0.3,
               currentPercentage: 0,
               max: 7,
               minExtensions: 0
           },
           CreepBuilder: {
               total: 0,
               goalPercentage: 0.25,
               currentPercentage: 0,
               max: 15,
               minExtensions: 0
           }
    };

    this.creeps = this.room.find(FIND_MY_CREEPS);

    for(var i = 0; i < this.creeps.length; i++) {
        var creepType= this.creeps[i].memory.role;
        if(!this.typeDistribution[creepType]) {
            this.typeDistribution[creepType] = createTypeDistribution(creepType);
        }
        this.typeDistribution[creepType].total++;
    }

    for(var name in this.typeDistribution) {
        var curr = this.typeDistribution[name];
        this.typeDistribution[name].currentPercentage = curr.total / this.getTotalPopulation();
    }

};


Population.prototype.goalsMet = function() {
    for(var n in this.typeDistribution) {
        var type = this.typeDistribution[n];
        if((type.currentPercentage < (type.goalPercentage - type.goalPercentage/4) && type.total < type.max) || type.total == 0  || type.total < type.max*0.75) {
            return false;
        }
    }

    return true;
};

Population.prototype.getType = function(type) {
    return this.typeDistribution[type];
};

Population.prototype.getTypes = function(type) {
    var types = [];
    for(var n in this.typeDistribution) {
        types.push(n);
    }
    return types;
};

Population.prototype.getTotalPopulation = function() {
    return this.creeps.length;
};

Population.prototype.getMaxPopulation = function() {

    var population = 0;
    for(var n in this.typeDistribution) {
        population += this.typeDistribution[n].max;
    }
    return population;

};

module.exports = Population;


function createTypeDistribution(type) {
    return {
        total: 0,
        goalPercentage: 0.0,
        currentPercentage: 0,
        max: 5
    };
};