class Ability {

    abilityname;
    level;
    description;

    constructor(abilityname, level, description){
        this.abilityname = abilityname;
        this.level = level;
        this.description = description;
    }

    export(){
        return {
            "abilityname" : this.abilityname,
            "level" : this.level,
            "description" : this.description
        }
    }
}