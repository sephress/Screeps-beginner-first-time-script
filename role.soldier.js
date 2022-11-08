module.exports = {
    run: function (creep) {
        var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemyStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType !== STRUCTURE_CONTROLLER});
        var enemyPowerCreeps = creep.pos.findClosestByPath(FIND_HOSTILE_POWER_CREEPS);
        if (creep.room.name == creep.memory.target){
            if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                creep.moveTo(enemy);
            }
            if (enemyStructure){
                if(creep.attack(enemyStructure)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemyStructure);
                }
            }
            
            if (enemyPowerCreeps> 0){
                if(creep.attack(enemyPowerCreeps)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemyPowerCreeps);
                }
            }

            if(enemy == null && enemyStructure == null && enemyPowerCreeps == null){
                creep.memory.target = creep.memory.home
                if ((creep.room.name == creep.memory.home) && (creep.memory.home == creep.memory.target)){
                    if (creep.room.spawn == null){ 
                        creep.moveTo(25,25)
                    } 
                    else{ 
                        creep.travelTo(Game.spawns[creep.memory.spawn.name]);
                    }
                }
            }


        }
        
        else{
            if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                creep.moveTo(enemy);
            }
            var target = creep.memory.target
            creep.travelTo(Game.flags[target].pos);
        }
        
    }
};