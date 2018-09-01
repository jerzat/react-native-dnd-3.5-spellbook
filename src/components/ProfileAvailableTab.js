import React, { Component } from 'react';
import { View, AsyncStorage, LayoutAnimation, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Spinner from 'react-native-loading-spinner-overlay';
import AvailableSpellListElement from './AvailableSpellListElement';
import QueryHelper from './QueryHelper';
import { connect } from 'react-redux';
import AvailableSectionListHeader from './AvailableSectionListHeader';
import AvailableSpellListFooter from './AvailableSpellListFooter';
import { BorderDismissableModal } from './common';
import PrepareSpellModal from './PrepareSpellModal';
import { showMessage } from "react-native-flash-message";

class ProfileAvailableTab extends Component {

    state = {
        spells: [],
        profile: undefined,
        sections: [], // Store processed sections here for list
        prepareSpellModal: {visible: false, item: undefined},
        listSpells: [], // Spells from profile list preferences
        spinnerVisible: false
    }

    static navigationOptions = ({ screenProps }) => { // Set up tab label
        let label = '';
        switch (screenProps.type) {
            case 'preparedSpellbook':
                label = 'Spellbook';
                break;
            case 'preparedList':
                label = 'Favorites';
                break;
            case 'spontaneous':
                label = 'Spells Known'
                break;
            default:
                label = 'error'
        }
        return { tabBarLabel: label }
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

        const performDelete = async (item)  => {
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
            this.generateSections();
        }
    }

    // Prepare spell once if a slot is available at the same level
    async prepareSimple(item) {
        newProfile = JSON.parse(JSON.stringify(this.state.profile));
        let slot = newProfile.slots.find((element) => element.level === item.lowestLevel);
        if (slot.available > 0) {
            slot.available--;
            slot.prepared++;
            alreadyPrepSpell = newProfile.prepared.find((element) => element.id === item.master_id && element.level === item.lowestLevel && element.modifier === '');
            if (alreadyPrepSpell !== undefined) {
                alreadyPrepSpell.amount++;
            } else {
                newProfile.prepared.push({id: item.master_id, level: item.lowestLevel, amount: 1, modifier: ''});
            }
            this.setState({profile: newProfile});
            profiles = JSON.parse((await AsyncStorage.getItem('profiles')));
            profiles.splice(profiles.findIndex((element) => element.id === this.props.screenProps.id), 1);
            profiles.push(newProfile);
            await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
            showMessage({
                message: 'Prepared ' + item.spell_name + ', ' + slot.available + ' slots remaining.',
                type: 'success',
                duration: 3000,
                floating: true,
                icon: 'success'
            });
        } else {
            showMessage({
                message: 'Can not prepare ' + item.spell_name + ', no level ' + slot.level + ' slots remaining.',
                type: 'danger',
                duration: 3000,
                floating: true,
                icon: 'danger'
            });
        }
    }

    // Prepare a spell with level, amount and modifier specified in modal dialog
    async prepareSpell(item, level, amount, modifier) {
        if (amount === 0) {
            Alert.alert(
                '',
                'No available slots for level ' + level,
                [
                    {text: 'Ok', onPress: null, style: 'cancel'},
                ]
            );
            return;
        }
        console.log('Requested prepare action for ' + amount + ' ' + item.spell_name + '(s) in a slot of level ' + level + ' width modifier ' + modifier);
        var newProfile = JSON.parse(JSON.stringify(this.state.profile));
        var slot = newProfile.slots.find((element) => element.level === level);
        slot.available -= amount;
        slot.prepared += amount;
        var alreadyPrepSpell = newProfile.prepared.find((element) => element.id === item.master_id && element.level === level && element.modifier === modifier);
        if (alreadyPrepSpell !== undefined) {
            alreadyPrepSpell.amount += amount;
        } else {
            newProfile.prepared.push({id: item.master_id, level: level, amount: amount, modifier: modifier});
        }
        this.setState({profile: newProfile});
        profiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        profiles.splice(profiles.findIndex((element) => element.id === this.props.screenProps.id), 1);
        profiles.push(newProfile);
        await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
        this.setState({prepareSpellModal: {visible: false}});
        showMessage({
            message: 'Prepared ' + amount + ' ' + modifier + ' ' + item.spell_name + '(s) in level ' + level + ' slot(s), ' + slot.available + ' slots remaining.',
            type: 'success',
            duration: 3000,
            floating: true,
            icon: 'success'
        });
    }

    async toggleFavorite(item) {
        profile = JSON.parse(JSON.stringify(this.state.profile));
        slotItem = profile.available.find((element) => element.id === item.master_id);
        slotItem.favorite = !slotItem.favorite;
        this.setState({ profile });
        profiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        profiles.splice(profiles.findIndex((element) => element.id === this.props.screenProps.id), 1);
        profiles.push(profile);
        await AsyncStorage.setItem('profiles', JSON.stringify(profiles));

        // Fast feedback, or we have to wait for getSpells
        /*
        sections = this.state.sections.slice();
        sections[item.lowestLevel].data.find((element) => element.master_id === item.master_id).favorite = slotItem.favorite;
        this.setState({ sections })
        */

        this.updateList();
    }

    renderItem({item, index, section}) {
        return(
            <AvailableSpellListElement
                record={item}
                nav={() => this.props.navigation.navigate('SpellDetailInProfile', {record: item})} // Navigate to detail function for child to display
                deleteItem={() => this.deleteSpell(item)}
                prepareSimple={() => this.prepareSimple(item)}
                prepare={() => this.setState({prepareSpellModal: {visible: true, item: item}})}
                toggleFavorite={() => this.toggleFavorite(item)}
            />
        );
    }

    renderSectionHeader({section: { title }}) {
        return(
            <AvailableSectionListHeader>{title}</AvailableSectionListHeader>
        );
    }

    // Generate available spell list associating each spell with the lowest castable level according to this profile's classes/domains preferences
    generateSections() {
        let sections = [];
        for (let i = 0; i < 10; i++) {
            sections.push({title: 'Level ' + i, data:[]})
        }

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

        userSpells = setLowestLevel(this.state.spells.slice());
        userSpells.forEach((userSpell) => {
            userSpell.favorite = this.state.profile.available.find((element) => element.id === userSpell.master_id).favorite;
            sections[userSpell.lowestLevel].data.push(userSpell)
        });

        if (this.props.screenProps.showListSpells) { // Only process and add list spells if flag enabled
            listSpells = setLowestLevel(this.state.listSpells.slice());
            listSpells.forEach((listSpell) => {
                duplicate = userSpells.find((element) => element.master_id === listSpell.master_id); // Don't list duplicates of already added spells
                if (duplicate === undefined) {
                    listSpell.listSpell = true; // Flag as listSpell
                    sections[listSpell.lowestLevel].data.push(listSpell);
                }
            });
        }

        // Prune empty sections
        for (let i = 0; i < sections.length; i++) {
            while (i < sections.length && sections[i].data.length === 0) {
                sections.splice(i, 1);
            }
        };

        this.setState({ sections, spinnerVisible: false });
    }

    renderFooter() {
        return(
            <AvailableSpellListFooter
                nav={() => this.props.navigation.navigate('SearchModule')}
            />
        );
    }

    render() {
        return(
            <View>
                <SwipeListView
                    useSectionList
                    stickySectionHeadersEnabled
                    sections={this.state.sections}
                    renderItem={this.renderItem.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)}
                    keyExtractor={(spell) => JSON.stringify(spell.master_id)}
                    ListFooterComponent={this.renderFooter()}
                />
                <BorderDismissableModal
                    visible={this.state.prepareSpellModal.visible}
                    visibilitySetter={(preparingModalVisible) => this.setState({prepareSpellModal: {visible: preparingModalVisible}})}
                >
                    <PrepareSpellModal
                        spell={this.state.prepareSpellModal.item}
                        slots={this.state.profile !== undefined ? this.state.profile.slots : undefined}
                        prepare={(item, level, amount, modifier) => this.prepareSpell(item, level, amount, modifier)}
                    />
                </BorderDismissableModal>
                <View style={{ flex: 1 }}>
                    <Spinner visible={this.state.spinnerVisible} textContent={"Retrieving Spells..."} textStyle={{color: '#FFF'}} overlayColor={'rgba(0,0,0,0.5)'} />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { db: state.dataBase }
}

export default connect(mapStateToProps)(ProfileAvailableTab);