   //createCustomCreep
  
   //createlongDistanceHarvester

   //createMiner

   //createHauler
StructureSpawn.prototype.createHauler = 
   function (energy, HOME, TARGET, sourceID){
       var numberOfParts = Math.floor(energy/100);
       var body = [];
       for (let i =0; i < numberOfParts; i++){
           body.push(CARRY);
       }
       for (let i =0; i < numberOfParts; i++){
           body.push(MOVE);
       }
       return this.spawnCreep(body, 'Hauler' + Game.time, {memory: {role: 'hauler', working: false, home: HOME, target: TARGET, source: sourceID, nearsource: false}});
   };    
   //createMover
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
   //createClaimer        
StructureSpawn.prototype.createClaimer = 
   function (TARGET){
       return this.spawnCreep([CLAIM,MOVE], 'claimer' + Game.time, {memory: {role: 'claimer', target: TARGET}});
   };     

