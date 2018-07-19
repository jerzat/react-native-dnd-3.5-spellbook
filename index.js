import React from 'react';
import { AppRegistry } from 'react-native';
import SearchScreen from './src/components/SearchScreen';
import ResultsScreen from './src/components/ResultsScreen';
import SpellDetail from './src/components/SpellDetail';
import { createStackNavigator } from 'react-navigation';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']); // Until 0.56 is stable ...



const App  = createStackNavigator(
    {
        Search: { screen: SearchScreen },
        Results: { screen: ResultsScreen },
        Detail: { screen: SpellDetail }
    },
    {
        initialRouteName: 'Search',
    }
);

styles = {
    container: {
        flex: 1
    }
}

AppRegistry.registerComponent('spellbook', () => App);
