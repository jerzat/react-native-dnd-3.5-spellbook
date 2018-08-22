import React, { Component } from 'react';
import { AppRegistry, YellowBox, AsyncStorage, View } from 'react-native';
import TopLevelNavigator from './src/components/TopLevelNavigator';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './src/reducers';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']); // Until 0.56 is stable ...
YellowBox.ignoreWarnings(['Class RCTCxxModule']); // Until 0.56 is stable on iOS ...

class App extends Component {

    constructor(props) {
        super(props);
        this.firstBootCheck();
    }

    async firstBootCheck() {
        //AsyncStorage.clear();
        console.log(JSON.parse(await AsyncStorage.getItem('profiles')));
        try {
            const value = await AsyncStorage.getItem('initialized');
            if (value === null) {
                console.log('first boot');
                try {
                    await AsyncStorage.setItem('profiles', JSON.stringify([
                        {
                            id: 0,
                            name: 'Test Wizard',
                            type: 'preparedSpellbook', // 'preparedSpellbook', 'preparedList', 'spontaneous'
                            lists: {classes: [{ id: 1, name: 'Wizard'}], domains: []},
                            available: [{ id: 243 }, { id: 677 }, { id: 78 }, { id: 1245 }, { id: 377 }, { id: 682 }, { id: 111 }],
                            prepared: []
                            
                        },
                        {
                            id: 1,
                            name: 'Test Sorcerer',
                            type: 'spontaneous',
                            lists: {classes: [], domains: []},
                            available: [{ id: 343 }, { id: 7 }, { id: 89 }, { id: 120 }, { id: 50 }, { id: 500 }, { id: 1867 }, { id: 1693 }, { id: 2100 }],
                            prepared: []
                        },
                        {
                            id: 2,
                            name: 'Test Cleric',
                            type: 'preparedList',
                            lists: {classes: [], domains: []},
                            available: [],
                            prepared: []
                        }
                    ]));
                    await AsyncStorage.setItem('initialized', 'true');
                    await AsyncStorage.setItem('profilesCreated', '100');
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <Provider store={createStore(reducers)}>
                <TopLevelNavigator />
            </Provider>
        );
    }
}


AppRegistry.registerComponent('spellbook', () => App);
