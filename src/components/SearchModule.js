import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SearchScreen from './SearchScreen';
import ResultsScreen from './ResultsScreen';
import SpellDetail from './SpellDetail';

const SearchModule = createStackNavigator(
    {
        Search: { screen: SearchScreen },
        Results: { screen: ResultsScreen },
        Detail: { screen: SpellDetail }
    },
    {
        initialRouteName: 'Search'
    }
);

renderSearchIcon = ({focused, tintColor}) => {
    return(
        <Image source={require('../img/search.png')} style={{height: 30, width: 30, tintColor: tintColor}} />
    );
}

SearchModule.navigationOptions = {
    title: 'Spell Search',
    tabBarIcon: renderSearchIcon
}

export default SearchModule;