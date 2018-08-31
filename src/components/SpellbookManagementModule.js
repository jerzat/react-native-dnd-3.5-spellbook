import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ProfileSelection from './ProfileSelection';
import ProfileNavigator from './ProfileNavigator';
import SpontaneousCasterList from './SpontaneousCasterList';
import SpellDetail from './SpellDetail';
import ProfileCreation from './ProfileCreation';

const SpellBookManagementModule = createStackNavigator(
    {
        Selection: ProfileSelection,
        Selected: ProfileNavigator,
        SpellDetailInProfile: SpellDetail,
        ProfileCreation: ProfileCreation
    },
    {
        initialRouteName: 'Selection'
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