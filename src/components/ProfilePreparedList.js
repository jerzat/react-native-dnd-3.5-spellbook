import React, { Component } from 'react';
import { View, AsyncStorage, LayoutAnimation, Alert, Image, Dimensions } from 'react-native';
import QueryHelper from './QueryHelper';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import PreparedSpellListElement from './PreparedSpellListElement';
import PreparedSectionListHeader from './PreparedSectionListHeader';
import PreparedSpellListRestoreButtons from './PreparedSpellListRestoreButtons';

class ProfilePreparedList extends Component {

    state = {
        profile: undefined,
        spells: [],
        sections: [],
        castingImage: false
    }

    componentDidMount() {
        this.subs = [this.props.navigation.addListener('didFocus', () => this.getSpells()),]; // subscribe to navigation event "didFocus", and trigger a spell reload
        this.getSpells();
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    // Query spells from database
    async getSpells() {
        let spells = this.state.spells.splice();
        
        let profiles = []
        try {
            profiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        } catch (error) {
            console.log(error);
        }
        profile = profiles.find((element) => element.id === this.props.profile.id);
        
        await Promise.all(
            profile.prepared.map(async (spell) => {
                await QueryHelper.getSpellById(this.props.db, spell.id)
                    .then((newSpell) => {
                        newSpell.preparedLevel = spell.level;
                        newSpell.modifier = spell.modifier;
                        if (spell.modifier !== undefined) {
                            newSpell.spell_name = spell.modifier + ' ' + newSpell.spell_name;
                        }
                        spells.push(newSpell);
                    });
            })
        );
        this.setState({ spells, profile });
        this.generateSections();
    }

    // Handle changing total slots available for a certain spell level through stepper in section header
    async changeSlots(newValue, slots) {
        newSlots = this.state.profile.slots.slice();
        if (newValue > (slots.available + slots.prepared + slots.exhausted)) { // When incrementing, add to available slots
            newSlots.find((element) => element.level === slots.level).available++;
        } else if (newValue < (slots.available + slots.prepared + slots.exhausted)) { // When decrementing, remove from available slots first, then exhausted, then remove a prepared spell
            if (slots.available > 0) {
                newSlots.find((element) => element.level === slots.level).available--;
            } else if (slots.exhausted > 0) {
                newSlots.find((element) => element.level === slots.level).exhausted--;
            } else {
                newSlots.find((element) => element.level === slots.level).prepared--;
                prepared = this.state.profile.prepared.slice();
                spellToRemove = prepared.find((element) => element.level === slots.level);
                if (spellToRemove.amount > 1) {
                    spellToRemove.amount--;
                } else {
                    prepared.splice(prepared.findIndex((element) => element === spellToRemove), 1);
                    LayoutAnimation.spring();
                    this.setState(({profile}) => ({profile: {...profile, prepared: prepared}}));
                }
            }
        }
        this.setState(({profile}) => ({profile: {...profile, slots: newSlots}}));
        newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
        newProfiles.push(this.state.profile);
        newProfiles.sort((a, b) => a.id - b.id);
        await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
        await this.getSpells();
    }

    async castSpell(item) {
        profile = JSON.parse(JSON.stringify(this.state.profile));
        let slot = profile.slots.find((element) => element.level === item.preparedLevel);
        slot.prepared--;
        slot.exhausted++;
        preparedSpell = profile.prepared.find((element) => element.id === item.master_id && element.level === item.preparedLevel && element.modifier === item.modifier);
        preparedSpell.amount--;
        if (preparedSpell.amount < 1) {
            LayoutAnimation.spring();
            profile.prepared.splice(profile.prepared.findIndex((element) => element === preparedSpell), 1);
        }
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

        await this.getSpells();
    }

    async restoreSpells(all) {
        var performDelete = async (all) => {    
            profile = JSON.parse(JSON.stringify(this.state.profile));
            profile.slots.forEach((slot) => {
                let toRestore = slot.exhausted;
                if (all) {
                    toRestore += slot.prepared;
                    slot.prepared = 0;
                    profile.prepared = [];
                }
                slot.exhausted = 0;
                slot.available += toRestore;
            });
            LayoutAnimation.spring();
            this.setState({profile});
            newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
            newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
            newProfiles.push(this.state.profile);
            newProfiles.sort((a, b) => a.id - b.id);
            await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
            await this.getSpells();
        }

        let alertText = 'Restore ' + (all ? 'all' : 'exhausted') + ' spells?';
        Alert.alert(
            '',
            alertText,
            [
                {text: 'Cancel', onPress: null, style: 'cancel'},
                {text: 'Restore', onPress: async () =>  await performDelete(all)}
            ],
            { cancelable: false }
        );
    }

    // Actually same as casting except for slot.available/exhausted, might want to condense this ...
    async restoreSingleSpell(item) {
        profile = JSON.parse(JSON.stringify(this.state.profile));
        let slot = profile.slots.find((element) => element.level === item.preparedLevel);
        slot.prepared--;
        slot.available++;
        preparedSpell = profile.prepared.find((element) => element.id === item.master_id && element.level === item.preparedLevel && element.modifier === item.modifier);
        preparedSpell.amount--;
        if (preparedSpell.amount < 1) {
            LayoutAnimation.spring();
            profile.prepared.splice(profile.prepared.findIndex((element) => element === preparedSpell), 1);
        }
        this.setState({profile});
        newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
        newProfiles.push(this.state.profile);
        newProfiles.sort((a, b) => a.id - b.id);
        await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
        await this.getSpells();
    }

    renderItem({item, index, section}) {
        profileItem = profile.prepared.find((element) => element.id === item.master_id && element.level === item.preparedLevel && element.modifier === item.modifier);
        if (profileItem !== undefined) {
            item.originalLevel = profileItem.originalLevel;
        }
        return(
            <PreparedSpellListElement
                record={item}
                amount={profileItem !== undefined ? profileItem.amount : 0}
                nav={() => this.props.navigation.navigate('SpellDetailInProfile', {record: item})} // Navigate to detail function for child to display
                castSpell={() => this.castSpell(item)}
                restoreSingleSpell={() => this.restoreSingleSpell(item)}
            />
        );
    }

    renderSectionHeader({section}) {
        return(
            <PreparedSectionListHeader 
                slots={section.slots}
                changeSlots={(value) => this.changeSlots(value, section.slots)}
            />
        );
    }

    generateSections() {
        let sections = [];
        if (this.state.profile !== undefined) {
            for (let i = 0; i < 10; i++) {
                sections.push({slots: this.state.profile.slots[this.state.profile.slots.findIndex(element => element.level === i)], data:[]})
            }
            this.state.spells.forEach((stateSpell) => {
                sections[stateSpell.preparedLevel].data.push(stateSpell);
            });
        }
        this.setState({sections});
    }

    renderRestoreButtons() {
        return(
            <PreparedSpellListRestoreButtons
                restoreExhausted={() => this.restoreSpells(false)}
                restoreAll={() => this.restoreSpells(true)}
            />
        );
    }

    render() {
        return (
            <View>
                <SwipeListView
                    useSectionList
                    stickySectionHeadersEnabled
                    sections={this.state.sections}
                    renderItem={this.renderItem.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)}
                    keyExtractor={(spell) => JSON.stringify(spell.master_id) + spell.spell_name}
                    ListFooterComponent={this.renderRestoreButtons()}
                />
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

export default connect(mapStateToProps)(ProfilePreparedList);