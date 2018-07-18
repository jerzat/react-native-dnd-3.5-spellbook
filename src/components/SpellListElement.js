import React, {Component} from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

const SpellListElement = (props) => {

    return (
        <View style={styles.containerStyle}>
            <TouchableHighlight style={styles.touchableStyle}>
                    <View>
                    <Text style={styles.spellNameStyle}>
                        {props.record.spell_name}
                    </Text>
                    <Text style={styles.spellLevelStyle}>
                        {
                            props.record.class_name ? props.record.class_name : ''
                            +props.record.level ? props.record.level : ''
                            +props.record.domain_name ? props.record.domain_name : ''
                            +props.record.domain_level ? props.record.domain_level : ''
                        }
                    </Text>
                    <Text style={styles.spellSchoolStyle}>
                        {props.record.school_name}
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    );

}

styles = {
    containerStyle: {
        padding: 10,
        height: 200,
        borderWidth: 1
    },
    touchableStyle: {
        borderWidth: 1

    },
    spellNameStyle: {

    },
    spellLevelStyle: {
        
    },
    spellSchoolStyle: {

    }
}

export default SpellListElement;
