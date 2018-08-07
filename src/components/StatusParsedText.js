import React from 'react';
import { Text, View, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native';


class StatusParsedText extends React.Component {

    state = {
        modalVisible: false,
        modalText: undefined
    }

    conditions = [
        {id: 2, name: /drain/},
        {id: 3, name: /blind/},
        {id: 4, name: /blow/},
        {id: 5, name: /checked/},
        {id: 6, name: /confus/},
        {id: 7, name: /cower/},
        {id: 8, name: /daze/},
        {id: 9, name: /dazzle/},
        //{id: 10, name: /dead/},
        {id: 11, name: /deaf/},
        {id: 12, name: /dehydrate/},
        {id: 13, name: /disable/},
        {id: 14, name: /dying/},
        {id: 15, name: /negative\slevel/},
        {id: 16, name: /entagle/},
        {id: 17, name: /exhauste/},
        {id: 18, name: /fascinate/},
        {id: 19, name: /fatigue/},
        {id: 20, name: /flat-foot/},
        {id: 21, name: /frighten/},
        {id: 22, name: /grapple/},
        {id: 23, name: /helpless/},
        {id: 24, name: /immobilize/},
        {id: 25, name: /incorporeal/},
        {id: 26, name: /invisible/},
        {id: 27, name: /knocked/},
        {id: 28, name: /nausea/},
        {id: 29, name: /panic/},
        {id: 30, name: /paralyze/},
        {id: 31, name: /petrif/},
        {id: 32, name: /pinned/},
        {id: 33, name: /prone/},
        {id: 34, name: /rebuke/},
        {id: 35, name: /shaken/},
        {id: 36, name: /sick/},
        {id: 38, name: /stagger/},
        {id: 39, name: /stun/},
        //{id: 40, name: /turn/},
        {id: 41, name: /unconscious/}
    ]

    parse (tokens) {
        return tokens.map((token, i) => {
            let hasSpace = i !== (tokens.length - 1);
            let maybeSpace = hasSpace ? ' ' : '';
            
            for (let j = 0; j < this.conditions.length; j++) {
                if (token.match(this.conditions[j].name)) {
                    return (
                        <Text
                            key={i}
                            style={{color: '#1111ee'}}
                            onPress={(ref) => this.conditionQuery(this.conditions[j], ref)}
                        >
                            {token + maybeSpace}
                        </Text>
                    );
                }
            }
            return (
                token + maybeSpace
            );
        });
    }

    conditionQuery (condition, ref) {
        var SQLite = require('react-native-sqlite-storage');
        SQLite.enablePromise(true);
        SQLite.openDatabase(
            {
                name: 'dnd.db',
                createFromLocation: "~main.sqlite",
                location:'Library',
                readOnly: true
            },
            (db) => {
                db.transaction((tx) => {
                    let queryString = "SELECT * FROM dnd_rules_conditions WHERE id=\'" + condition.id +'\'';
                    tx.executeSql(queryString, [], (tx, results) => {
                        this.setState({modalText: results.rows.item(0).description});
                        this.setModalVisible(true);
                    },
                        (error) => console.log(error)
                    );
                });
            },
            () => console.log('failed to open database')
        )
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        var contents = this.props.children;

        // Sometimes some entries are considered BLOB data (non TEXT) and is not returned by query depending on platform implementation
        if (this.props.children === undefined) {
            return (
                <View>
                    <Text {...this.props}>
                        Text can't be displayed for this spell. Try on an Android device :(
                    </Text>
                </View>
            )
        }

        let tokens = this.props.children.split(/\s/);

        contents = this.parse(tokens);
        
        return (
            <View>
                <Text {...this.props}>
                    {contents}
                </Text>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { // Back button
                        this.setModalVisible(false);
                    }}>
                    <TouchableOpacity 
                        style={styles.modalContainer} 
                        activeOpacity={1} 
                        onPressOut={() => {this.setModalVisible(false)}}
                    >
                        <ScrollView 
                            directionalLockEnabled={true} 
                            contentContainerStyle={styles.scrollModal}
                        >
                            <TouchableWithoutFeedback>
                                <View style={[styles.modalContent, this.props.modalStyles]}>
                                    <ScrollView style={styles.textContainer}>
                                        <Text>
                                            {this.state.modalText}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }

}

var styles = {
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff00'
    },
    scrollModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15 // For shadow
    },
    modalContent: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 5,
        shadowOpacity: 0.5,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        minHeight: 100,
        width: Dimensions.get('window').width * 0.65,
        maxHeight: Dimensions.get('window').height * 0.8
    },
    textContainer: {
        margin: 10
    }
};

export default StatusParsedText;