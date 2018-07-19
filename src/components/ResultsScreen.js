import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import SpellListElement from './SpellListElement';

class ResultsScreen extends React.Component {
    
    static navigationOptions = {
        title: 'Results',
    };


    showResults() {
        const records = this.props.navigation.getParam('records');
        if (typeof records !== 'undefined' && records.length !== 0) {
            return (
                records.map(
                    record => 
                        <SpellListElement 
                            key={''+record.master_id} // Unique key
                            record={record}
                            nav={() => this.props.navigation.navigate('Detail', {record: record})} // Navigate to detail function for child to display
                        />
                )
            );
        } else {
            return (
                <Text>No results</Text>
            );
        }
    }

    render() {
        return (
            <ScrollView>
                {this.showResults()}
            </ScrollView>
        );
    }
}

export default ResultsScreen;