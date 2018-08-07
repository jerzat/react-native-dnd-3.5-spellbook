import React, { Component } from 'react';
import { View, AsyncStorage, FlatList } from 'react-native';
import ProfileItem from './ProfileItem';

class ProfileSelection extends Component {

    state = {
        profiles: null
    }

    static navigationOptions = {
        title: 'Profile Selection'
    };

    async componentWillMount() { // Get profiles from storage
        try {
            value = await AsyncStorage.getItem('profiles');
            this.setState({profiles: JSON.parse(value)});
        } catch (error) {
            console.log(error);
        }
    }

    renderItem({item}) {
        return <ProfileItem>{item.name}</ProfileItem>;
    }

    footerItem() {
        return(
            <ProfileItem
                style={{borderColor: '#68b1ff'}}
                onPress={() => this.props.navigation.navigate('ProfileCreation')}
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
            </View>
        );
    }
}

export default ProfileSelection;