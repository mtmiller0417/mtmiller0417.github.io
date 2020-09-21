class Spell {

    spellname;
    description;

    constructor(spellname, description){
        this.spellname = spellname;
        this.description = description;
    }

    export(){
        return {
            "spellname" : this.spellname,
            "description" : this.description
        }
    }
}