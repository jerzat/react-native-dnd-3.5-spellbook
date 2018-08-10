import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import ProfileAvailableTab from './ProfileAvailableTab';
import ProfilePreparedTab from './ProfilePreparedTab';

// This is the tab navigator, which needs to be wrapped into a class to process and route state and props
const ProfileNavigatorTabs = createMaterialTopTabNavigator(
    {
        Available: ProfileAvailableTab,
        Prepared: ProfilePreparedTab
    },
    {
        initialRouteName: 'Available'
    }
)

// This is the wrapper which handles the state, header bar, etc
class ProfileNavigator extends Component {

    static router = ProfileNavigatorTabs.router;

    static navigationOptions = ({ navigation }) => ({ // Shenanigans to access this.state.navigation ... navigationOptions is actually a function (?), also, don't foget parenthesis in ({ key: param });
        title: navigation.state.params.name
    });

    render() {
        return (
            <ProfileNavigatorTabs
                navigation={this.props.navigation} // Pass navigation properties, so we do not break the navigators chain for routes, etc
                screenProps={this.props.navigation.state.params} // Pass down params as this.props.screenProps to all screens
            />
        );
    }
}


export default ProfileNavigator;