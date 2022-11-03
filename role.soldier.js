module.exports = {
    run: function (creep) {
        var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemyStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemyPowerCreeps = creep.pos.findClosestByPath(FIND_HOSTILE_POWER_CREEPS);
        if (creep.room.name == creep.memory.target){
            if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                creep.moveTo(enemy, {ignoreCreeps: true});
            }
            if (enemyStructure){
                if(creep.attack(enemyStructure)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemyStructure, {ignoreCreeps: true});
                }
            }
            
            if (enemyPowerCreeps> 0){
                if(creep.attack(enemyPowerCreeps)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemyPowerCreeps, {ignoreCreeps: true});
                }
            }

            if(enemy == null && enemyStructure == null && enemyPowerCreeps == null){
                creep.memory.target = creep.memory.home
                if ((creep.room.name == creep.memory.home) && (creep.memory.home == creep.memory.target)){
                   creep.moveTo(Game.spawns[creep.memory.spawn.name]); 
                }
            }


        }
        
        else{
            if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                creep.moveTo(enemy, {ignoreCreeps: true});
            }
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit), {ignoreCreeps: true});
        }
        
    }
};