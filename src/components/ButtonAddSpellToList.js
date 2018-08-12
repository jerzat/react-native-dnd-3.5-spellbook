import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { AsyncStorage } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

class ButtonAddSpellToList extends Component {

    state = {
        profiles: []
    }

    async openSelector() {
        let profiles = await this.getProfiles();
        this.setState({ profiles });
    }

    async getProfiles() {
        let value = []
        try {
            value = await AsyncStorage.getItem('profiles');
        } catch (error) {
            console.log(error);
        }
        return(JSON.parse(value));
    }

    async addOrRemoveSpell(profile) {
        let updatedProfile = profile;
        if (this.alreadyHasSpell(profile, this.props.spellId)) {
            updatedProfile.available.splice(profile.available.findIndex((element) => element.id === this.props.spellId), 1); // Remove from list
        } else {
            updatedProfile.available.push({ id: this.props.spellId });
        }
        let newProfiles = this.state.profiles.slice();
        newProfiles.splice(this.state.profiles.findIndex((element) => element.id === profile.id), 1); // Pop the old profile
        newProfiles.push(updatedProfile);
        newProfiles.sort((a, b) => a.id - b.id);
        this.setState({ profiles: newProfiles });
        await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
    }

    alreadyHasSpell(profile, spellId) {
        let value = false;
        profile.available.forEach(element => {
            if (element.id === spellId) {
                value = true;
            }
        });
        return value;
    }

    render() {
        return(
            <View>
                <ModalSelector
                    data={this.state.profiles}
                    onModalOpen={async () => await this.openSelector()} // Get data only when opening
                    labelExtractor={(profile) => (this.alreadyHasSpell(profile, this.props.spellId) ? '✅ ' : '❌ ') + profile.name} // I'm going to hell for this
                    keyExtractor={(profile) => profile.id}
                    initValue=''
                    onChange={async (profile) => await this.addOrRemoveSpell(profile)}
                    animationType='fade'
                    style={styles.modalStyle}
                    cancelText='Close'
                >
                    <View style={styles.touchableStyle}>
                        <Text style={styles.textStyle}>+</Text>
                    </View>
                </ModalSelector>
            </View>
        );
    }
}

const styles = {
    touchableStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: 25,
        marginRight: 10,
        borderRadius: 13,
        backgroundColor: '#68b1ff'
    },
    textStyle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff'
    },
    modalStyle: {

    }
}

export default ButtonAddSpellToList;