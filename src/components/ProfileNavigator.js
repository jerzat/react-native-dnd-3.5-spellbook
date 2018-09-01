import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { View, Button } from 'react-native';
import ProfileAvailableTab from './ProfileAvailableTab';
import ProfilePreparedTab from './ProfilePreparedTab';
import ButtonEditProfile from './ButtonEditProfile';
import ButtonShowListSpells from './ButtonShowListSpells';
import SpontaneousCasterList from './SpontaneousCasterList';

// This is the tab navigator, which needs to be wrapped into a class to process and route state and props
const ProfilePreparedNavigatorTabs = createMaterialTopTabNavigator(
    {
        Available: ProfileAvailableTab,
        Prepared: ProfilePreparedTab
    },
    {
        initialRouteName: 'Available',
        swipeEnabled: false
    }
)

// This is the wrapper which handles the state, header bar, etc
class ProfileNavigator extends Component {

    state = {
        showListSpells: false
    }

    static router = ProfilePreparedNavigatorTabs.router;

    static navigationOptions = ({ navigation }) => ({ // Shenanigans to access this.state.navigation ... navigationOptions is actually a function (?), also, don't foget parenthesis in ({ key: param });
        title: navigation.state.params.name,
        headerRight:
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                <ButtonShowListSpells onPress={() => navigation.state.params.switchShowListSpells()} active={navigation.state.params.showListSpells} />
                <ButtonEditProfile onPress={() => navigation.navigate('ProfileCreation', navigation.state.params)} />
            </View>
    });

    componentDidMount() {
        this.props.navigation.setParams({ switchShowListSpells: this.switchShowListSpells }); // Map param to function, so that header in navigation can call a function just calling the param
        this.props.navigation.setParams({ showListSpells: this.state.showListSpells }); // Initialize to false
    }

    switchShowListSpells = () => {
        this.setState({showListSpells: !this.state.showListSpells});
        this.props.navigation.setParams({ showListSpells: !this.state.showListSpells }); // This passes down the value we switch in the state down to child elements (confusing, but can't be passed as prop since we have more navigators below)
    }

    render() {
        if (this.props.navigation.state.params.type === 'spontaneous') {
            return(
                <SpontaneousCasterList
                    navigation={this.props.navigation}
                    screenProps={this.props.navigation.state.params}
                />
            );
        } else {
            return (
                <ProfilePreparedNavigatorTabs
                    navigation={this.props.navigation} // Pass navigation properties, so we do not break the navigators chain for routes, etc
                    screenProps={this.props.navigation.state.params} // Pass down params as this.props.screenProps to all screens
                />
            );
        }
    }
}


export default ProfileNavigator;