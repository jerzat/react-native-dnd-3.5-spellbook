import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

const SpellListElement = (props) => {

    return (
        <View style={[styles.containerStyle, props.style]}>
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
                                (props.record.class !== undefined ? props.record.class.map((sclass) => {return(sclass.name + ' ' + sclass.level + ' ')}).toString().replace(/,/g,'') : '')
                                + (props.record.domain !== undefined ? props.record.domain.map((domain) => {return(domain.name + ' ' + domain.level + ' ')}).toString().replace(/,/g,'') : '')
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
        borderColor: '#777',
        backgroundColor: '#e9e9ef'
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
