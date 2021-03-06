import React, { Component } from 'React';
import { View, Image, TouchableHighlight } from 'react-native';
import SpellListElement from './SpellListElement';
import { SwipeRow } from 'react-native-swipe-list-view';

// Wrapper for SpellListElement that renders a SwipeRow with options
class SpontaneousSpellListElement extends Component {

    render() {
        return(
            <SwipeRow
                closeOnRowPress
                closeOnRowBeginSwipe
                style={styles.swipeRowStyle}
                disableRightSwipe
                rightOpenValue={this.props.record.listSpell ? -50 : -100} // Do not display delete icon if this spell was not added by user
                disableLeftSwipe={this.props.disableSwipe}
            >
                <View style={styles.hiddenContainer}>
                    {this.props.record.listSpell ? null :  // Do not display delete icon if this spell was not added by user
                        <TouchableHighlight
                            onPress={this.props.restoreSingleSpell}
                        >
                            <View style={[styles.imageContainer, styles.red]}>
                                <Image style={styles.castIconStyle} source={require('../img/delete.png')} />
                            </View>
                        </TouchableHighlight>
                    }
                    <TouchableHighlight
                        onPress={this.props.castSpell}
                    >
                        <View style={[styles.imageContainer, styles.blue]}>
                            <Image style={styles.castIconStyle} source={require('../img/cast.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
                <SpellListElement
                    style={styles.spellListElementStyle}
                    record={this.props.record}
                    nav={this.props.nav}
                    amount={this.props.amount}
                    spontaneous
                    listSpell={this.props.record.listSpell ? true : false}
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
        justifyContent: 'flex-end'
    },
    red: {
        backgroundColor: '#c00'
    },
    blue: {
        backgroundColor: '#4286f4'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    castIconStyle: {
        height: 30,
        width: 30,
        tintColor: '#fff'
    },
    spellListElementStyle: {
        flex: 1
    }
}

export default SpontaneousSpellListElement;