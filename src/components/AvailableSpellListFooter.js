import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';

const AvailableSpellListFooter = (props) => {

    return(
        <View style={[styles.containerStyle, props.style]}>
            <TouchableHighlight
                style={styles.touchableStyle}
                onPress={props.nav}
                underlayColor='#ddd'
            >
                <View style={styles.innerContainerStyle}>
                    <Text style={styles.textStyle}>
                        Search for spells to add
                    </Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        height: 50
    },
    textStyle: {
        fontSize: 16,
        color: '#4286f4'
    }
}

export default AvailableSpellListFooter;