import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ProfilePreparedTab extends Component {

    static navigationOptions = ({ screenProps }) => { // Set up tab label
        let label = '';
        switch (screenProps.type) {
            case 'preparedSpellbook':
                label = 'Prepared';
                break;
            case 'preparedList':
                label = 'Prepared';
                break;
            case 'spontaneous':
                label = 'Slots'
                break;
            default:
                label = 'error'
        }
        return { tabBarLabel: label }
    }

    render() {
        return (
            <View>
                <Text>Ready to cast spells tab</Text>
                <Text>{this.props.screenProps.name}</Text>
            </View>
        );
    }
}

export default ProfilePreparedTab;