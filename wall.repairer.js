var roleRepairer = require('role.repairer');

module.exports = {
    run: function (creep) {
        creep.WorkCheck();  
        
        //get all the walls
        if (creep.memory.working == true) {
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (w) => w.structureType == STRUCTURE_WALL
            });
            //loop through the walls to find walls that need repairing based off of % health
            var reptarget = null
            for(let percentage = 0.0001; percentage <= 1; percentage = percentage +0.0001){
                //finding wall in need of repair
                for (let wall of walls) {
                    if(wall.hits / wall.hitsMax < percentage){
                        reptarget = wall;
                        break;
                    }
                }
                if(reptarget != null){
                    break;
                }
            }
            //repair the wall
            if (reptarget != null && reptarget.lenght !=0) {
                if(creep.repair(reptarget) == ERR_NOT_IN_RANGE){
                    creep.moveTo(reptarget);
                }
            }
            //or be a repairer
            else{
                roleRepairer.run(creep);
            }
        }
        //If not working then what is the creep doing?
        else {
            creep.FindDroppedEnergy(true,true,500,500)
        }
    }
};