import React, {Component} from 'react';
import { View, Text, TouchableHighlight, Dimensions } from 'react-native';

const SpellListElement = (props) => {

    return (
        <View style={styles.containerStyle}>
            <TouchableHighlight
                style={styles.touchableStyle}
                onPress={props.nav}
                underlayColor='#ddd'
            >
                <View style={styles.innerContainerStyle}>
                    <View style={styles.leftChunkStyle}>
                        <Text style={styles.spellNameStyle}>
                            {props.record.spell_name}
                        </Text>
                    </View>
                    <View style={styles.rightChunkStyle}>
                        <Text style={styles.spellLevelStyle}>
                            {
                                (props.record.class_name ? props.record.class_name + ' ' : '') +
                                +(props.record.class_level ? props.record.class_level : '')
                                +(props.record.domain_name ? ' ' + props.record.domain_name + ' ' : '')
                                +(props.record.domain_level ? props.record.domain_level : '')
                            }
                        </Text>
                        <Text style={styles.spellSchoolStyle}>
                            {props.record.school_name}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    );

}

const styles = {
    containerStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        borderBottomWidth: 1,
        borderColor: '#777'
    },
    innerContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        height: 50
    },
    leftChunkStyle: {
        flex: 1.5
    },
    rightChunkStyle: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        flex: 1
    },
    touchableStyle: {

    },
    spellNameStyle: {
        fontWeight: '500'
    },
    spellLevelStyle: {
        textAlign: 'right',
        textAlignVertical: 'center',
        fontSize: 12
    },
    spellSchoolStyle: {
        fontStyle: 'italic',
        textAlign: 'right',
        fontSize: 12
    }
}

export default SpellListElement;
