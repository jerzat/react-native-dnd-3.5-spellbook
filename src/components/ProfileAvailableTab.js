import React, { Component } from 'react';
import { View, AsyncStorage, LayoutAnimation, Text } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AvailableSpellListElement from './AvailableSpellListElement';
import QueryHelper from './QueryHelper';
import { connect } from 'react-redux';
import SectionListHeader from './SectionListHeader';
import AvailableSpellListFooter from './AvailableSpellListFooter';

class ProfileAvailableTab extends Component {

    state = {
        spells: [],
        profile: undefined
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
        profile = profiles.find((element) => element.id === this.props.screenProps.id);

        await Promise.all(
            profile.available.map(async (spell) => {
                await QueryHelper.getSpellById(this.props.db, spell.id)
                    .then((newSpell) => {
                    spells.push(newSpell);
                    });
            })
        );
        this.setState({ spells, profile });
    }

    async deleteSpell(item) {
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
    }

    renderItem({item, index, section}) {
        return(
            <AvailableSpellListElement
                record={item}
                nav={() => this.props.navigation.navigate('SpellDetailInProfile', {record: item})} // Navigate to detail function for child to display
                deleteItem={() => this.deleteSpell(item)}
            />
        );
    }

    renderSectionHeader({section: { title }}) {
        return(
            <SectionListHeader>{title}</SectionListHeader>
        );
    }

    generateSections() {
        let sections = [];
        for (let i = 0; i < 10; i++) {
            sections.push({title: 'Level ' + i, data:[]})
        }
        this.state.spells.forEach((stateSpell) => {
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
            sections[level].data.push(stateSpell);
        });
        // Prune empty sections
        for (let i = 0; i < sections.length; i++) {
            while (i < sections.length && sections[i].data.length === 0) {
                sections.splice(i, 1);
            }
        };
        return sections;
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
                    sections={this.generateSections()}
                    renderItem={this.renderItem.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)}
                    keyExtractor={(spell) => JSON.stringify(spell.master_id)}
                    ListFooterComponent={this.renderFooter()}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { db: state.dataBase }
}

export default connect(mapStateToProps)(ProfileAvailableTab);