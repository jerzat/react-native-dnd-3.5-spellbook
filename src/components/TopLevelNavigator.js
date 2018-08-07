import { createBottomTabNavigator } from 'react-navigation';
import SearchModule from './SearchModule';
import SpellbookManagementModule from './SpellbookManagementModule';

const TopLevelNavigator = createBottomTabNavigator(
    {
        Search: { screen: SearchModule },
        SpellbookManagement: { screen: SpellbookManagementModule }
    },
    {
        initialRouteName: 'Search'
    }
);

export default TopLevelNavigator;