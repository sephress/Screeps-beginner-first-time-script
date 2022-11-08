module.exports = {
    run: function (creep) {
        creep.WorkCheck();  
        
        //tells the creep how to work what task is it doing?
        if (creep.memory.working == true) {
            var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN                    
                || s.structureType == STRUCTURE_EXTENSION             
                ) 
                && s.energy < s.energyCapacity 
                
            });            
            if(storage){
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {ignoreCreeps: true});
                    creep.say("©")
                }
            }
            else if(!storage){
                var excess = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER 
                        || s.structureType == STRUCTURE_STORAGE) 
                        && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                });
                if (excess){
                    if(creep.transfer(excess, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(excess, {visualizePathStyle:{}});
                        creep.say('⏹')
                    }
                }
                if (!excess){
                    var tstorage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (t) => t.structureType == STRUCTURE_TOWER && t.energy < t.energyCapacity
                    });
                    if(tstorage){
                        if(creep.transfer(tstorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tstorage, {ignoreCreeps: true});
                            creep.say("🗼")
                        }
                    }
                }
            }
        }
        //If not working then what is the creep doing?
        else {
            creep.FindDroppedEnergy(true,true,0,0)
        }
    }
};