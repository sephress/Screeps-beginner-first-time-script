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
                    creep.moveTo(storage);
                    creep.say("©")
                }
            }
            if (!storage){
                var tstorage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (t) => t.structureType == STRUCTURE_TOWER && t.energy < t.energyCapacity*.75
                });
                var store = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_STORAGE && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                });
                if(tstorage != null){
                    if(creep.transfer(tstorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tstorage);
                        creep.say("🗼")
                    }
                }
                else {
                    if (creep.transfer(store, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                        creep.moveTo(store);
                        creep.say('🏬');
                    }
                    if(creep.transfer(store, RESOURCE_GHODIUM_OXIDE)== ERR_NOT_IN_RANGE){
                        creep.moveTo(store); 
                    }
                }
            }
        }
        else {
            creep.FindDroppedEnergy(true, false, 200, 500)
        }
    }
}

        