import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ProfilePreparedList from './ProfilePreparedList';
import ProfileSpellSlots from './ProfileSpellSlots';

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
        switch (this.props.screenProps.type) {
            case 'preparedSpellbook':
                return (<ProfilePreparedList navigation={this.props.navigation} profile={this.props.screenProps} />);
            case 'preparedList':
                return (<ProfilePreparedList navigation={this.props.navigation} profile={this.props.screenProps} />);
            case 'spontaneous':
                return (<ProfileSpellSlots navigation={this.props.navigation} profile={this.props.screenProps} />);
            default:
                return (<View><Text>Error</Text></View>);
        }
    }
}

export default ProfilePreparedTab;