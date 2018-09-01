import React, { Component } from 'react';
import { View, TouchableHighlight, Image } from 'react-native';

class ButtonEditProfile extends Component {
    render() {
        return(
            <TouchableHighlight
                style={styles.touchableStyle}
                onPress={this.props.onPress}
            >
                <Image style={styles.imageStyle} source={require('../img/edit.png')} resizeMode='contain' />
            </TouchableHighlight>
        );
    }
}

const styles = {
    touchableStyle: {
        padding: 8
    },
    imageStyle: {
        height: 18,
        width: 18,
        tintColor: '#4286f4'
    }
}

export default ButtonEditProfile;