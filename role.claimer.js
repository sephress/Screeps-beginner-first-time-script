var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function (creep) {
        creep.IAmNotAlone();

        if (creep.room.name != creep.memory.target){
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath: 50}, {ignoreCreeps: true});
                }
        
        if (creep.room.name == creep.memory.target){
            if (creep.room.controller){ 
                if(creep.reserveController(creep.room.controller)==ERR_NOT_IN_RANGE){ 
                    creep.moveTo(creep.room.controller)
                }
                if(creep.reserveController(creep.room.controller)==ERR_INVALID_TARGET){
                    creep.attackController(creep.room.controller)
                }
                
                
                if(creep.signController(creep.room.controller, 'I wish I knew what I was doing!')==ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller)
                }
            }
            
            // if(creep.claimController(creep.room.controller)==ERR_NOT_IN_RANGE){
            //     creep.moveTo(creep.room.controller)
            // }
        }
    } 
};