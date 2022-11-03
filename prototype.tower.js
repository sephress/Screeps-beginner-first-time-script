// create a new function for StructureTower
StructureTower.prototype.defend = function () {
        var target =  this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var repairtgts = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (strucuture) => (strucuture.hits < strucuture.hitsMax*.15) && strucuture.structureType != STRUCTURE_WALL
        });
        var hurtcreep = this.pos.findClosestByRange(FIND_CREEPS, {
            filter: (creeps) => creeps.hits < creeps.hitsMax
        });
            if (target){
                this.attack(target);
            }
            else if (hurtcreep){
                this.heal(hurtcreep);
            }
            else if (repairtgts){
                this.repair(repairtgts);
            }   
    };
