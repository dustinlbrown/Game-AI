var _ = require('lodash');

module.exports = function (creep) {
	
	if (creep.carry.energy === 0){
    	var extensions = creep.room.find(FIND_MY_STRUCTURES, {
    			filter: { structureType: STRUCTURE_EXTENSION }
    	});
    	
        extensions = _.filter(extensions, function (r) {
        	return r.energy > 0;
        });
        
        //console.log(extensions.length);
        if (extensions.length) {
            var target = creep.pos.findClosest(extensions);
            
            if(target === null){
                target = Game.flags.roadBlock;
                creep.moveTo(target);
            }else{
                creep.moveTo(target);
        	    target.transferEnergy(creep);
            }
        	
        	
        } else {
            creep.moveTo(Game.flags.timeOut);
        }
	}
    // find target
    else {
        var target = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
        if (target) {
            (!creep.build(target)) || creep.moveTo(target);
        }
        else {
            to = creep.pos.findClosest(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.owner == creep.owner || structure.structureType == STRUCTURE_ROAD) && (structure.hits < structure.hitsMax)
                }
            });

            if (to) {
                (!creep.repair(to)) || creep.moveTo(to);
            } else {
                var controller = Game.spawns.VileSpawn.room.controller;
                creep.moveTo(controller);
                creep.upgradeController(controller);
            }
        }
        
        var walls = creep.room.find(FIND_STRUCTURES, {
				filter: { structureType: STRUCTURE_WALL }
			});

			var filter = _.filter(walls, function (r) {
				return r.hits < 100000 && r.hitsMax != 1;
			});

			if (filter.length) {
				var target = creep.pos.findClosest(filter);

				creep.moveTo(target);
				var ok = creep.repair(target);

				if (ok === OK) {
					creep.memory.target = target.id;
				}

				return;
			}
			
			// repair ramparts
			var sites = creep.room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_RAMPART }
			});

			var filter = _.filter(sites, function (r) {
				return r.hits < (r.hitsMax / 20);
			});

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 15);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 10);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 5);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 2);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax * 0.9);
				});
			}

			if (filter.length) {
				var target = creep.pos.findClosest(filter);

				creep.moveTo(target);
				var ok = creep.repair(target);

				if (ok === OK) {
					creep.memory.target = target.id;
				}

				return;
			}
    }

	/*var sites = creep.room.find(FIND_CONSTRUCTION_SITES);

	if (creep.carry.energy === 0) {
		creep.memory.action = 'refueling';
	} else if (sites.length) {
		creep.memory.action = 'building';
	} else {
		creep.memory.action = 'upgrading';
	}

	var actions = {
		'refueling': function () {
			console.log('refueling');
			var extensions = creep.room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_EXTENSION }
			});

			extensions = _.filter(extensions, function (r) {
				return r.energy > 0;
			});
            	console.log(extensions.length);
			if (extensions.length) {
				var target = creep.pos.findClosest(extensions);

				creep.moveTo(target);
				target.transferEnergy(creep);
			}
		},
		'upgrading': function () {
		    console.log('upgrade in progress');
			// finish current target
			if (creep.memory.target) {
				var target = Game.getObjectById(creep.memory.target);

				if (target) {
					var ok = creep.repair(target);

					if (ok === OK) {
						return;
					}
				}
			}

			creep.memory.target = null;
			/*
			// repair roads
			var roads = creep.room.find(FIND_STRUCTURES, {
				filter: { structureType: STRUCTURE_ROAD }
			});

			var filter = _.filter(roads, function (r) {
				return r.hits < (r.hitsMax / 4);
			});

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 2);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax * 0.9);
				});
			}

			if (filter.length) {
				var target = creep.pos.findClosest(filter);

				creep.moveTo(target);
				var ok = creep.repair(target);

				if (ok === OK) {
					creep.memory.target = target.id;
				}

				return;
			}
			
			// repair walls
			var walls = creep.room.find(FIND_STRUCTURES, {
				filter: { structureType: STRUCTURE_WALL }
			});

			var filter = _.filter(walls, function (r) {
				return r.hits < 100000 && r.hitsMax != 1;
			});

			if (filter.length) {
				var target = creep.pos.findClosest(filter);

				creep.moveTo(target);
				var ok = creep.repair(target);

				if (ok === OK) {
					creep.memory.target = target.id;
				}

				return;
			}
			
			// repair ramparts
			var sites = creep.room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_RAMPART }
			});

			var filter = _.filter(sites, function (r) {
				return r.hits < (r.hitsMax / 20);
			});

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 15);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 10);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 5);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax / 2);
				});
			}

			if (!filter.length) {
				filter = _.filter(sites, function (r) {
					return r.hits < (r.hitsMax * 0.9);
				});
			}

			if (filter.length) {
				var target = creep.pos.findClosest(filter);

				creep.moveTo(target);
				var ok = creep.repair(target);

				if (ok === OK) {
					creep.memory.target = target.id;
				}

				return;
			}
		},
		'building': function () {
		    console.log('building!');
			var sites = creep.room.find(FIND_CONSTRUCTION_SITES);

			creep.moveTo(sites[0]);
			creep.build(sites[0]);
		}
	};

	var action = actions[creep.memory.action];

	if (action) {
	   
		action();
	}*/
}