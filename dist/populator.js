/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('populator'); // -> 'a thing'
 */
 /**
 * Created by Dustin on 8/19/2015.
 */

var _ = require('lodash');
module.exports = {
        makeCreep: function(spawn, role, config) {
        var memory = { role: role };
        var numExisting = _.filter(Game.creeps, { memory: memory }).length;
        var canCreate = spawn.canCreateCreep(config.body) === OK;

        //Check to see if we have a miner, if not we need to prioritize them
        var minerCheck = _.filter(Game.creeps, {memory: {role: 'miner'}}).length
        if (role != 'miner' && minerCheck < 1){
            return;
        }
        
        //Once we have a miner, we need a guy to pice up his loot
        var foragerCheck = _.filter(Game.creeps, {memory: {role: 'forager'}}).length
        if (role != 'forager' && foragerCheck < 1 && minerCheck > 0){
            return;
        }
        
        if (numExisting < config.limit && canCreate) {
            spawn.createCreep(config.body, undefined, memory);
        }else{
            return;
        }
        
    }
};