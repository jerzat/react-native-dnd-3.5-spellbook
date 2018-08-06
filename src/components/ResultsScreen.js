import React from 'react';
import { ScrollView, Text, Button, FlatList } from 'react-native';
import SpellListElement from './SpellListElement';

class ResultsScreen extends React.Component {
    
    static navigationOptions = {
        title: 'Results',
    };

    renderItem({item}) {
        return(
            <SpellListElement
                record={item}
                nav={() => this.props.navigation.navigate('Detail', {record: item})} // Navigate to detail function for child to display
            />
        );
    }

    render() {
        return (
            <FlatList
                data={this.props.navigation.getParam('records')} // Pass on object containing the list of items we will list
                renderItem={this.renderItem.bind(this)} // What to do with each item when displaying it
                keyExtractor={(record) => JSON.stringify(record.master_id)}
            />
        );
    }
}

export default ResultsScreen;