var roleBuilder = require('role.builder');

module.exports = {
    run: function (creep) {
        creep.WorkCheck();  
        
        //tells the creep how to work what task is it doing?
        if (creep.memory.working == true) {
           creep.RepairStructure();
        }
        
        //If not working then what is the creep doing?
        else {
            creep.FindDroppedEnergy(true,false,500, 500)
        }
    }
};