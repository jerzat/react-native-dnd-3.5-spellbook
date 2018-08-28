import React, { Component } from 'react';
import { AppRegistry, YellowBox, AsyncStorage, Text } from 'react-native';
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
        //console.log(JSON.parse(await AsyncStorage.getItem('profiles')));
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
                            available: [ {id: 2629 }, { id: 2833 }, { id: 2631 }, { id: 2408 }, { id: 2612 }, { id: 2630 }, { id: 2830 }, { id: 2590 }, { id: 2535 }],
                            prepared: [
                                { id: 2629, level: 0, amount: 2, modifier: '' },
                                { id: 2833, level: 0, amount: 2, modifier: '' },
                                { id: 2631, level: 1, amount: 3, modifier: '' },
                                { id: 2408, level: 2, amount: 1, modifier: '' },
                                { id: 2631, level: 2, amount: 1, modifier: 'Still' },
                                { id: 2612, level: 3, amount: 2, modifier: '' },
                            ],
                            slots: [
                                { level: 0, available: 0, prepared: 4, exhausted: 1 },
                                { level: 1, available: 0, prepared: 3, exhausted: 0 },
                                { level: 2, available: 2, prepared: 2, exhausted: 1 },
                                { level: 3, available: 1, prepared: 2, exhausted: 0 },
                                { level: 4, available: 0, prepared: 0, exhausted: 0 },
                                { level: 5, available: 0, prepared: 0, exhausted: 0 },
                                { level: 6, available: 0, prepared: 0, exhausted: 0 },
                                { level: 7, available: 0, prepared: 0, exhausted: 0 },
                                { level: 8, available: 0, prepared: 0, exhausted: 0 },
                                { level: 9, available: 0, prepared: 0, exhausted: 0 },
                            ]
                        },
                        {
                            id: 1,
                            name: 'Test Sorcerer',
                            type: 'spontaneous',
                            lists: {classes: [], domains: []},
                            available: [{ id: 343 }, { id: 7 }, { id: 89 }, { id: 120 }, { id: 50 }, { id: 500 }, { id: 1867 }, { id: 1693 }, { id: 2100 }],
                            prepared: [],
                            slots: [
                                { level: 0, available: 0, prepared: 0, exhausted: 0 },
                                { level: 1, available: 0, prepared: 0, exhausted: 0 },
                                { level: 2, available: 0, prepared: 0, exhausted: 0 },
                                { level: 3, available: 0, prepared: 0, exhausted: 0 },
                                { level: 4, available: 0, prepared: 0, exhausted: 0 },
                                { level: 5, available: 0, prepared: 0, exhausted: 0 },
                                { level: 6, available: 0, prepared: 0, exhausted: 0 },
                                { level: 7, available: 0, prepared: 0, exhausted: 0 },
                                { level: 8, available: 0, prepared: 0, exhausted: 0 },
                                { level: 9, available: 0, prepared: 0, exhausted: 0 },
                            ]
                        },
                        {
                            id: 2,
                            name: 'Test Cleric',
                            type: 'preparedList',
                            lists: {classes: [], domains: []},
                            available: [],
                            prepared: [],
                            slots: [
                                { level: 0, available: 0, prepared: 0, exhausted: 0 },
                                { level: 1, available: 0, prepared: 0, exhausted: 0 },
                                { level: 2, available: 0, prepared: 0, exhausted: 0 },
                                { level: 3, available: 0, prepared: 0, exhausted: 0 },
                                { level: 4, available: 0, prepared: 0, exhausted: 0 },
                                { level: 5, available: 0, prepared: 0, exhausted: 0 },
                                { level: 6, available: 0, prepared: 0, exhausted: 0 },
                                { level: 7, available: 0, prepared: 0, exhausted: 0 },
                                { level: 8, available: 0, prepared: 0, exhausted: 0 },
                                { level: 9, available: 0, prepared: 0, exhausted: 0 },
                            ]
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
