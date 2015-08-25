module.exports = {
    
    actions: {
        'upgrader': require('upgrader'),
        'forager': require('forager'),
        'scv': require('scv'),
        'miner': require('miner')
    },

    roles: {
        'upgrader': {
            limit: 3,
            body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        'forager': {
            limit: 3,
            body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        },
        'scv': {
            limit: 4,
            body: [WORK, WORK, CARRY, CARRY, MOVE]
        },
        'miner': {
            limit: 3,
            body: [WORK, WORK, WORK, WORK, MOVE]
        }
    }
};