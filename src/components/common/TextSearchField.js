import React from 'react';
import { View, Image, TextInput } from 'react-native';

const TextSearchField = (props) => {
    return (
        <View style={[styles.textInputContainer, props.styles]}>
            <Image style={styles.textInputImage} source={require('./img/searchIcon.png')} resizeMode='contain' />
            <TextInput
                style={styles.spellNameInput}
                onChangeText={props.onChangeText}
                autoCorrect={false}
                autoFocus={false}
                placeholder={props.placeholder}
                ref={props.textInputRef}
            />
        </View>
    ); 
}

const styles = {
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    textInputImage: {
        flex: 0.065,
        height: 50,
        width: 50,
        marginRight: 5
    },
    spellNameInput: {
        flex: 1
    },
    spellTextInput: {
        flex: 1
    }
}

export { TextSearchField };