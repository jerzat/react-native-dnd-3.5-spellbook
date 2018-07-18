import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => { // add props argument if we want to support props
    const { textStyle, viewStyle } = styles;
    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{props.headerText /*Directly reference prop*/}</Text>
        </View>
    );
};

const styles = {
    viewStyle: {
        backgroundColor: '#f8f8f8',
        justifyContent: 'center', // Vertical alignment
        alignItems: 'center', // Horizontal alignment
        height: 60,
        paddingTop: 0,
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2, // Android shadow
        position: 'relative'
    },
    textStyle: {
        fontSize: 20
    }
};

export default Header;
