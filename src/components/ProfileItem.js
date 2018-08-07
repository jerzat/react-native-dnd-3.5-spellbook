import React from 'react';
import { View, Text, TouchableHighlight, Dimensions } from 'react-native';

const ProfileItem = (props) => {
    return (
        <View style={styles.containerStyle}>
            <TouchableHighlight
                style={[styles.touchableStyle, props.style]}
                underlayColor='#e9e9ef'
                onPress={props.onPress}
            >
                <Text style={styles.textStyle}>{props.children}</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = {
    containerStyle: {
        padding: 10
    },
    touchableStyle: {
        height: 36,
        width: Dimensions.get('window') * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#aaa'
    },
    textStyle: {
        fontSize: 20,
        color: 'black'
    }
}

export default ProfileItem;