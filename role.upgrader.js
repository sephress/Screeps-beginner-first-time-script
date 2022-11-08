module.exports = {
    run: function (creep) {
        creep.WorkCheck();  
        
        if (creep.room.name == creep.memory.target){
            if (creep.memory.working == true) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller); 
                }
            }
            else {
                var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER)})
                if(!storage){
                    creep.FindDroppedEnergy(true,true,100,100);
                }
                else{
                    creep.FindDroppedEnergy(true,false,500, 500)
                }
            }
        }
        else{
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit), {ignoreCreeps: true});
        }
    }
};