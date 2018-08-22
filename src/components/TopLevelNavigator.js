import { createBottomTabNavigator } from 'react-navigation';
import SearchModule from './SearchModule';
import SpellbookManagementModule from './SpellbookManagementModule';

const TopLevelNavigator = createBottomTabNavigator(
    {
        SearchModule: { screen: SearchModule },
        SpellbookManagement: { screen: SpellbookManagementModule }
    },
    {
        initialRouteName: 'SearchModule'
    }
);

export default TopLevelNavigator;