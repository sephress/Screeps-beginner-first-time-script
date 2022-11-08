const { remove } = require("lodash");

module.exports = {
    run: function (creep) {
        var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemyStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType !== STRUCTURE_CONTROLLER});
        var enemyPowerCreeps = creep.pos.findClosestByPath(FIND_HOSTILE_POWER_CREEPS);
        var waypoints = creep.memory.waypoints
        var hurtcreeps = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax})
        creep.DefendMyself();
        if(creep.memory.defend == true){
            if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                if (creep.rangedAttack(enemy)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemy);
                }
            }
            if(creep.attack(enemyStructure)==ERR_NOT_IN_RANGE){
                if (creep.rangedAttack(enemyStructure)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemyStructure);
                }
            }
            if(creep.attack(enemyPowerCreeps)==ERR_NOT_IN_RANGE){
                if (creep.rangedAttack(enemyPowerCreeps)==ERR_NOT_IN_RANGE){
                    creep.moveTo(enemyPowerCreeps);
                }
            }
            else{
                if(creep.heal(hurtcreeps)==ERR_NOT_IN_RANGE){
                    creep.moveTo(hurtcreeps)
                }
            }
        }
        else{ 
            if (creep.memory.rally == true){
                var i = waypoints.length
                squadcheck = creep.room.find(FIND_MY_CREEPS)
                if(i==0){
                    if (squadcheck.length == creep.memory.squad || squadcheck.length > creep.memory.squad){
                        creep.memory.rally = false
                    }
                    else{
                        creep.travelTo(creep.pos.findClosestByPath(creep.room.flags))
                    }
                }
                if (i >0){ 
                    if (creep.room.name == Game.flags[waypoints[0]].pos.roomName){
                        creep.moveTo(25,25)
                        creep.memory.waypoints.splice(0)   
                    }                
                    else{
                        var exit = creep.room.findExitTo(Game.flags[waypoints[0]].pos.roomName);
                        creep.travelTo(creep.pos.findClosestByPath(exit));
                    }
                }
                
            }
            if (creep.memory.rally == false){ 
                if (creep.room.name == creep.memory.target){
                    if(enemy){
                        if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                            creep.moveTo(enemy)
                        }
                        if (creep.rangedAttack(enemy)==ERR_NOT_IN_RANGE){
                            creep.moveTo(enemy);
                        }
                    }
            
                    if(enemyStructure){
                        if(creep.attack(enemyStructure)==ERR_NOT_IN_RANGE){
                            creep.moveTo(enemyStructure)
                            if (creep.rangedAttack(enemyStructure)==ERR_NOT_IN_RANGE){
                                creep.moveTo(enemyStructure);
                            }
                        }
                    }
                    
                    if(enemyPowerCreeps){
                        if(creep.attack(enemyPowerCreeps)==ERR_NOT_IN_RANGE){
                            if (creep.rangedAttack(enemyPowerCreeps)==ERR_NOT_IN_RANGE){
                                creep.moveTo(enemyPowerCreeps);
                            }
                        }
                    }
                
                    if(enemy == null && enemyStructure == null && enemyPowerCreeps == null){
                        creep.memory.subjugate = true
                        if (creep.memory.subjugate == true){
                                creep.moveTo(25,25)
                        }
                    }
                    if (hurtcreeps){
                        if(creep.heal(hurtcreeps)==ERR_NOT_IN_RANGE){
                            creep.moveTo(hurtcreeps)
                        }
                    }
                }
                else{
                    if(creep.attack(enemy)==ERR_NOT_IN_RANGE){
                        creep.moveTo(enemy);
                    }
                    var exit = creep.room.findExitTo(creep.memory.target);
                    creep.moveTo(creep.pos.findClosestByPath(exit));
                }
            }
        }
    }
};