import React from 'react';
import { View, ScrollView, AppRegistry, Text, Dimensions } from 'react-native';
import SpellView from './SpellView';
import Button from './Button';
import SearchListResults from './SearchListResults';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';



class TabbedScreen extends React.Component {

    state = {
        index: 0, // Needed for react-native-tab-view
        routes: [ // Needed for react-native-tab-view
          { key: 'first', title: 'Search' },
          { key: 'second', title: 'Second' },
        ],
        db: null,
        records: []
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        
        var SQLite = require('react-native-sqlite-storage');
        let db = SQLite.openDatabase(
            {
                name: 'dnd.db', // Arbitrary database name that will be created in sandbox
                createFromLocation: "~main.sqlite", // File name in \android\app\src\main\assets\
                location:'Library', // Sandbox location I guess
                readOnly: true
            },
            () => console.log('database opened'),
            () => console.log('failed to open database')
        );
        this.setState({db: db});
    }

    getAbj = () => {
        
        this.state.db.transaction((tx) => {
            tx.executeSql('SELECT * FROM dnd_spell WHERE school_id=1', [], (tx, results) => {
                console.log("Query completed");
      
                // Get rows with Web SQL Database spec compliance.
      
                var newRecords = this.state.records.slice();
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  newRecords.push(row);
                }
                this.setState({records: newRecords});
               
            });
        });
    }

    getContents() {
        if (this.state.records.length !== 0) {
            return (
                this.state.records.map(
                    record => <SpellView key={record.id} record={record} />
                )
            );
        } else {
            return (
                <Text>No results</Text>
            );
        }
    }

    render() {
        // Define tab contents
        const FirstRoute = () => (
            <View style={[styles.container, { backgroundColor: '#ff4081' }]}>
                <View style={{height: 45}}>
                    <Button onPress={this.getAbj}>
                        See All Abjuration Spells
                    </Button>
                </View>
            </View>
        );
          const SecondRoute = () => (
            <View style={[styles.container, { backgroundColor: '#673ab7' }]}>
                <SearchListResults records={this.state.records}/>
            </View>
        );

        return(
            <TabView
              navigationState={this.state}
              renderScene={SceneMap({
                first: FirstRoute,
                second: SecondRoute,
              })}
              onIndexChange={index => this.setState({ index })}
              initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
            />
        );
    }
}

styles = {
    container: {
        flex: 1
    }
}

export default TabbedScreen;
