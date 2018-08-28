import React, { Component } from 'React';
import { View, Image, TouchableHighlight, Dimensions } from 'react-native';
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
                rightOpenValue={-50}
                stopRightSwipe={-Dimensions.get('window').width*0.5}
                leftOpenValue={100}
                stopLeftSwipe={Dimensions.get('window').width*0.5}
                disableLeftSwipe={this.props.disableSwipe}
                disableRightSwipe={this.props.disableSwipe}
                closeOnScroll={false}
            >
                <View style={styles.hiddenContainer}>
                    <View style={styles.hiddenLeft}>
                        <TouchableHighlight
                            onPress={this.props.prepareSimple}
                        >
                            <View style={[styles.imageContainer, styles.green]}>
                                <Image style={styles.prepareIconStyle} source={require('../img/prepare.png')} />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={this.props.prepare}
                        >
                            <View style={[styles.imageContainer, styles.blue]}>
                                <Image style={styles.prepareMultiIconStyle} source={require('../img/prepareMultiple.png')} />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.hiddenRight}>
                        <TouchableHighlight
                            onPress={this.props.deleteItem}
                        >
                            <View style={[styles.imageContainer, styles.red]}>
                                <Image style={styles.deleteIconStyle} source={require('../img/delete.png')} />
                            </View>
                        </TouchableHighlight>
                    </View>
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
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    hiddenLeft: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    hiddenRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blue: {
        backgroundColor: '#4286f4'
    },
    red: {
        backgroundColor: '#c00'
    },
    green: {
        backgroundColor: '#0c0'
    },
    prepareIconStyle: {
        height: 24,
        width: 25,
        tintColor: '#fff'
    },
    prepareMultiIconStyle: {
        height: 24,
        width: 25,
        tintColor: '#fff'
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