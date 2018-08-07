import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ProfileCreation extends Component {

    static navigationOptions = {
        title: 'Create new profile'
    };

    render() {
        return(
            <View>
                <Text>Profile Creation</Text>
            </View>
        );
    }

}

export default ProfileCreation;