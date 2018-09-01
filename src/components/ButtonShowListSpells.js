import React from 'react';
import { TouchableHighlight, Image } from 'react-native';

const ButtonShowListSpells = (props) => {
    return(
        <TouchableHighlight
            style={styles.touchableStyle}
            onPress={props.onPress}
        >
            <Image style={[styles.imageStyle, {tintColor: props.active ? '#090' : '#4286f4'}]} source={require('../img/showListSpells.png')} resizeMode='contain' />
        </TouchableHighlight>
    );
}

const styles = {
    touchableStyle: {
        padding: 8
    },
    imageStyle: {
        height: 18,
        width: 18
    }
}

export default ButtonShowListSpells;