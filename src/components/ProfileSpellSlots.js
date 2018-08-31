import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage } from 'react-native';
import SpellSlotElement from './SpellSlotElement';

class ProfileSpellSlots extends Component {

    state = {
        profile: this.props.profile // Initialize with prop profile, then update right away from async storage
    }

    componentDidMount() {
        this.subs = [this.props.navigation.addListener('didFocus', () => this.getProfile()),]; // subscribe to navigation event "didFocus", and trigger a spell reload
        this.getProfile();
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    async getProfile() {
        let profiles = []
        try {
            profiles = JSON.parse(await AsyncStorage.getItem('profiles'));
        } catch (error) {
            console.log(error);
        }
        profile = profiles.find((element) => element.id === this.props.profile.id);
        this.setState({ profile, slots: profile.slots });
    }

    async changeSlots(slots, value) {
        profile = JSON.parse(JSON.stringify(this.state.profile));
        if (value > (slots.available + slots.exhausted)) {
            slots.available++;
        } else if (value < (slots.available + slots.exhausted)) {
            if (slots.available > 0) {
                slots.available--;
            } else {
                slots.exhausted--;
            }
        }
        profile.slots[profile.slots.findIndex((element) => element.level === slots.level)] = slots;
        this.setState({ profile });
        let newProfiles = JSON.parse((await AsyncStorage.getItem('profiles')));
        newProfiles.splice(newProfiles.findIndex((element) => element.id === this.state.profile.id), 1); // Pop the old profile
        newProfiles.push(this.state.profile);
        newProfiles.sort((a, b) => a.id - b.id);
        await AsyncStorage.setItem('profiles', JSON.stringify(newProfiles));
        await this.getProfile();
    }

    renderItem({item}) {
        return(
            <SpellSlotElement
                slots={item}
                changeSlots={(value) => this.changeSlots(item, value)}
            />
        );
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.profile.slots}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item) => item.level.toString()}
                />
            </View>
        );
    }
}

export default ProfileSpellSlots;