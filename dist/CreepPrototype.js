/**
 * Created by Dustin on 9/1/2015.
 */
module.exports = function(){

    Creep.prototype.setRole = function(role){
        this.memory.role = role;
    }

    Creep.prototype.getRole = function(){
        return this.memory.role;
    }
}