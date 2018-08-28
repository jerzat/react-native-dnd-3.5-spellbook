import React, { Component } from 'react';
import { View, AsyncStorage, Text, Alert, LayoutAnimation } from 'react-native';
import ProfileItem from './ProfileItem';
import { SwipeListView } from 'react-native-swipe-list-view';

class ProfileSelection extends Component {

    state = {
        profiles: null
    }

    static navigationOptions = {
        title: 'Profile Selection',
        headerBackTitle: 'Profiles' // iOS back string for *following* screen, pointing back to this
    };

    async componentDidMount() {
        this.subs = [this.props.navigation.addListener('didFocus', () => this.updateList()),];
        await this.updateList();
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    async updateList() {  // Get profiles from storage
        try {
            profiles = JSON.parse(await AsyncStorage.getItem('profiles'));
            profiles.sort((a, b) => a.id - b.id);
            this.setState({ profiles });
        } catch (error) {
            console.log(error);
        }
    }

    async onNewProfileSuccess() {
        await this.updateList();
    }

    deleteProfile(item) {
        // Call this if user confirms in alert
        var performDelete = async () => {
            profiles = this.state.profiles.slice();
            profiles.splice(profiles.findIndex((element) => element.id === item.id), 1);
            LayoutAnimation.spring();
            this.setState({ profiles });
            await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
        }

        let alertText = 'Delete ' + item.name + '?';
        Alert.alert(
            '',
            alertText,
            [
                {text: 'Keep', onPress: null, style: 'cancel'},
                {text: 'Delete', onPress: () => performDelete()}
            ],
            { cancelable: false }
        );
    }

    renderItem({item}) {
        return (
            <ProfileItem
                onPress={() => this.props.navigation.navigate('Selected', item)}
                deleteItem={() => this.deleteProfile(item)}
                preview={item.id===0}
            >
                {item.name}
            </ProfileItem>
        );
    }

    footerItem() {
        return(
            <ProfileItem
                onPress={() => this.props.navigation.navigate('ProfileCreation')}
                disableSwipe
            >
                <Text style={{color: '#4286f4', fontWeight: '500'}}>{'Add new profile '}</Text>
            </ProfileItem>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SwipeListView
                    useFlatList
                    data={this.state.profiles}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={() => this.footerItem()}
                />
            </View>
        );
    }
}

export default ProfileSelection;