/**
 * Created by Dustin on 10/6/2015.
 */
////////////SETTINGS/////////////

var LOG_AVERAGE_CPU = true;
var CPU_LIMIT = 80;

/////////////////////////////////

module.exports = function () {
    initMemory();

    if (LOG_AVERAGE_CPU) {
        logAverageCpu();
    }
};

function initMemory() {
    if (Memory.utils === undefined) {
        Memory.utils = {};
        Memory.utils.averageCpu = 0;
    }
}

function logAverageCpu() {
    var currentCpu = Math.round(Game.getUsedCpu());
    var totalCpu = 0;
    var averageCpu;

    if (Memory.utils.usedCpuHistory === undefined) {
        Memory.utils.usedCpuHistory = [];
    }
    Memory.utils.usedCpuHistory.unshift(currentCpu);

    if (Memory.utils.usedCpuHistory.length > 100) {
        Memory.utils.usedCpuHistory.pop();
    }

    for (var i = 0; i < Memory.utils.usedCpuHistory.length; i++) {
        totalCpu += parseInt(Memory.utils.usedCpuHistory[i]);
    }

    averageCpu = Math.round(totalCpu / Memory.utils.usedCpuHistory.length);

    if(Game.time % 100 === 0){
        //console.log(Game.getUsedCpu());
        console.log("Current CPU: " + currentCpu + "/" + Game.cpuLimit + "  |  Average CPU (50 ticks): " + averageCpu + "  |  Change: " + (averageCpu - parseFloat(Memory.utils.averageCpu)) );
        Memory.utils.averageCpu = averageCpu;
    }
}