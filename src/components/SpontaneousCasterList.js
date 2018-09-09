import React, { Component } from 'react';
import { View, AsyncStorage, LayoutAnimation, Alert, Image, Dimensions } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Spinner from 'react-native-loading-spinner-overlay';
import SpellSlotElement from './SpellSlotElement';
import SpontaneousSpellListElement from './SpontaneousSpellListElement'
import QueryHelper from './QueryHelper';
import AvailableSpellListFooter from './AvailableSpellListFooter';
import { connect } from 'react-redux';
import { showMessage } from "react-native-flash-message";
import SpontaneousSpellListRestoreButton from './SpontaneousSpellListRestoreButton';

class SpontaneousCasterList extends Component {

    state = {
        profile: undefined, // Initialize with prop profile, then update right away from async storage
        sections: [], // Store processed sections here for list
        spells: [], // Spells manually added by user
        listSpells: [], // Spells from profile list preferences
        castingImage: false
    }

    componentDidMount() {
        this.subs = [this.props.navigation.addListener('didFocus', () => this.updateList()),]; // subscribe to navigation event "didFocus", and trigger a spell reload
        this.setState({ spinnerVisible: true });
        this.updateList();
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    async componentWillReceiveProps(nextProps) {
        // Respond to request to show list spells from navigator header button
        if (nextProps.screenProps.showListSpells !== this.props.screenProps.showListSpells) {
            LayoutAnimation.spring();
            await this.queryListSpells(nextProps.screenProps.showListSpells);
            await this.updateList();
        }
    }

    async queryListSpells(doQuery) {
        this.setState({ spinnerVisible: true });
        var listSpells = []
        if (doQuery && this.state.profile !== undefined && (this.state.profile.lists.classes.length > 0 || this.state.profile.lists.domains.length > 0)) {
            classes = this.state.profile.lists.classes.length > 0 ? this.state.profile.lists.classes : [];
            domains = this.state.profile.lists.domains.length > 0 ? this.state.profile.lists.domains : [];
            listSpells = await QueryHelper.searchQuery({db: this.props.db, spellLevel: {selected: []}, classes: {selected: classes}, domains: {selected: domains}, schools: {selected: []}, descriptors: {selected: []}, savingThrow: {selected: []}, spellResistance: {selected: []}, spellName: '', spellText: ''});
        }
        this.setState({ listSpells });
    }

    async updateList() {
        // Always update profile
        var oldProfile = this.state.profile;
        let profiles = []
        profiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        profile = profiles.find((element) => element.id === this.props.screenProps.id);
        this.setState({ profile });

        // Query spells from DB if first load or if contents have changed
        if (oldProfile === undefined || !(profile.available.length === oldProfile.available.length && profile.available.sort().every(function(value, index) { return value === oldProfile.available.sort()[index]}))) {
            var spells = [];
            // Query user added spells
            await Promise.all(
                profile.available.map(async (spell) => {
                    await QueryHelper.getSpellById(this.props.db, spell.id)
                        .then((newSpell) => {
                            spells.push(newSpell);
                        });
                })
            );
            this.setState({ spells });
        }

        this.generateSections();
    }

    async changeSlots(slots, value) {
        profile = JSON.parse(JSON.stringify(this.state.profile));
        if (value > (slots.available + slots.exhausted)) {
            slots.available++;
        } else if (value < (slots.available + slots.exhausted)) {
            if (slots.available > 0) {
                slots.available--;
            } else {
                slots.exhausted--;
            }
        }
        profile.slots[profile.slots.findIndex((element) => element.level === slots.level)] = slots;
        this.setState({ profile });
        let newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
        newProfiles.push(this.state.profile);
        newProfiles.sort((a, b) => a.id - b.id);
        await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
        await this.updateList();
    }

    async deleteSpell(item) {
        let alertText = 'Remove ' + item.spell_name + ' from known spells?';
        Alert.alert(
            '',
            alertText,
            [
                {text: 'Keep', onPress: null, style: 'cancel'},
                {text: 'Remove', onPress: async () =>  await performDelete(item)}
            ],
            { cancelable: false }
        );
        performDelete = async (item) => {
            let spells = this.state.spells.slice();
            spells.splice(spells.findIndex((element) => element.master_id === item.master_id), 1);
            let profiles = []
            try {
                profiles = JSON.parse((await AsyncStorage.getItem('profiles')));
            } catch (error) {
                console.log(error);
            }
            (profiles.find((element) => element.id === this.props.screenProps.id)).available.splice(profile.available.findIndex((element) => element.id === item.master_id), 1); // Remove spell from current profile
            LayoutAnimation.spring();
            this.setState({ spells });
            await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
            this.updateList();
        }
    }

    async castSpell(item) {
        profile = JSON.parse(JSON.stringify(this.state.profile));
        let slot = profile.slots.find((element) => element.level === item.lowestLevel);
        if (slot.available < 1) {
            showMessage({
                message: 'Can not cast ' + item.spell_name + ', no level ' + slot.level + ' available slots remaining.',
                type: 'danger',
                duration: 3000,
                floating: true,
                icon: 'danger'
            });
            return;
        }
        slot.available--;
        slot.exhausted++;
        this.setState({profile});
        newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
        newProfiles.push(this.state.profile);
        newProfiles.sort((a, b) => a.id - b.id);
        await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));

        // Play animation
        if (this.state.profile.fancyMode) {
            this.setState({castingImage: true});
            setTimeout(() => this.setState({castingImage: false}), 1500);
        }

        await this.updateList();
    }

    async restoreSpells() {
        var performRestore = async () => {    
            profile = JSON.parse(JSON.stringify(this.state.profile));
            profile.slots.forEach((slot) => {
                let toRestore = slot.exhausted;
                slot.exhausted = 0;
                slot.available += toRestore;
            });
            this.setState({profile});
            newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
            newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
            newProfiles.push(this.state.profile);
            newProfiles.sort((a, b) => a.id - b.id);
            await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
            await this.updateList();
            showMessage({
                message: 'All slots restored!',
                type: 'success',
                duration: 3000,
                floating: true,
                icon: 'success'
            });
        }

        let alertText = 'Restore exhausted slots?';
        Alert.alert(
            '',
            alertText,
            [
                {text: 'Cancel', onPress: null, style: 'cancel'},
                {text: 'Restore', onPress: async () =>  await performRestore()}
            ],
            { cancelable: false }
        );
    }

    renderItem({item, index, section}) {
        profileItem = profile.prepared.find((element) => element.id === item.master_id && element.level === item.preparedLevel && element.modifier === item.modifier);
        return(
            <SpontaneousSpellListElement
                record={item}
                amount={profileItem !== undefined ? profileItem.amount : 0}
                nav={() => this.props.navigation.navigate('SpellDetailInProfile', {record: item})} // Navigate to detail function for child to display
                castSpell={() => this.castSpell(item)}
                restoreSingleSpell={() => this.deleteSpell(item)}
            />
        );
    }

    renderSectionHeader({section}) {
        return(
            <SpellSlotElement
                slots={section.slots}
                changeSlots={(value) => this.changeSlots(section.slots, value)}
            />
        );
    }

    // Generate available spell list associating each spell with the lowest castable level according to this profile's classes/domains preferences
    generateSections() {
        let sections = [];
        for (let i = 0; i < 10; i++) {
            if (this.state.profile !== undefined) {
                sections.push({title: 'Level ' + i, slots: this.state.profile.slots[this.state.profile.slots.findIndex(element => element.level === i)], data:[]})
            } else {
                sections.push({title: 'Level ' + i, slots: {level: i, available: 0, prepared: 0, exhausted: 0}, data:[]})
            }
        }

        // Private function, for each spell, sets a lowestLevel property
        const setLowestLevel = (spells) => {
            retSpells = [];
            spells.forEach((stateSpell) => {
                let lowestClassDomainLevelMatch = 100; // Store lowest match from profile lists prefs here
                let lowestClassDomainLevelForSpell = 100; // Store fallback lowest for spell here
                if (stateSpell.class !== undefined && stateSpell.class.length > 0) { // First sort through classes
                    stateSpell.class.forEach((stateSpellClass) => {
                        lowestClassDomainLevelForSpell = Math.min(lowestClassDomainLevelForSpell, stateSpellClass.level);
                        this.state.profile.lists.classes.forEach((profileClass) => {
                            if (stateSpellClass.id === profileClass.id) {
                                lowestClassDomainLevelMatch = Math.min(lowestClassDomainLevelMatch, stateSpellClass.level);
                            }
                        });
                    });
                }
                if (stateSpell.domain !== undefined && stateSpell.domain.length > 0) { // Then domains
                    stateSpell.domain.forEach((stateSpellDomain) => {
                        lowestClassDomainLevelForSpell = Math.min(lowestClassDomainLevelForSpell, stateSpellDomain.level);
                        this.state.profile.lists.domains.forEach((profileDomain) => {
                            if (stateSpellDomain.id === profileDomain.id) {
                                lowestClassDomainLevelMatch = Math.min(lowestClassDomainLevelMatch, stateSpellDomain.level);
                            }
                        });
                    });
                }
                let level = lowestClassDomainLevelMatch === 100 ? lowestClassDomainLevelForSpell : lowestClassDomainLevelMatch;
                stateSpell.lowestLevel = level; // Add in lowest level for this profile
                retSpells.push(stateSpell);
            });
            return retSpells;
        }
        
        userSpells = setLowestLevel(this.state.spells.slice()); // Process user added spells
        userSpells.sort((a, b) => a.spell_name.localeCompare(b.spell_name));
        userSpells.forEach((userSpell) => sections[userSpell.lowestLevel].data.push(userSpell)); // Add to sections

        if (this.props.screenProps.showListSpells) { // Only process and add list spells if flag enabled
            listSpells = setLowestLevel(this.state.listSpells.slice());
            listSpells.sort((a, b) => a.spell_name.localeCompare(b.spell_name));
            listSpells.forEach((listSpell) => {
                duplicate = userSpells.find((element) => element.master_id === listSpell.master_id); // Don't list duplicates of already added spells
                if (duplicate === undefined) {
                    listSpell.listSpell = true; // Flag as listSpell
                    sections[listSpell.lowestLevel].data.push(listSpell);
                }
            });
        }
        
        this.setState({ sections, spinnerVisible: false });
    }

    renderFooter() {
        return(
            <View>
                <AvailableSpellListFooter
                    nav={() => this.props.navigation.navigate('SearchModule')}
                />
                <SpontaneousSpellListRestoreButton
                    restoreExhausted={() => this.restoreSpells()}
                />
            </View>
        );
    }

    render() {
        return (
            <View>
                <SwipeListView
                    useSectionList
                    stickySectionHeadersEnabled
                    directionalDistanceChangeThreshold={6}
                    sections={this.state.sections}
                    renderItem={this.renderItem.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)}
                    keyExtractor={(spell) => JSON.stringify(spell.master_id)}
                    ListFooterComponent={this.renderFooter()}
                />
                <View style={{ flex: 1 }}>
                    <Spinner visible={this.state.spinnerVisible} textContent={"Retrieving Spells..."} textStyle={{color: '#FFF'}} overlayColor={'rgba(0,0,0,0.5)'} />
                </View>
                {this.state.castingImage ?
                <View style={{flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: Dimensions.get('window').width*0.75, borderRadius: 10}} source={require('../img/spellCast.gif')} resizeMode='contain' />
                </View>
                : null}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { db: state.dataBase }
}

export default connect(mapStateToProps)(SpontaneousCasterList);