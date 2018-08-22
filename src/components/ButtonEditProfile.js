import React, { Component } from 'react';
import { View, TouchableHighlight, Image } from 'react-native';

class ButtonEditProfile extends Component {
    render() {
        return(
            <TouchableHighlight
                onPress={this.props.onPress}
            >
                <Image style={styles.imageStyle} source={require('../img/edit.png')} resizeMode='contain' />
            </TouchableHighlight>
        );
    }
}

const styles = {
    imageStyle: {
        height: 18,
        width: 18,
        marginRight: 10,
        tintColor: '#4286f4'
    }
}

export default ButtonEditProfile;