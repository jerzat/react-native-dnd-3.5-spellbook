import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Dimensions, Image } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';

class ProfileItem extends Component {
    render() {
        return (
            <SwipeRow
                style={styles.swipeRowStyle}
                disableRightSwipe
                rightOpenValue={-50}
                disableLeftSwipe={this.props.disableSwipe}
                preview={this.props.preview}
                previewOpenValue={-50}
            >
                <View style={styles.hiddenContainer}>
                    <TouchableHighlight
                        onPress={this.props.deleteItem}
                    >
                        <Image style={styles.deleteIconStyle} source={require('../img/delete.png')} />
                    </TouchableHighlight>
                </View>
                <TouchableHighlight
                    style={[styles.touchableStyle, this.props.style]}
                    underlayColor='#e9e9ef'
                    onPress={this.props.onPress}
                >
                    <View style={styles.textContainerStyle}>
                        <Text style={styles.textStyle}>{this.props.children}</Text>
                    </View>
                </TouchableHighlight>
            </SwipeRow>
        )
    }
}

const styles = {
    swipeRowStyle: {
        borderColor: '#666',
        borderBottomWidth: 1,
        flex: 1
    },
    touchableStyle: {
        width: Dimensions.get('window') * 0.8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9e9ef'
    },
    textContainerStyle: {
        padding: 10
    },
    textStyle: {
        fontSize: 20,
        color: 'black'
    },
    hiddenContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#c00'
    },
    deleteIconStyle: {
        height: 30,
        width: 30,
        margin: 10,
        tintColor: '#fff'
    }
}

export default ProfileItem;