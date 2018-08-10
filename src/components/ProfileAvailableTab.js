import React, { Component } from 'react';
import { View, Text } from 'react-native';
import QueryHelper from './QueryHelper';

class ProfileAvailableTab extends Component {

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

    getSpells() {

    }

    render() {
        return(<View><Text>Coming soon </Text></View>);
    }
}

export default ProfileAvailableTab;