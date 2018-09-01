import React from 'react';
import { View, ScrollView, Dimensions, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SearchItemModalPicker from './SearchItemModalPicker';
import { ThinBorderButton, TextSearchField } from './common';
import QueryHelper from './QueryHelper';
import * as actions from '../actions';
import { connect } from 'react-redux';

class SearchScreen extends React.Component {

    static navigationOptions = {
        title: 'Spell Search',
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
                this.props.storeDBConnection(db);
                this.initializeSelectables();
            },
            () => console.log('failed to open database')
        )
    }

    async initializeSelectables() {
        let { spellLevel, classes, domains, schools, descriptors } = JSON.parse(JSON.stringify(this.state));
        // Shortcut for spell levels, no need for a query
        for (let i = 0; i < 10; i++) {
            spellLevel.selectable.push({id: i, name: i});
        }

        classes.selectable = await QueryHelper.queryAndInitialize(this.state.db, 'SELECT * FROM dnd_characterclass WHERE id IN (SELECT DISTINCT character_class_id FROM dnd_spellclasslevel)');
        domains.selectable = await QueryHelper.queryAndInitialize(this.state.db, 'SELECT * FROM dnd_domain ORDER BY name');
        schools.selectable = await QueryHelper.queryAndInitialize(this.state.db, 'SELECT * FROM dnd_spellschool WHERE id IN (SELECT DISTINCT school_id FROM dnd_spell)');
        descriptors.selectable = await QueryHelper.queryAndInitialize(this.state.db, 'SELECT * FROM dnd_spelldescriptor WHERE id IN (SELECT DISTINCT spelldescriptor_id FROM dnd_spell_descriptors) ORDER BY name');
        
        this.setState({ spellLevel, classes, domains, schools, descriptors });
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

        QueryHelper.searchQuery(this.state)
            .then((newRecords) => {
                this.setState({spinnerVisible: false});
                this.props.navigation.navigate('Results', {records: newRecords});
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

                <ThinBorderButton color='#4286f4' onPress={() => this.query()} style={{margin: 15}}>
                    Search
                </ThinBorderButton>

                <ThinBorderButton color='#ee1111' small onPress={() => this.clear()} style={{marginBottom: 15}}>
                    Clear
                </ThinBorderButton>

                <View style={{ flex: 1 }}>
                    <Spinner visible={this.state.spinnerVisible} textContent={"Consulting manuals..."} textStyle={{color: '#FFF'}} overlayColor={'rgba(0,0,0,0.5)'} />
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

export default connect(null, actions)(SearchScreen);