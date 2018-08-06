import React from 'react';
import { View, Image, TextInput, Button, ScrollView, Dimensions, Alert, TouchableHighlight, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SearchItemModalPicker from './SearchItemModalPicker';
import { ThinBorderButton, TextSearchField } from './common';

class SearchScreen extends React.Component {

    static navigationOptions = {
        title: 'Search',
    };

    state = {
        db: null,
        spinnerVisible: false,
        records: [],
        spellName: '',
        spellText: '',
        spellLevel: {
            type: 'spellLevel',
            selectable: [], // {id: int, name: string}
            selected: []
        },
        classes: {
            type: 'classes',
            selectable: [],
            selected: []
        },
        domains: {
            type: 'domains',
            selectable: [],
            selected: []
        },
        schools: {
            type: 'schools',
            selectable: [],
            selected: []
        },
        descriptors: {
            type: 'descriptors',
            selectable: [],
            selected: []
        },
        savingThrow: {
            type: 'savingThrow',
            selectable: [{id: 0, name: 'fortitude'}, {id: 1, name: 'reflex'}, {id: 2, name: 'will'}, {id: 3, name: 'none'}],
            selected: []
        },
        spellResistance: {
            type: 'spellResistance',
            selectable: [{id: 0, name: 'yes'}, {id: 1, name: 'no'}],
            selected: []
        }
    }

    constructor(props) {
        super(props);
        // Setup db connection
        var SQLite = require('react-native-sqlite-storage');
        SQLite.enablePromise(true);
        SQLite.openDatabase(
            {
                name: 'dnd.db', // Arbitrary database name that will be created in sandbox
                createFromLocation: "~main.sqlite", // File name in \android\app\src\main\assets\
                location:'Library', // Sandbox location I guess
                readOnly: true
            },
            (db) => {
                console.log('database opened');
                this.state.db = db;
                this.initializeSelectables();
            },
            () => console.log('failed to open database')
        )
    }

    initializeSelectables() {
        // Shortcut for spell levels, no need for a query
        for (let i = 0; i < 10; i++) {
            this.state.spellLevel.selectable.push({id: i, name: i});
        }

        // Generic function for pushing names and ids, provided a query returning the ordered items to populate in name columns
        var queryAndInitialize = (tx, queryString, objectToPopulate) => {
            tx.executeSql(queryString, [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    objectToPopulate.selectable.push({id: results.rows.item(i).id, name: results.rows.item(i).name})
                }
            },
                (error) => console.log(error)
            );
        }

        this.state.db.transaction((tx) => {
            queryAndInitialize(tx, 'SELECT * FROM dnd_characterclass WHERE id IN (SELECT DISTINCT character_class_id FROM dnd_spellclasslevel)', this.state.classes);
            queryAndInitialize(tx, 'SELECT * FROM dnd_domain ORDER BY name', this.state.domains);
            queryAndInitialize(tx, 'SELECT * FROM dnd_spellschool WHERE id IN (SELECT DISTINCT school_id FROM dnd_spell)', this.state.schools);
            queryAndInitialize(tx, 'SELECT * FROM dnd_spelldescriptor WHERE id IN (SELECT DISTINCT spelldescriptor_id FROM dnd_spell_descriptors) ORDER BY name', this.state.descriptors);
            this.baseState = this.state;
        });
    }

    query() {
        if (this.state.spellName === '' && this.state.spellText === '' && this.state.spellLevel.selected.length === 0 && this.state.classes.selected.length === 0 && this.state.domains.selected.length === 0 && this.state.schools.selected.length === 0 && this.state.descriptors.selected.length === 0 && this.state.savingThrow.selected.length === 0) {
            let alertText = 'Select at least one search parameter';
            if (this.state.spellResistance.selected.length !== 0) {
                alertText = 'Select an additional search parameter';
            }
            Alert.alert(
                '',
                alertText,
                [{text: 'OK'}]
            );
            return;
        }

        this.setState({spinnerVisible: true});
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
        let levels = this.state.spellLevel.selected;
        let levelQueryString = '';
        if (levels.length !== 0) {
            levelQueryString += addLigature();
            levels.map(level => levelQueryString += ' dnd_spellclasslevel.level=' + level.id + ' OR dnd_spelldomainlevel.level=' + level.id + ' OR');
            levelQueryString = levelQueryString.substr(0, levelQueryString.length - 3) + ')';
        }
        let classes = this.state.classes.selected;
        classQueryString = '';
        if (classes.length !== 0) {
            classQueryString += addLigature();
            classes.map(sclass => classQueryString += ' dnd_spellclasslevel.character_class_id=' + sclass.id +  ' OR');
            classQueryString = classQueryString.substr(0, classQueryString.length - 3) + ')';
        }
        let domains = this.state.domains.selected;
        domainQueryString = '';
        if (domains.length !== 0) {
            domainQueryString += addLigature();
            domains.map(dom => domainQueryString += ' dnd_spelldomainlevel.domain_id=' + dom.id + ' OR');
            domainQueryString = domainQueryString.substr(0, domainQueryString.length - 3) + ')';
        }
        let schools = this.state.schools.selected;
        schoolQueryString = '';
        if (schools.length !== 0) {
            schoolQueryString += addLigature();
            schools.map(school => schoolQueryString += ' dnd_spell.school_id=' + school.id + ' OR');
            schoolQueryString = schoolQueryString.substr(0, schoolQueryString.length - 3) + ')';
        }
        let descriptors = this.state.descriptors.selected;
        descriptorQueryString = '';
        if (descriptors.length !== 0) {
            descriptorQueryString += addLigature();
            descriptors.map(descriptor => descriptorQueryString += ' dnd_spell_descriptors.spelldescriptor_id=' + descriptor.id + ' OR');
            descriptorQueryString = descriptorQueryString.substr(0, descriptorQueryString.length - 3) + ')';
        }
        let savingThrow = this.state.savingThrow.selected;
        let spellSTQueryString = '';
        if (savingThrow.length !== 0) {
            spellSTQueryString += addLigature();
            savingThrow.map((st) => spellSTQueryString += ' saving_throw LIKE \'%' + st.name + '%\' OR');
            spellSTQueryString = spellSTQueryString.substr(0, spellSTQueryString.length - 3) + ')';
        }
        let spellResistance = this.state.spellResistance.selected;
        let spellSRQueryString = '';
        if (spellResistance.length !== 0) {
            spellSRQueryString += addLigature();
            spellResistance.map((sr) => spellSRQueryString += ' spell_resistance LIKE \'%' + sr.name + '%\' OR');
            spellSRQueryString = spellSRQueryString.substr(0, spellSRQueryString.length - 3) + ')';
        }
        let spellName = this.state.spellName;
        let spellNameQueryString = '';
        if (spellName !== '') {
            spellNameQueryString += addLigature() + ' dnd_spell.name LIKE \'%' + spellName + '%\')';
        }
        let spellText = this.state.spellText;
        let spellTextQueryString = '';
        if (spellText !== '') {
            spellTextQueryString += addLigature() + ' dnd_spell.description LIKE \'%' + spellText + '%\')';
        }
        var newRecords = [];

        
        // Query for ids only of spells matching the criteria
        this.state.db.transaction((tx) => {
            let queryString = 
            'SELECT DISTINCT dnd_spell.id '
            + 'FROM dnd_spell ' // Main table
            + 'LEFT JOIN dnd_spellclasslevel on dnd_spell.id = dnd_spellclasslevel.spell_id ' // match spell level for each class
            + 'LEFT JOIN dnd_spelldomainlevel ON dnd_spell.id = dnd_spelldomainlevel.spell_id ' // add in domain levels
            + 'LEFT JOIN dnd_spell_descriptors ON dnd_spell.id = dnd_spell_descriptors.spell_id ' // add in spell descriptors ids
            + 'LEFT JOIN dnd_rulebook ON dnd_spell.rulebook_id = dnd_rulebook.id ' // add in rulebooks
            + levelQueryString + classQueryString + domainQueryString + schoolQueryString + descriptorQueryString + spellSTQueryString + spellSRQueryString + spellNameQueryString + spellTextQueryString + ' ORDER BY dnd_spell.name';
            console.log(queryString);
            tx.executeSql(queryString, [], async (tx, results) => { // Async function
                console.log("Query completed");
                newRecords = await populateRecords(results); // Wait for async populate records
                newRecords = discardOldVersions(newRecords); // Discard duplicates (due to spells published in more than one manual)
                this.setState({spinnerVisible: false});
                this.props.navigation.navigate('Results', {records: newRecords});
            });
        });

        var populateRecords = async (results) => { // Async, will wait for multiple querys

            // Take in results for a single spell and return a single row with consolidated details (classes, domains, descriptors, etc)
            var consolidate = (results) => {
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

            // Query complete details for each spell and consolidate in a single row
            newRecords = [];
            for (let i = 0; i < results.rows.length; i++) {
                await this.state.db.transaction((tx) => { // Wait for each query before returning results
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
                    tx.executeSql(queryString, [], (tx, singleSpellResults) => {
                        newRecords.push(consolidate(singleSpellResults));
                    }, (error) => (console.log(queryString)));
                });
                
            };
            return newRecords;

            
        }

        // Discard older versions of the spell but retain edition info for clarity
        var discardOldVersions = (records) => {
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
    }
       
    toggleItemSelection(type, item) {
        let newSelection = this.state[type].selected.slice();
        let index = newSelection.indexOf(item); // Find out if item is already selected
        if (index > -1) { // If it is
            newSelection.splice(index, 1); // Remove it
        } else {
            newSelection.push(item);
        }
        newSelection.sort();
        this.setState({[type]: {type: type, selectable: this.state[type].selectable, selected: newSelection}}); // Push changes to state
    }

    clear() {
        this.setState(this.baseState);
        this.spellNameInput.clear();
        this.spellTextInput.clear();
    }

    render() {
        
        const window = Dimensions.get('window');

        return (
            <ScrollView style={styles.container}>
                <TextSearchField
                    onChangeText={(text) => this.setState({spellName: text})}
                    placeholder={'Spell Name'}
                    textInputRef={(input) => { this.spellNameInput = input }}
                    style={{ marginTop: 15 }}
                />

                <SearchItemModalPicker
                    name='Spell Level'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.spellLevel} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                    selectableStyles={{width: window.width * 0.1, height: window.width * 0.1}}
                    selectableTextStyles={{fontSize: 18}}
                />
                
                <SearchItemModalPicker
                    name='Class'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.classes} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />
                
                <SearchItemModalPicker
                    name='Domain'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.domains} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />
                
                <SearchItemModalPicker
                    name='Spell School'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.schools} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, height: window.width * 0.7}}
                />
                
                <SearchItemModalPicker
                    name='Spell Descriptor'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.descriptors} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />
                
                <SearchItemModalPicker
                    name='Saving Throw'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.savingThrow} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />
                
                <SearchItemModalPicker
                    name='Spell Resistance'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.spellResistance} // Pass down the relevant current state though
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />

                <TextSearchField
                    onChangeText={(text) => this.setState({spellText: text})}
                    placeholder={'Spell Description'}
                    textInputRef={(input) => { this.spellTextInput = input }}
                    style={{ marginTop: 15 }}
                />

                <ThinBorderButton color='#4286f4' onPress={() => this.query()}>
                    Search
                </ThinBorderButton>

                <ThinBorderButton color='#ee1111' small onPress={() => this.clear()} style={{marginTop: 15}}>
                    Clear
                </ThinBorderButton>

                <View style={{ flex: 1 }}>
                  <Spinner visible={this.state.spinnerVisible} textContent={"Consulting manuals..."} textStyle={{color: '#FFF'}} />
                </View>
            </ScrollView>
        );
    }
}

var styles = {
    container: {
        flex: 1
    },
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    textInputImage: {
        flex: 0.065,
        height: 50,
        width: 50,
        marginRight: 5
    },
    spellNameInput: {
        flex: 1
    },
    spellTextInput: {
        flex: 1
    }
};

export default SearchScreen;