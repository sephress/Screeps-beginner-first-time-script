StructureSpawn.prototype.RCLCheck = 
function(){
    if (this.room.controller.level == 1){
        this.memory = {minCreeps: { 
            harvester: 0,
            upgrader: 1, 
            builder: 1,
            mover: this.memory.numberOfSources + 1
        }}

    }
    if (this.room.controller.level == 2){
        this.memory.numberOfSources = this.room.find(FIND_SOURCES).length
        var minercheck = this.room.find(FIND_MY_CREEPS, {filter: c => c.memory.role == 'miner'})
        if(this.memory.minCreeps.mover == undefined){
            if(minercheck.length > 0 ) {
                this.memory.minCreeps = {
                    harvester: 0,
                    upgrader: 1, 
                    builder: 1,
                    mover: this.memory.numberOfSources + 1
                }
            }
            else{
                this.memory.minCreeps = {
                    harvester: this.memory.numberOfSources,
                    upgrader: 1, 
                    builder: 1
                }
            }
        }
        
    }
    if (this.room.controller.level == 3){
        this.memory.numberOfSources = this.room.find(FIND_SOURCES).length
        var minercheck = this.room.find(FIND_MY_CREEPS, {filter: c => c.memory.role == 'miner'})
        if(this.memory.minCreeps.upgrader < 2){
            if(minercheck.length > 0 ) {
                this.memory.minCreeps = {
                    harvester: 0,
                    upgrader: 2, 
                    builder: 1,
                    mover: this.memory.numberOfSources + 1
                }
            }
            else{
                this.memory.minCreeps = {
                    harvester: this.memory.numberOfSources,
                    upgrader: 1, 
                    builder: 1
                }
            }
        }
        
    }
}
