import React, { Component } from 'react';
import { View, AsyncStorage, FlatList } from 'react-native';
import ProfileItem from './ProfileItem';
import ProfileCreation from './ProfileCreation';
import { BorderDismissableModal } from './common';
import { NavigationActions } from 'react-navigation';

class ProfileSelection extends Component {

    state = {
        profiles: null,
        modalVisible: false
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
        this.setModalVisible(false);
        await this.updateList();
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    renderItem({item}) {
        return (
            <ProfileItem onPress={() => this.props.navigation.navigate(
                'Selected', // First, navigate to ProfileNavigator
                item/*,
                NavigationActions.navigate({ // Then, navigate to 
                    routeName: 'Prepared'
                })*/
            )}>
                {item.name}
            </ProfileItem>
        );
    }

    footerItem() {
        return(
            <ProfileItem
                style={{borderColor: '#68b1ff'}}
                onPress={() => this.setModalVisible(true)}
            >
                Add new profile
            </ProfileItem>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.state.profiles}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, i) => i.toString()} // Use array index as key
                    ListFooterComponent={() => this.footerItem()}
                />
                <BorderDismissableModal
                    visible={this.state.modalVisible}
                    visibilitySetter={(visibility) => this.setModalVisible(visibility)}
                >
                    <ProfileCreation onSuccess={() => this.onNewProfileSuccess()}/>
                </BorderDismissableModal>
            </View>
        );
    }
}

export default ProfileSelection;