import React, { Component } from 'react';
import { View, AsyncStorage, FlatList } from 'react-native';
import SpellListElement from './SpellListElement';
import QueryHelper from './QueryHelper';
import { connect } from 'react-redux';

class ProfileAvailableTab extends Component {

    state = {
        spells: []
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
        this.setState({ spells });
    }

    renderItem({item}) {
        return(
            <SpellListElement
                record={item}
                nav={() => this.props.navigation.navigate('Detail', {record: item})} // Navigate to detail function for child to display
            />
        );
    }

    render() {
        console.log(this.state);
        return(
            <View>
                <FlatList
                    data={this.state.spells}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(spell) => JSON.stringify(spell.master_id)}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { db: state.dataBase }
}

export default connect(mapStateToProps)(ProfileAvailableTab);