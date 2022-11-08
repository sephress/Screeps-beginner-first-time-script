var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function (creep) {
        creep.WorkCheck();   
        creep.IWasHit();
        creep.IAmNotAlone();
        //tells the creep how to work what task is it doing?
        if (creep.memory.working == true) {
            
            if(creep.room.name == creep.memory.target)
                creep.RepairStructure();

                creep.BuildStructure();
            

            if (creep.room.name == creep.memory.home){
                
                var excess = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER 
                        || s.structureType == STRUCTURE_STORAGE)   
                        && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                });
                //Im home and have a storage to fill
                if (excess != null){
                    if(creep.transfer(excess, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(excess);
                            creep.say('⏹')
                    }
                }
            }
            else {
                var home = creep.memory.spawn.name
                creep.travelTo(Game.spawns[home].pos);
            }

        }
        //If not working then what is the creep doing?
        else {
            if (creep.room.name == creep.memory.target){
                var minerworking = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: c => c.memory.role == 'miner'})
                if (minerworking){
                    creep.FindDroppedEnergy(true,false,0,0);
                }
                else {
                    creep.FindDroppedEnergy (true,true,0,0);
                }
            }
            // if (Game.spawns[creep.memory.spawn.name].memory.ineedhelp == creep.memory.target){
            //     var exit = creep.room.findExitTo(creep.memory.home);
            //     creep.travelTo(creep.pos.findClosestByPath(exit));
            // }
                
            else{
                var target = creep.memory.target
                creep.travelTo(Game.flags[target].pos);
            }
        }
    }
};