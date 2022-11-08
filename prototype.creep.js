var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('wall.repairer'),
    longDistanceHarvester: require('role.longdistanceharvester'),
    miner: require('role.miner'),
    hauler: require('role.hauler'),
    mover: require('role.mover'),
    claimer: require('role.claimer'),
    soldier: require('role.soldier'),
    subjugator: require('role.subjugator')

};

Creep.prototype.runRole =
    function(){
        roles[this.memory.role].run(this);
    };

    //for creeps with work parts
Creep.prototype.getEnergy = function(useContainer, useSource, containerCap, storageCap){
        let container
        
        if(useContainer == true){
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
                             && (s.store[RESOURCE_ENERGY] > containerCap)
            });
            storageBuildingenergy = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE 
                    && (s.store[RESOURCE_ENERGY] > storageCap)
            })
            if(container){
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    this.travelTo(container);
                    this.say('⏹')
                }
            }
            if(!container){
                if(this.withdraw(storageBuildingenergy, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    this.travelTo(storageBuildingenergy);
                    this.say('🏪')
                }
            }
        }
        if ((!container && !storageBuildingenergy) && useSource == true){
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(this.harvest(source)== ERR_NOT_IN_RANGE){
                this.travelTo(source)
                this.say('⛏')
            }
        }
        if ((!container && !storageBuildingenergy) && useSource == false){
            var storageBuilding = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
            });
                if(storageBuilding){
                    this.travelTo(storageBuilding)
                    this.say('🪑')
                }
                if(storageBuilding==undefined){
                    var home = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN})
                    this.travelTo(home);
                }
        }

    }
Creep.prototype.WorkCheck = function(){
    if (this.memory.working == true && this.store.getUsedCapacity() == 0) {
        this.memory.working = false;
        this.say('📦');
    }
    //tells creep to see if working and energy is false and less than maximum capacity then starts working
    else if (this.memory.working == false && this.store.getFreeCapacity() == 0) {
        this.memory.working = true;
        this.say('⏩');
    }
}

Creep.prototype.FindDroppedEnergy = function(useContainer, useSource, containerCap, storageCap) {
    var tombstonewithenergy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
        filter: (t) => t.store[RESOURCE_ENERGY] > 100
    });
    var droppedenergy =  this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY});
    if (!(droppedenergy==null) && droppedenergy > 200){
        if (this.pickup(droppedenergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        this.travelTo(droppedenergy);
        }
        this.say('⚡')
    }
    if (tombstonewithenergy){
        if (this.withdraw(tombstonewithenergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        this.travelTo(tombstonewithenergy);
        }
        this.say('💀')
    }
    else {
        this.getEnergy (useContainer, useSource, containerCap, storageCap)
        

    }
}

Creep.prototype.Upgrade = function(){
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE){
        this.travelTo(this.room.controller); 
    }
}

Creep.prototype.RepairStructure = function(){
    var repairablestructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (r) => r.hits < (r.hitsMax *.90) && r.structureType != STRUCTURE_WALL
    });
    if (repairablestructure) {
        if(this.repair(repairablestructure) == ERR_NOT_IN_RANGE){
            this.travelTo(repairablestructure);
        }
    }
    else{
        this.Upgrade();
    }
}

Creep.prototype.BuildStructure = function(){
    var construction = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (construction) {
        if(this.build(construction) == ERR_NOT_IN_RANGE){
            this.travelTo(construction); 
        }  
    }
    else{
        this.RepairStructure();
    }
            
}

Creep.prototype.IWasHit = function(){
    if(this.hits < this.memory.lasthits) {
        Game.spawns[this.memory.spawn.name].memory.ineedhelp = this.room.name
    };
    this.memory.lasthits = this.hits;
}

Creep.prototype.DefendMyself = function(){
    if(this.hits < this.memory.lasthits) {
        this.memory.defend = true
    };
    if(this.hits == this.hitsMax){
        this.memory.defend = false
    };
    this.memory.lasthits = this.hits;
}

Creep.prototype.IAmNotAlone = function(){
    var enemy = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    var enemyStructure = this.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType !== STRUCTURE_CONTROLLER})
    var enemyPowerCreeps = this.pos.findClosestByPath(FIND_HOSTILE_POWER_CREEPS);
    var defendedBySoldier = this.pos.findClosestByPath(FIND_MY_CREEPS, {filter: c => c.memory.role == 'soldier'})
    if (defendedBySoldier){
        delete Game.spawns[this.memory.spawn.name].memory.attackthisroom
    }
    else if(defendedBySoldier == null && this.room !== this.memory.home ){
        if (enemy){
            Game.spawns[this.memory.spawn.name].memory.attackthisroom = this.room.name
        }
        else if (enemyStructure){
            Game.spawns[this.memory.spawn.name].memory.attackthisroom = this.room.name
        }
        else if (enemyPowerCreeps){
            Game.spawns[this.memory.spawn.name].memory.attackthisroom = this.room.name
        }
    }
}

Creep.prototype.EnergyDelivered = function(){
    
    if (this.memory.working == true){
        for (let i =0; i < 1; i++){
            this.memory.resource = this.memory.resource + this.store.getUsedCapacity(RESOURCE_ENERGY)
            if (this.ticksToLive==10){
                console.log(this.memory.resource)
            }
        }
    }
}