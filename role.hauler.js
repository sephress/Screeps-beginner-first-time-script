module.exports = {
    run: function (creep) {
        creep.WorkCheck(); 
         
        var nearsource = false
        //memory is true and is delivering energy
        if (creep.memory.working == true) {
            //am I home or away?
            if (creep.room.name == creep.memory.home){
                //hauler creep needs to transfer into the storage bin                
                var excess = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER  && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                });
                //Im home and have a storage to fill
                if (excess != null){
                    if(creep.transfer(excess, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(excess);
                            creep.memory.nearsource = false
                            creep.say('⏹')
                    }
                }
                //Im home and dont have a storage to fill
                else {
                    var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_SPAWN 
                        || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER
                        ) 
                        && s.energy < s.energyCapacity 
                    });
                    if (storage != null) {
                        if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                            creep.memory.nearsource = false
                            creep.say("©")
                        }
                    }
                }          
            }
            //I am not home moving to home
            else {
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
        //creating dropped energy check
        var denergy =  creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        
        //memory is false and getting energy
        if (creep.memory.working == false) {   
            //am I at my target room?
            if (creep.room.name == creep.memory.target){ 
                if (creep.memory.source == 0){
                    if (creep.memory.nearsource == true){
                        if(creep.pickup(denergy) == ERR_NOT_IN_RANGE){
                            creep.moveTo(denergy);
                        };
                    }
                    else if (creep.memory.nearsource == false){
                        creep.moveTo(Game.flags['Source0'])
                        if(creep.pos.isNearTo(Game.flags['Source0'])){
                            creep.memory.nearsource = true
                        }
                    }
                }

                else if(creep.memory.source == 1){
                    if (creep.memory.nearsource == true){
                        if(creep.pickup(denergy) == ERR_NOT_IN_RANGE){
                            creep.moveTo(denergy);
                        };
                    }
                    else if (creep.memory.nearsource == false){
                        creep.moveTo(Game.flags['Source1'])
                        if(creep.pos.isNearTo(Game.flags['Source1'])){
                            creep.memory.nearsource = true
                        }
                    }
                }
                
                // if(creep.memory.nearsource == true){
                //     if(creep.pickup(denergy) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(denergy);
                //     }
                // }
                // else if(creep.memory.source == 1) {
                //     creep.moveTo(Game.flags['Source1'])
                //     if (creep.pos.isNearTo(Game.flags['Source1'])){
                //         nearsource = true
                //     } 
                // }
                // else{
                //     creep.moveTo(Game.flags['Source0'])
                //     if (creep.pos.isNearTo(Game.flags['Source0'])){
                //         if(creep.pickup(denergy) == ERR_NOT_IN_RANGE) {
                //             creep.moveTo(denergy);
                //         }
                //     }
                // }
                //I am picking up energy                
            }
            //I am not home moving to home
            else{
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }        
        }                    
    }
};