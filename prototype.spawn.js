var listOfRoles = ['harvester', 'mover', 'claimer', 'upgrader', 'repairer', 'builder', 'wallRepairer', 'miner', 'soldier']


StructureSpawn.prototype.spawnCreepsIfNecessary = 
    function(){
        let room = this.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        let numberOfCreeps = {};
        for (let role of listOfRoles){
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        let maxEnergy = room.energyCapacityAvailable;
        let name = -2;

        if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['mover'] == 0) {
            if(numberOfCreeps['miner'] >0 ||
                (room.storage != undefined && 
                room.storage.store[RESOURCE_ENERGY] >= 150+550)){
                    
                name = this.createMover(300, room.name, room.name)
                // this.memory.new = 'mover'
            }
            else{
                name = this.createCustomCreep(room.energyAvailable, 'harvester', 'harvester');
                // this.memory.new = 'harvester'
            }
        }
        else {
            for (let room in Game.rooms){
                if (Game.rooms[room].storage){
                    let sources = Game.rooms[room].find(FIND_SOURCES);
                    for (let source of sources){
                        if(!_.some(Game.creeps, c => c.memory.role == 'miner' && c.memory.source == source.id)){
                            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                                filter: s => s.structureType == STRUCTURE_CONTAINER
                            });
                            if (containers.length > 0){
                                name = this.createMiner(maxEnergy, room.name, room, source.id)
                                break;
                            }

                        }
                    }
                }
            }



            // let sources = this.room.find(FIND_SOURCES);
            // for (let source of sources){
            //     if(!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.source == source.id)){
            //         let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
            //             filter: s => s.structureType == STRUCTURE_CONTAINER
            //         });
            //         if (containers.length > 0){
            //             name = this.createMiner(maxEnergy, room.name, room.name, source.id)
            //             // this.memory.new = 'miner'
            //             break;
            //         }

            //     }
            // }
        }
        if (!(this.memory.attackthisroom == undefined)){ 
            if(numberOfCreeps['soldier'] == 0){ 
                name = this.createSoldier(maxEnergy, this.memory.attackthisroom, room.name, this)
                if (!(name < 0)){
                    delete this.memory.attackthisroom
                }
            }
            if (numberOfCreeps['soldier'] > 0){
                let soldiers = room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.role == 'soldier'});
                for (let soldier in soldiers) {
                    soldiers[soldier].memory.target = this.memory.attackthisroom
                    delete this.memory.attackthisroom
                    break;
                }
            }
        }


        if (!(this.memory.ineedhelp == undefined)){
            
            if(numberOfCreeps['soldier'] == 0){ 
                name = this.createSoldier(maxEnergy, this.memory.ineedhelp, room.name, this)
                if (!(name < 0)){
                    delete this.memory.ineedhelp
                }
            }
            if (numberOfCreeps['soldier'] > 0){
                let soldiers = room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.role == 'soldier'});
                for (let soldier in soldiers) {
                    soldiers[soldier].memory.target = this.memory.ineedhelp
                    delete this.memory.ineedhelp
                    break;
                }
            }

        }

        if (name == -2){
            for(let role of listOfRoles){
                if(role == 'claimer' && this.memory.claimRoom != undefined){
                    name = this.createClaimer(1, this.memory.claimRoom, this);
                    if(!(name < 0)){
                        delete this.memory.claimRoom;
                    }
                }
                else if (numberOfCreeps[role] < this.memory.minCreeps[role]){
                    if(role == 'mover'){
                        name = this.createMover(maxEnergy, room.name, room.name)
                        // this.memory.new = 'mover'
                    }
                    else {
                        name = this.createCustomCreep(maxEnergy, role, role)
                        // this.memory.new = role
                    }
                    break;
                }
            }
        }
        
        let numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester')
        if(name == -2){
            for(let roomName in this.memory.minLongDistanceHarvesters){
                numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName);
                if(numberOfLongDistanceHarvesters < this.memory.minLongDistanceHarvesters[roomName]){
                    name = this.createlongDistanceHarvester(maxEnergy, 'longDistanceHarvester','LDH'+roomName, 3, room.name, roomName, this)
                }
                if (numberOfLongDistanceHarvesters == this.memory.minLongDistanceHarvesters[roomName]){ 
                    timeToClaim = this.room.find(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_STORAGE
                                     && s.store[RESOURCE_ENERGY] > 10000
                    });
                    if (timeToClaim){
                        numberOfClaimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer' && c.memory.target == roomName);
                        if(numberOfClaimers < 1){
                            name = this.createClaimer(2, roomName, this)
                        }
                    }
                    
                }                
            }
        }
        

        if(Game.time % 5 == 1){
            // console.log(this.name + ' spawned new creep: ' + this.memory.new);
            for(let role of listOfRoles){
                console.log(role + ': ' + numberOfCreeps[role]);
            }
            for(let roomName in this.memory.minLongDistanceHarvesters){
                numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName)
                console.log('longDistanceHarvesters ' + roomName + ': ' + numberOfLongDistanceHarvesters);
                // this.memory.new = 'LDH' + roomName
            }
            console.log(Game.gcl.level)
        }
        
    };

    StructureSpawn.prototype.createMiner = 
    function (energy, HOME, TARGET, sourceId){
        var body = [];
        var workparts = 2
        var numberOfParts = 1
            if (Math.floor(energy / 100)<7){
                workparts = Math.floor(energy/100)-1
                moveparts = 1                    
            }
            else {
                workparts = 5
                moveparts = 4                    
            }
        //needs FIVE work parts
        for (let i =0; i < workparts; i++){
            body.push(WORK);
        }
        for (let i =0; i < moveparts; i++){
            body.push(MOVE);
        }
        return this.spawnCreep(body, 'Miner' + Game.time, {memory: {role: 'miner', working: false, home: HOME, target: TARGET, source: sourceId}});
    };


    StructureSpawn.prototype.createCustomCreep = 
    function (energy, roleName, creepName){
        var numberOfParts = Math.floor(energy/200);
        var body = [];
        for (let i =0; i < numberOfParts; i++){
            body.push(WORK);
        }
        for (let i =0; i < numberOfParts; i++){
            body.push(CARRY);
        }
        for (let i =0; i < numberOfParts; i++){
            body.push(MOVE);
        }
 
        return this.spawnCreep(body, creepName + Game.time, {memory: {role: roleName, working: false}});
    };

    StructureSpawn.prototype.createlongDistanceHarvester = 
   function (energy, roleName, creepName, workparts, HOME, TARGET, spawnhome){
       var numberOfParts = Math.floor((energy-(100*workparts))/150);
       var body = [];
       for (let i =0; i < workparts; i++){
           body.push(WORK);
       }
       for (let i =0; i < numberOfParts; i++){
           body.push(CARRY, MOVE, MOVE);
       }
       return this.spawnCreep(body, creepName + Game.time, {memory: {role: roleName, working: false, home: HOME, target: TARGET, spawn: spawnhome}});
   };

   StructureSpawn.prototype.createMover = 
       function (energy, HOME, TARGET){
           var numberOfParts = Math.floor(energy/100);
           var body = [];
           for (let i =0; i < numberOfParts; i++){
               body.push(CARRY);
           }
           for (let i =0; i < numberOfParts; i++){
               body.push(MOVE);
           }
           return this.spawnCreep(body, 'mover' + Game.time, {memory: {role: 'mover', working: false, home: HOME, target: TARGET}});
       }; 

    StructureSpawn.prototype.createClaimer = 
       function (numberOfParts,TARGET, spawnhome){
        var body = [];
        for (let i = 0; i < numberOfParts; i++){
            body.push(CLAIM);
        }
        for (let i = 0; i < 1; i++){
            body.push(MOVE);
        }
           return this.spawnCreep(body, 'claimer' + Game.time, {memory: {role: 'claimer', target: TARGET, spawn: spawnhome}});
       };         

    StructureSpawn.prototype.createSoldier = function (energy, TARGET, HOME, SPAWNHOME){
        var numberOfParts = Math.floor(energy/200);
        var body = [];
        for (let i =0; i < numberOfParts; i++){
            body.push(TOUGH,TOUGH,ATTACK,MOVE,MOVE);
        }
        return this.spawnCreep(body, 'soldier' + Game.time, {memory:{role: 'soldier', target: TARGET, home: HOME, spawn: SPAWNHOME}})
    }
