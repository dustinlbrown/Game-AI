
Spawn.prototype.getCreepDefinition = function(role)
{
    if(typeof this.memory.creepDefinitions === 'undefined')
    {
        this.initDefinitions();
    }

    return this.memory.creepDefinitions[role];
}

Spawn.prototype.addToSpawnQueue = function(body, options)
{
    if(this.memory.spawnQueue === undefined)
    {
        this.memory.spawnQueue = [];
    }

    this.memory.spawnQueue.push({body: body, options: options});
}

Spawn.prototype.addToFrontOfSpawnQueue = function(body, options)
{
    if(this.memory.spawnQueue === undefined)
    {
        this.memory.spawnQueue = [];
    }

    this.memory.spawnQueue.unshift({body: body, options: options});
}

//ADD TO QUEUE FROM DICTIONARY

Spawn.prototype.clearSpawnQueue = function()
{
    this.memory.spawnQueue = [];
}

Spawn.prototype.processQueue = function()
{
    if(this.memory.spawnQueue.length === 0) return;

    var creepToSpawn = this.memory.spawnQueue[0];

    if(creepToSpawn.options === null)
    {
        return;
    }

    if(creepToSpawn.options.homeRoom === undefined)
    {
        creepToSpawn.options.homeRoom = this.room.name;
    }

    //console.log(this.canCreateCreep(creepToSpawn.body))
    if(this.canCreateCreep(creepToSpawn.body) === 0)
    {
        if(creepToSpawn.options.role !== undefined) console.log(this.name + ' spawning ' + creepToSpawn.options.role);
        this.createCreep(creepToSpawn.body, null, creepToSpawn.options);
        this.memory.spawnQueue.shift();
    }
}

Spawn.prototype.getQueueCreepCount = function(role)
{
    var count = 0;

    if(this.memory.spawnQueue === undefined)
    {
        this.memory.spawnQueue = [];
    }

    for(var i = 0; i < this.memory.spawnQueue.length; i++)
    {
        var workingCreep = this.memory.spawnQueue[i];

        if(workingCreep.options === null)
        {
            continue;
        }

        if(workingCreep.options.role === role)
        {
            count++;
        }
    }

    return count;
}

exports.getHomeRoomCreepCount = function(role, roomName)
{
    var count = 0;

    for(var creep in Game.creeps)
    {
        var workingCreep = Game.creeps[creep];

        if(workingCreep.memory.homeRoom === roomName && workingCreep.memory.role === role)
        {
            count++;
        }
    }

    return count;
}