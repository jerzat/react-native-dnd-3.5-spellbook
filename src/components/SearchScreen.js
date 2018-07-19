import React from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import SearchItemModalPicker from './SearchItemModalPicker';

class SearchScreen extends React.Component {

    static navigationOptions = {
        title: 'Search',
    };

    state = {
        db: null,
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
        schools: {
            type: 'schools',
            selectable: [],
            selected: []
        },
        descriptors: {
            type: 'descriptors',
            selectable: [],
            selected: []
        }
    }

    constructor(props) {
        super(props);
        // Setup db connection
        var SQLite = require('react-native-sqlite-storage');
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
                this.initializeSelectables(db);
            },
            () => console.log('failed to open database')
        )
    }

    initializeSelectables(db) {
        // Shortcut for spell levels, no need for a query
        for (let i = 0; i < 10; i++) {
            this.state.spellLevel.selectable.push({id: i, name: i});
        }

        this.state.db.transaction((tx) => {
            // Spell Classes
            let queryString = "SELECT * FROM dnd_characterclass WHERE id IN (SELECT DISTINCT character_class_id FROM dnd_spellclasslevel)";
            tx.executeSql(queryString, [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    this.state.classes.selectable.push({id: results.rows.item(i).id, name: results.rows.item(i).name})
                }
            },
                (error) => console.log(error)
            );
            // Schools
            queryString = "SELECT * FROM dnd_spellschool WHERE id IN (SELECT DISTINCT school_id FROM dnd_spell)";
            tx.executeSql(queryString, [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    this.state.schools.selectable.push({id: results.rows.item(i).id, name: results.rows.item(i).name})
                }
            },
                (error) => console.log(error)
            );
            // Descriptors
            queryString = "SELECT * FROM dnd_spelldescriptor WHERE id IN (SELECT DISTINCT spelldescriptor_id FROM dnd_spell_descriptors)";
            tx.executeSql(queryString, [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    this.state.descriptors.selectable.push({id: results.rows.item(i).id, name: results.rows.item(i).name})
                }
            },
                (error) => console.log(error)
            );
        });
    }

    query() {
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
            levels.map(level => levelQueryString += ' dnd_spellclasslevel.level=' + level.id + ' OR');
            levelQueryString = levelQueryString.substr(0, levelQueryString.length - 3) + ')';
        }
        let classes = this.state.classes.selected;
        classQueryString = '';
        if (classes.length !== 0) {
            classQueryString += addLigature();
            classes.map(sclass => classQueryString += ' dnd_spellclasslevel.character_class_id=' + sclass.id + ' OR');
            classQueryString = classQueryString.substr(0, classQueryString.length - 3) + ')';
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
        this.state.db.transaction((tx) => {
            let queryString = 'SELECT *, dnd_spell.id as master_id, dnd_spellschool.name AS school_name, dnd_spell.name as spell_name, dnd_spelldescriptor.name as descriptor_name, dnd_spellclasslevel.level as class_level, dnd_spelldomainlevel.level AS domain_level, dnd_domain.name AS domain_name, dnd_characterclass.name AS class_name ' // Disambiguate names
            + 'FROM dnd_spell ' // Main table
            + 'INNER JOIN dnd_spellclasslevel on dnd_spell.id = dnd_spellclasslevel.spell_id ' // match spell level for each class
            + 'INNER JOIN dnd_spellschool ON dnd_spell.school_id = dnd_spellschool.id ' // match domain names
            + 'LEFT JOIN dnd_spelldomainlevel ON dnd_spell.id = dnd_spelldomainlevel.spell_id ' // add in domain levels
            //	group_concat(dnd_spelldescriptor.name, ', ') as descriptor_name,
            + 'LEFT JOIN dnd_domain ON dnd_spelldomainlevel.domain_id = dnd_domain.id ' // add in domain names
            + 'LEFT JOIN dnd_characterclass ON dnd_spellclasslevel.character_class_id = dnd_characterclass.id ' // add in class names
            + 'LEFT JOIN dnd_spell_descriptors ON dnd_spell.id = dnd_spell_descriptors.spell_id ' // add in spell descriptors ids
            + 'LEFT JOIN dnd_spelldescriptor ON dnd_spell_descriptors.spelldescriptor_id = dnd_spelldescriptor.id ' // add in spell descriptors names
            + levelQueryString + classQueryString + schoolQueryString + descriptorQueryString + spellNameQueryString + spellTextQueryString;
            console.log(queryString);
            tx.executeSql(queryString, [], (tx, results) => {
                console.log("Query completed");
    
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    newRecords.push(row);
                }
                this.props.navigation.navigate('Results', {records: newRecords});
            });
        });
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

    render() {
        
        const { navigate } = this.props.navigation;

        return (
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.spellNameInput}
                    onChangeText={(text) => this.setState({spellName: text})}
                    autoCorrect={false}
                    autoFocus={false}
                    clearTextOnFocus={true}
                    placeholder={'Spell Name'}
                />

                <SearchItemModalPicker
                    name='Spell Level'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.spellLevel} // Pass down the relevant current state though
                    modalStyles={{width: 200, height: 120}}
                />
                
                <SearchItemModalPicker
                    name='Class'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.classes} // Pass down the relevant current state though
                    modalStyles={{width: 300, height: 300}}
                />
                
                <SearchItemModalPicker
                    name='Spell School'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.schools} // Pass down the relevant current state though
                    modalStyles={{width: 250, height: 250}}
                />
                
                <SearchItemModalPicker
                    name='Spell Descriptor'
                    toggleItem={this.toggleItemSelection.bind(this)} // Handle state update in this component
                    selectionInfo={this.state.descriptors} // Pass down the relevant current state though
                    modalStyles={{width: 250, height: 250}}
                />

                <TextInput
                    style={styles.spellTextInput}
                    onChangeText={(text) => this.setState({spellText: text})}
                    autoCorrect={false}
                    autoFocus={false}
                    clearTextOnFocus={true}
                    placeholder={'Spell Description'}
                />

                <Button
                    style={styles.searchButton}
                    title="Search"
                    onPress={() => {
                        this.query();
                    }}
                />
            </ScrollView>
        );
    }
}

var styles = {
    container: {
        flex: 1
    },
    spellNameInput: {
        borderRadius: 5,
        borderWidth: 0,
        marginLeft: 10,
        marginRight: 10
    },
    spellTextInput: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 25
    }
};

export default SearchScreen;