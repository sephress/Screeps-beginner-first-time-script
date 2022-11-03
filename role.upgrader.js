module.exports = {
    run: function (creep) {
        creep.WorkCheck();  
        
        //tells the creep how to work what task is it doing?
        if (creep.memory.working == true) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller); 
            }
        }
        //If not working then what is the creep doing?
        else {
            creep.FindDroppedEnergy(true,false,500, 500)
        }
    }
};