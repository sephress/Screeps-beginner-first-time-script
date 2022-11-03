var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function (creep) {
        creep.WorkCheck();   
        creep.IWasHit();
        creep.IAmNotAlone();
        //tells the creep how to work what task is it doing?
        if (creep.memory.working == true) {
            if (creep.room.name == creep.memory.target){
                creep.RepairStructure();
                creep.BuildStructure();
            }

            if (creep.room.name == creep.memory.home){
                var excess = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER 
                        || s.structureType == STRUCTURE_STORAGE)   
                        && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                });
                //Im home and have a storage to fill
                if (excess != null){
                    if(creep.transfer(excess, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(excess, {reusePath: 10} );
                            creep.say('⏹')
                    }
                }
            }
            else {
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }

        }
        //If not working then what is the creep doing?
        else {
            if (creep.room.name == creep.memory.target){
                creep.FindDroppedEnergy (true,true,0,0);
            }
            if (Game.spawns[creep.memory.spawn.name].memory.ineedhelp == creep.memory.target){
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
                
            else{
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
    }
};