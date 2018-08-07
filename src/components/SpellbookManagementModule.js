import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ProfileSelection from './ProfileSelection';
import ProfileCreation from './ProfileCreation';

const SpellBookManagementModule = createStackNavigator(
    {
        ProfileSelection: { screen: ProfileSelection },
        ProfileCreation: { screen: ProfileCreation }
    },
    {
        initialRouteName: 'ProfileSelection'
    }
);

renderProfileIcon = ({focused, tintColor}) => {
    return(
        <Image source={require('../img/profile.png')} style={{height: 30, width: 30, tintColor: tintColor}} />
    );
}

SpellBookManagementModule.navigationOptions = {
    title: 'Spellbooks',
    tabBarIcon: renderProfileIcon
}

export default SpellBookManagementModule;