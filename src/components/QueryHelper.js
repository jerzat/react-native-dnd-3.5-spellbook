class QueryHelper {

    static async populateRecords(results, db) { // Async, will wait for multiple querys

        var newRecords = [];

        var promises = [];

        // Query complete details for each spell and consolidate in a single row
        for (let i = 0; i < results.rows.length; i++) {
            let queryString = 
            'SELECT dnd_spell.school_id, dnd_spell.rulebook_id, dnd_spell.sub_school_id, dnd_spell.verbal_component, dnd_spell.somatic_component, dnd_spell.material_component, dnd_spell.arcane_focus_component, dnd_spell.divine_focus_component, dnd_spell.xp_component, dnd_spell.casting_time, dnd_spell.range, dnd_spell.target, dnd_spell.effect, dnd_spell.area, dnd_spell.duration, dnd_spell.saving_throw, dnd_spell.spell_resistance, cast(dnd_spell.description as text) AS description, dnd_spell.extra_components,'
            + 'dnd_spell.id as master_id, dnd_spellschool.name AS school_name, dnd_spell.name as spell_name, dnd_spell_descriptors.spelldescriptor_id, dnd_spelldescriptor.name as descriptor_name, dnd_spellclasslevel.character_class_id, dnd_spellclasslevel.level as class_level, dnd_spelldomainlevel.domain_id, dnd_spelldomainlevel.level AS domain_level, dnd_domain.name AS domain_name, dnd_characterclass.name AS class_name, dnd_rulebook.name AS rulebook_name, dnd_rulebook.published ' // Disambiguate names
            + 'FROM dnd_spell ' // Main table
            + 'LEFT JOIN dnd_spellclasslevel on dnd_spell.id = dnd_spellclasslevel.spell_id ' // match spell level for each class
            + 'LEFT JOIN dnd_spellschool ON dnd_spell.school_id = dnd_spellschool.id ' // match domain names
            + 'LEFT JOIN dnd_spelldomainlevel ON dnd_spell.id = dnd_spelldomainlevel.spell_id ' // add in domain levels
            + 'LEFT JOIN dnd_domain ON dnd_spelldomainlevel.domain_id = dnd_domain.id ' // add in domain names
            + 'LEFT JOIN dnd_characterclass ON dnd_spellclasslevel.character_class_id = dnd_characterclass.id ' // add in class names
            + 'LEFT JOIN dnd_spell_descriptors ON dnd_spell.id = dnd_spell_descriptors.spell_id ' // add in spell descriptors ids
            + 'LEFT JOIN dnd_spelldescriptor ON dnd_spell_descriptors.spelldescriptor_id = dnd_spelldescriptor.id ' // add in spell descriptors names
            + 'LEFT JOIN dnd_rulebook ON dnd_spell.rulebook_id = dnd_rulebook.id ' // add in rulebooks
            + 'WHERE master_id = ' + results.rows.item(i).id;
            promises.push(db.executeSql(queryString));
        }

        await Promise.all(promises).then(function (values) {
            newRecords = values.map( ([singleSpellResults]) => QueryHelper.consolidate(singleSpellResults));
        });
        return newRecords;

        
    }
    
    // Take in results for a single spell and return a single row with consolidated details (classes, domains, descriptors, etc)
    static consolidate(results) {
        var checkForValueDuplicatesInNextrows = (row, nextRow, idField, nameField, levelField, newFieldName) => {

            if (row[newFieldName] === undefined) { // Create consolidated entry in record, with first row data if available, empty otherwise
                if (row[idField] !== undefined && row[idField] !== null) {
                    row[newFieldName]=[{id: row[idField], name: row[nameField], level: row[levelField]}];
                } else {
                    row[newFieldName] = [];
                }
            }

            if (nextRow !== undefined && nextRow.master_id === row.master_id && nextRow[idField] !== undefined && nextRow[idField] !== null) { // if next row has this item
                let newDescriptor = {id: nextRow[idField], name: nextRow[nameField], level: nextRow[levelField]}; // consolidate two/three fields, without array
                let newDescriptorAsString = JSON.stringify(newDescriptor); // stringify the item
                let comparedItems = row[newFieldName].map(desc => JSON.stringify(desc) == newDescriptorAsString); // check if any of our items in the array is the same as the new one
                let mismatchingItems = comparedItems.filter(x => x == true); // array containing items only if new item was already present
                if (mismatchingItems.length === 0 || mismatchingItems === undefined) { // If there are no items, this is the first occurrence of a new item
                    row[newFieldName].push(newDescriptor); // add it
                }
            }

        }

        var newRecords = [];
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            let nextRow = results.rows.item(i+1);
            do {
                checkForValueDuplicatesInNextrows(row, nextRow, 'spelldescriptor_id', 'descriptor_name', undefined, 'descriptor');
                checkForValueDuplicatesInNextrows(row, nextRow, 'character_class_id', 'class_name', 'class_level', 'class');
                checkForValueDuplicatesInNextrows(row, nextRow, 'domain_id', 'domain_name', 'domain_level', 'domain');
                checkForValueDuplicatesInNextrows(row, nextRow, 'rulebook_id', 'rulebook_name', undefined, 'rulebook');
                nextRow = results.rows.item(++i);
            }
            while (nextRow !== undefined && row.master_id === nextRow.master_id) // next row exists and is the same spell
            
            newRecords.push(row);
        }
        return newRecords[0];
    }

    // Discard older versions of the spell but retain edition info for clarity
    static discardOldVersions (records) {
        for (let i=0; i < records.length-1; i++) {
            for (let j=i+1; j < records.length; j++) {
                if (records[i].spell_name === records[j].spell_name) {
                    let dateA = new Date(records[i].published);
                    let dateB = new Date(records[j].published);
                    if (dateA < dateB || dateA === null || dateA === '') {
                        records[j].rulebook.push(records[i].rulebook[0]);
                        records[i] = records[j];
                    } else {
                        records[i].rulebook.push(records[j].rulebook[0]);
                    }
                    records.splice(j--, 1);
                }
            }
        }
        return records;
    }

    static async searchQuery(state) {

        
        
        // Query
        let conditionsCount = 0;
        var addLigature = () => { // Add where/and clause where appropriate
            conditionsCount++;
            if (conditionsCount === 1) {
               return ' WHERE (';
            } else {
               return ' AND (';
            }
        };
        let levels = state.spellLevel.selected;
        let levelQueryString = '';
        if (levels.length !== 0) {
            levelQueryString += addLigature();
            levels.map(level => levelQueryString += ' dnd_spellclasslevel.level=' + level.id + ' OR dnd_spelldomainlevel.level=' + level.id + ' OR');
            levelQueryString = levelQueryString.substr(0, levelQueryString.length - 3) + ')';
        }
        let classes = state.classes.selected;
        classQueryString = '';
        if (classes.length !== 0) {
            classQueryString += addLigature();
            classes.map(sclass => classQueryString += ' dnd_spellclasslevel.character_class_id=' + sclass.id +  ' OR');
            classQueryString = classQueryString.substr(0, classQueryString.length - 3) + ')';
        }
        let domains = state.domains.selected;
        domainQueryString = '';
        if (domains.length !== 0) {
            domainQueryString += addLigature();
            domains.map(dom => domainQueryString += ' dnd_spelldomainlevel.domain_id=' + dom.id + ' OR');
            domainQueryString = domainQueryString.substr(0, domainQueryString.length - 3) + ')';
        }
        let schools = state.schools.selected;
        schoolQueryString = '';
        if (schools.length !== 0) {
            schoolQueryString += addLigature();
            schools.map(school => schoolQueryString += ' dnd_spell.school_id=' + school.id + ' OR');
            schoolQueryString = schoolQueryString.substr(0, schoolQueryString.length - 3) + ')';
        }
        let descriptors = state.descriptors.selected;
        descriptorQueryString = '';
        if (descriptors.length !== 0) {
            descriptorQueryString += addLigature();
            descriptors.map(descriptor => descriptorQueryString += ' dnd_spell_descriptors.spelldescriptor_id=' + descriptor.id + ' OR');
            descriptorQueryString = descriptorQueryString.substr(0, descriptorQueryString.length - 3) + ')';
        }
        let savingThrow = state.savingThrow.selected;
        let spellSTQueryString = '';
        if (savingThrow.length !== 0) {
            spellSTQueryString += addLigature();
            savingThrow.map((st) => spellSTQueryString += ' saving_throw LIKE \'%' + st.name + '%\' OR');
            spellSTQueryString = spellSTQueryString.substr(0, spellSTQueryString.length - 3) + ')';
        }
        let spellResistance = state.spellResistance.selected;
        let spellSRQueryString = '';
        if (spellResistance.length !== 0) {
            spellSRQueryString += addLigature();
            spellResistance.map((sr) => spellSRQueryString += ' spell_resistance LIKE \'%' + sr.name + '%\' OR');
            spellSRQueryString = spellSRQueryString.substr(0, spellSRQueryString.length - 3) + ')';
        }
        let spellName = state.spellName;
        let spellNameQueryString = '';
        if (spellName !== '') {
            spellNameQueryString += addLigature() + ' dnd_spell.name LIKE \'%' + spellName + '%\')';
        }
        let spellText = state.spellText;
        let spellTextQueryString = '';
        if (spellText !== '') {
            spellTextQueryString += addLigature() + ' dnd_spell.description LIKE \'%' + spellText + '%\')';
        }
        

        // Query for ids only of spells matching the criteria
        var newRecords = [];
        let queryString = 
        'SELECT DISTINCT dnd_spell.id '
        + 'FROM dnd_spell ' // Main table
        + 'LEFT JOIN dnd_spellclasslevel on dnd_spell.id = dnd_spellclasslevel.spell_id ' // match spell level for each class
        + 'LEFT JOIN dnd_spelldomainlevel ON dnd_spell.id = dnd_spelldomainlevel.spell_id ' // add in domain levels
        + 'LEFT JOIN dnd_spell_descriptors ON dnd_spell.id = dnd_spell_descriptors.spell_id ' // add in spell descriptors ids
        + 'LEFT JOIN dnd_rulebook ON dnd_spell.rulebook_id = dnd_rulebook.id ' // add in rulebooks
        + levelQueryString + classQueryString + domainQueryString + schoolQueryString + descriptorQueryString + spellSTQueryString + spellSRQueryString + spellNameQueryString + spellTextQueryString + ' ORDER BY dnd_spell.name';
        console.log(queryString);
        await state.db.executeSql(queryString)
            .then(async ([results]) => {
                console.log("Query completed");
                newRecords = await QueryHelper.populateRecords(results, state.db);
        });
        return QueryHelper.discardOldVersions(newRecords); // Discard duplicates (due to spells published in more than one manual)
    }

    static async getSpellById(db, id) {

        var values = [];
        let queryString = 
            'SELECT dnd_spell.school_id, dnd_spell.rulebook_id, dnd_spell.sub_school_id, dnd_spell.verbal_component, dnd_spell.somatic_component, dnd_spell.material_component, dnd_spell.arcane_focus_component, dnd_spell.divine_focus_component, dnd_spell.xp_component, dnd_spell.casting_time, dnd_spell.range, dnd_spell.target, dnd_spell.effect, dnd_spell.area, dnd_spell.duration, dnd_spell.saving_throw, dnd_spell.spell_resistance, cast(dnd_spell.description as text) AS description, dnd_spell.extra_components,'
            + 'dnd_spell.id as master_id, dnd_spellschool.name AS school_name, dnd_spell.name as spell_name, dnd_spell_descriptors.spelldescriptor_id, dnd_spelldescriptor.name as descriptor_name, dnd_spellclasslevel.character_class_id, dnd_spellclasslevel.level as class_level, dnd_spelldomainlevel.domain_id, dnd_spelldomainlevel.level AS domain_level, dnd_domain.name AS domain_name, dnd_characterclass.name AS class_name, dnd_rulebook.name AS rulebook_name, dnd_rulebook.published ' // Disambiguate names
            + 'FROM dnd_spell ' // Main table
            + 'LEFT JOIN dnd_spellclasslevel on dnd_spell.id = dnd_spellclasslevel.spell_id ' // match spell level for each class
            + 'LEFT JOIN dnd_spellschool ON dnd_spell.school_id = dnd_spellschool.id ' // match domain names
            + 'LEFT JOIN dnd_spelldomainlevel ON dnd_spell.id = dnd_spelldomainlevel.spell_id ' // add in domain levels
            + 'LEFT JOIN dnd_domain ON dnd_spelldomainlevel.domain_id = dnd_domain.id ' // add in domain names
            + 'LEFT JOIN dnd_characterclass ON dnd_spellclasslevel.character_class_id = dnd_characterclass.id ' // add in class names
            + 'LEFT JOIN dnd_spell_descriptors ON dnd_spell.id = dnd_spell_descriptors.spell_id ' // add in spell descriptors ids
            + 'LEFT JOIN dnd_spelldescriptor ON dnd_spell_descriptors.spelldescriptor_id = dnd_spelldescriptor.id ' // add in spell descriptors names
            + 'LEFT JOIN dnd_rulebook ON dnd_spell.rulebook_id = dnd_rulebook.id ' // add in rulebooks
            + 'WHERE master_id = ' + id;
        await db.executeSql(queryString)
            .then(async ([results]) => {
                values = await QueryHelper.consolidate(results)
            });
        return QueryHelper.discardOldVersions(values);
    }

    static async queryAndInitialize (db, queryString) {
        let values = [];
        await db.executeSql(queryString)
            .then(([results]) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    values.push({id: results.rows.item(i).id, name: results.rows.item(i).name})
                }
        },
            (error) => console.log(error)
        );
        return values;
    }
}

export default QueryHelper;