import React, { Component } from 'react';
import { View, Dimensions, TextInput, Button, Text, Alert, AsyncStorage } from 'react-native';
import SCTypeSelector from './SCTypeSelector';

class ProfileCreation extends Component {

    static navigationOptions = {
        title: 'Create new profile'
    };

    state = {
        newProfile: {
            name: '',
            type: '',
            available: []
        }
    }

    async createProfile() {
        if (this.state.newProfile.name !== '' && this.state.newProfile.type !== '') {
            let profiles = JSON.parse(await AsyncStorage.getItem('profiles'));
            profiles.push(this.state.newProfile);
            await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
            this.props.onSuccess();
        } else {
            Alert.alert(
                '',
                'Please enter a profile name and select a spellcaster type',
                [{text: 'OK'}]
            );
        }
    }

    render() {
        return(
            <View style={styles.containerStyle}>
                <View style={{height: 36, backgroundColor: '#eee', alignItems: 'center', overflow: 'hidden'}}>
                    <Text style={styles.headerTextStyle}>New Profile</Text>
                </View>
                <View style={styles.innerContainerStyle}>
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={(text) => this.setState({newProfile: {name: text, type: this.state.newProfile.type}})} // setState is shallow ! Need to repeat objects within objects
                        autoCorrect={false}
                        autoFocus={false}
                        placeholder='Profile Name'
                    />
                </View>
                <View style={styles.innerContainerStyle}>
                    <SCTypeSelector onChange={(option) => {this.setState({newProfile: {name: this.state.newProfile.name, type: option.type}})}} style={styles.selectorStyle} />
                </View>
                <Button
                    style={{alignSelf: 'flex-end'}}
                    title='Create Profile'
                    onPress={this.createProfile.bind(this)}>
                </Button>
            </View>
        );
    }

}

const styles = {
    containerStyle: {
        flexDirection: 'column',
        alignItems: 'stretch',
        width: Dimensions.get('window').width * 0.8
    },
    headerTextStyle: {
        fontSize: 16,
        color: '#222',
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 36
    },
    innerContainerStyle: {
        borderBottom: 1,
        borderColor: '#aaa'
    },
    textInputStyle: {
        height: 36,
        fontSize: 16,
        textAlign: 'center',
        padding: 3
    },
    selectorStyle: {
        height: 36,
        borderWidth: 0
    }
}

export default ProfileCreation;