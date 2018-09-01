import React, { Component } from 'react';
import { View, ScrollView, Dimensions, TextInput, Button, Text, Alert, AsyncStorage, Switch } from 'react-native';
import SCTypeSelector from './SCTypeSelector';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import QueryHelper from './QueryHelper';
import SearchItemModalPicker from './SearchItemModalPicker';

class ProfileCreation extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params === undefined ? 'Create new profile' : 'Edit profile'
    });

    state = {
        newProfile: {
            id: null,
            name: '',
            type: '',
            lists: {classes: [], domains: []},
            available: [],
            prepared: [],
            slots: [
                { level: 0, available: 0, prepared: 0, exhausted: 0 },
                { level: 1, available: 0, prepared: 0, exhausted: 0 },
                { level: 2, available: 0, prepared: 0, exhausted: 0 },
                { level: 3, available: 0, prepared: 0, exhausted: 0 },
                { level: 4, available: 0, prepared: 0, exhausted: 0 },
                { level: 5, available: 0, prepared: 0, exhausted: 0 },
                { level: 6, available: 0, prepared: 0, exhausted: 0 },
                { level: 7, available: 0, prepared: 0, exhausted: 0 },
                { level: 8, available: 0, prepared: 0, exhausted: 0 },
                { level: 9, available: 0, prepared: 0, exhausted: 0 },
            ],
            fancyMode: false, // Fancy mode
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
        editing: false // Are we editing a profile or creating a new one ?
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.initializeSelectables();
        if (this.props.navigation.state.params !== undefined) {
            this.state.editing = true;
            // Retrieve profile from storage: navigation state might contain old data
            let profiles = JSON.parse(await AsyncStorage.getItem('profiles'));
            let profile = profiles.find((element) => element.id === this.props.navigation.state.params.id);
            this.populateEditing(profile);
        }
    }

    async saveProfile() {
        if (this.state.newProfile.name !== '' && this.state.newProfile.type !== '') {
            let profiles = JSON.parse(await AsyncStorage.getItem('profiles'));
            let profilesCreated = parseInt(await AsyncStorage.getItem('profilesCreated')) + 1;
            if (!this.state.editing) { // Up profiles count only if creating a new profile (used for generating unique ids)
                this.setState(({newProfile}) => ({newProfile: {...newProfile, id: profilesCreated}}));
            } else { // When editing, remove the original profile first
                profiles.splice(profiles.findIndex((element) => element.id === this.state.newProfile.id), 1);
            }
            profiles.push(this.state.newProfile);
            await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
            if (!this.state.editing) {
                await AsyncStorage.setItem('profilesCreated', '' + profilesCreated);
            }
            this.props.navigation.dispatch( // Replace navigation stack (so that going back does not come back here)
                StackActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Selection' }),
                        NavigationActions.navigate({ routeName: 'Selected', params: this.state.newProfile })
                    ]
                })
            );
        } else {
            Alert.alert(
                '',
                'Please enter a profile name and select a spellcaster type',
                [{text: 'OK'}]
            );
        }
    }

    async initializeSelectables() {
        selectableClasses = await QueryHelper.queryAndInitialize(this.props.db, 'SELECT * FROM dnd_characterclass WHERE id IN (SELECT DISTINCT character_class_id FROM dnd_spellclasslevel)');
        selectableDomains = await QueryHelper.queryAndInitialize(this.props.db, 'SELECT * FROM dnd_domain ORDER BY name');
        
        this.setState({
            classes: {...this.state.classes, selectable: selectableClasses},
            domains: {...this.state.domains, selectable: selectableDomains }
        });
    }

    populateEditing(profile) {
        this.setState({ newProfile: profile });
        this.setState(({newProfile}) => ({newProfile: {...newProfile, lists: {classes: profile.lists.classes, domains: profile.lists.domains}}}));
        this.setState(({classes}) => ({classes: {...classes, selected: profile.lists.classes }}));
        this.setState(({domains}) => ({domains: {...domains, selected: profile.lists.domains }}));
    }

    toggleItemSelection(type, item) {
        let newSelection = this.state[type].selected.slice();
        let index = newSelection.findIndex((element) => element.id === item.id); // Find out if item is already selected
        if (index > -1) { // If it is
            newSelection.splice(index, 1); // Remove it
        } else {
            newSelection.push(item);
        }
        newSelection.sort();
        this.setState(({newProfile}) => (
            {newProfile: {...newProfile, lists: {...newProfile.lists, [type]: newSelection}}}
        ));
        this.setState({
            [type]: {type: type, selectable: this.state[type].selectable, selected: newSelection }
        }); // Push changes to state
    }

    render() {
        const window = Dimensions.get('window');
        return(
            <ScrollView contentContainerStyle={styles.containerStyle}>
                <View>
                    <Text style={styles.textStyle}>Enter a profile name and select a spellcaster type.</Text>
                    <Text style={styles.textStyle}>Prepared spellcasters from spellbook have a learned spells list and a prepared spells list, such as wizards.</Text>
                    <Text style={styles.textStyle}>Prepared spellcasters from list know all spells available to them and have a prepared spells list, such as clerics.</Text>
                    <Text style={styles.textStyle}>Spontaneous spellcasters have a known spells list and an available slots list.</Text>
                    <Text style={styles.textStyle}>This determines the level that a spell is listed at in a profile (with the lowest being used if a profile has no or multiple classes with the spell on their list).</Text>
                    <Text style={styles.textStyle}>This also determines which spells will be shown by selecting the "add class/domain list spells".</Text>
                </View>
                <View style={styles.innerContainerStyle}>
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={(text) => this.setState(({newProfile}) => ({newProfile: {...newProfile, name: text}}))} // setState is shallow ! Update only name
                        autoCorrect={false}
                        autoFocus={false}
                        placeholder='Enter Profile Name'
                        value={this.state.newProfile.name}
                    />
                </View>
                <View style={styles.innerContainerStyle}>
                    <SCTypeSelector
                        onChange={(option) => {this.setState(({newProfile}) => ({newProfile: {...newProfile, type: option.type}}))}}
                        style={styles.selectorStyle}
                        initValue={this.state.newProfile.type}
                    />
                </View>
                <View>
                    <Text style={styles.textStyle}>Select the class and/or domain list, if any, from which this profile can draw their spells from. This determines at which spell level this profile can prepare a spell when a spell is present in multiple class and/or domain lists at different levels. When selecting multiple lists, spells will be listed at the lowest available level among the selected lists. This does not prevent spells from other lists from being added to the profile.</Text>
                </View>
                <SearchItemModalPicker
                    name='Class Spell Lists'
                    toggleItem={this.toggleItemSelection.bind(this)}
                    selectionInfo={this.state.classes}
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />
                <SearchItemModalPicker
                    name='Domain Spell Lists'
                    toggleItem={this.toggleItemSelection.bind(this)}
                    selectionInfo={this.state.domains}
                    modalStyles={{width: window.width * 0.7, maxHeight: window.height * 0.5}}
                />
                <View style={styles.fancyModeContainer}>
                    <Text style={{marginRight: 5, fontSize: 17}}>🌈 Mode</Text>
                    <Switch
                        value={this.state.newProfile.fancyMode} style={{tintColor: '#aaa'}}
                        onValueChange={(value) => this.setState(({newProfile}) => ({newProfile: {...newProfile, fancyMode: value}}))}
                    />
                </View>
                <Button
                    style={{alignSelf: 'flex-end'}}
                    title={this.state.editing ? 'Save Profile' : 'Create Profile'}
                    onPress={this.saveProfile.bind(this)}>
                </Button>
            </ScrollView>
        );
    }

}

const styles = {
    containerStyle: {
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: 10
    },
    textStyle: {
        fontSize: 12,
        color: '#222',
        textAlign: 'left'
    },
    innerContainerStyle: {
        borderBottom: 1,
        borderColor: '#aaa'
    },
    textInputStyle: {
        height: 36,
        fontSize: 16,
        textAlign: 'center',
        padding: 3,
        marginTop: 15
    },
    selectorStyle: {
        height: 36,
        borderWidth: 0,
        margin: 5
    },
    fancyModeContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    }
}

const mapStateToProps = state => {
    return { db: state.dataBase }
}

export default connect(mapStateToProps)(ProfileCreation);