import React, { Component } from 'react';
import { AppRegistry, YellowBox, AsyncStorage } from 'react-native';
import TopLevelNavigator from './src/components/TopLevelNavigator';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']); // Until 0.56 is stable ...
YellowBox.ignoreWarnings(['Class RCTCxxModule']); // Until 0.56 is stable on iOS ...

class App extends Component {

    constructor(props) {
        super(props);
        this.firstBootCheck();
    }

    async firstBootCheck() {
        try {
            const value = await AsyncStorage.getItem('initialized');
            if (value === null) {
                console.log('first boot');
                try {
                    await AsyncStorage.setItem('profiles', JSON.stringify([
                        {
                            name: 'Test prep caster w/spellbook',
                            type: 'preparedSpellbook' // 'preparedSpellbook', 'preparedList', 'spontaneous'
                        },
                        {
                            name: 'Test spontaneous caster',
                            type: 'spontaneous'
                        }
                    ]));
                    await AsyncStorage.setItem('initialized', 'true');
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
        //AsyncStorage.clear();
    }

    render() {
        return <TopLevelNavigator />
    }
}


AppRegistry.registerComponent('spellbook', () => App);
