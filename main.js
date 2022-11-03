// // importing
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');

module.exports.loop = function() {
    //loop to clear the creep memory
    for (let name in Memory.creeps){
        if (Game.creeps[name] == undefined){
            delete Memory.creeps[name];
        }
    }
    
    // loop to activate creeps
    for (let name in Game.creeps){
        Game.creeps[name].runRole();
    }

    var towers = _.filter(Game.structures , s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.defend();
    }

    for (let spawnName in Game.spawns){
        Game.spawns[spawnName].spawnCreepsIfNecessary();

    }
    // console.log(Game.rooms["W8S7"].controller.reservation.username)
    
};