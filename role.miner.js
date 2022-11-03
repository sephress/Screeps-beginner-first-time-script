module.exports = {
    run: function (creep) {
        //move to source and mine it
        if (creep.room.name == creep.memory.target){     
            let source = Game.getObjectById(creep.memory.source);
            let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: c => c.structureType == STRUCTURE_CONTAINER
            })[0];
            if (container){
                if (creep.pos.isEqualTo(container.pos)){
                    creep.harvest(source) 
                }
                else{
                    creep.moveTo(container.pos);
                }
            }
            else {
                if (creep.harvest(source)== ERR_NOT_IN_RANGE){ 
                    creep.moveTo(source)
                }
            }
           
        }
        else{
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit), {ignoreCreeps: true});
        }
    }
};