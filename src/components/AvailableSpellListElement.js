import React, { Component } from 'React';
import { View, Image, TouchableHighlight } from 'react-native';
import SpellListElement from './SpellListElement';
import { SwipeRow } from 'react-native-swipe-list-view';

// Wrapper for SpellListElement that renders a SwipeRow with options
class AvailableSpellListElement extends Component {
    render() {
        return(
            <SwipeRow
                closeOnRowPress
                closeOnRowBeginSwipe
                style={styles.swipeRowStyle}
                disableRightSwipe
                rightOpenValue={-50}
                disableLeftSwipe={this.props.disableSwipe}
            >
                <View style={styles.hiddenContainer}>
                    <TouchableHighlight
                        onPress={this.props.deleteItem}
                    >
                        <View style={styles.imageContainer}>
                            <Image style={styles.deleteIconStyle} source={require('../img/delete.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
                <SpellListElement
                    style={styles.spellListElementStyle}
                    record={this.props.record}
                    nav={this.props.nav}
                />
            </SwipeRow>
        )
    }
}

const styles = {
    swipeRowStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    hiddenContainer: {
        flex: 1,
        alignSelf: 'flex-end',
        backgroundColor: '#c00'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteIconStyle: {
        height: 30,
        width: 30,
        tintColor: '#fff'
    },
    spellListElementStyle: {
        flex: 1
    }
}

export default AvailableSpellListElement;