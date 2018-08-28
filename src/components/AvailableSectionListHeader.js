import React from 'react';
import { View, Text } from 'react-native';

const AvailableSectionListHeader = (props) => {
    return (
        <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{props.children}</Text>
        </View>
    );
}

const styles = {
    containerStyle: {
        flex: 1,
        fontSize: 14,
        backgroundColor: '#ddd',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5
    },
    textStyle: {
        fontWeight: '400'
    }
}

export default AvailableSectionListHeader