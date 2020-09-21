class Class {

    classname; // String
    initialHitpoints; // Number
    proficiencies = {
        armor : [], // String []
        weapons : [], // String []
        tools : [], // String []
        savingThrows : [], // String []
        skills : [] // String []
    };
    equipment = []; // String []
    abilities = []; // Ability []
    spells = [];    // Spell []

    constructor(classname, initialHitpoints){
        this.classname = classname;
        this.initialHitpoints = initialHitpoints;
    }

    /**
     * 
     * @param { string } category 
     * @param { string[] } value 
     */
    addProficiency(category, value){
        // Check if the category is defined
        if( !this.proficiencies.hasOwnProperty(category) )
            return false;

        // Check if value is actually an array of values
        if( Array.isArray(value) ){
            for(let item of value){
                this.proficiencies[category].push(item);
            }
        } else {
            this.proficiencies[category].push(value);
        }
    }

    /**
     * 
     * @param {string} spellname 
     * @param {string} description 
     */
    addSpell(spellname, description){
        this.spells.push(new Spell(spellname, description));
    }

    /**
     * 
     * @param {string} abilityname 
     * @param {number} level 
     * @param {string} description 
     */
    addAbility(abilityname, level, description){
        this.abilities.push(new Ability(abilityname, level, description));
    }

    // ***DEPRECATED***
    exportClass(list){
        let exportList = [];

        for(let item of list)
            exportList.push( item.export() );

        return exportList;
    }

    export(){
        return {
            "classname" : this.classname, 
            "initialHitpoints" : this.initialHitpoints,
            "proficiencies" : this.proficiencies,
            "equipment" : this.equipment,
            "abilities" : this.abilities,
            "spells" : this.spells
        }
    }
}