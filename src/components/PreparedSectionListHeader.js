import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import UIStepper from 'react-native-ui-stepper';
import { showMessage } from "react-native-flash-message";

class PreparedSectionListHeader extends Component {

    state = {
        editSlots: false
    }

    minimumReachedWarning() {
        showMessage({
            message: 'Spells prepared in this slot, clear or cast them before decreasing further.',
            type: 'danger',
            duration: 3000,
            floating: true,
            icon: 'danger'
        });
    }

    renderSlots() {
        if (this.state.editSlots) {
            return(
                <View style={styles.stepperContainerStyle}>
                    <Text style={styles.slotsStyle}>{'Slots'}</Text>
                    <UIStepper
                        style={styles.stepperStyle}
                        width={80}
                        height={25}
                        initialValue={this.props.slots.available + this.props.slots.prepared + this.props.slots.exhausted}
                        minimumValue={this.props.slots.prepared} // Do not unprepare spells by decreasing slots. Should we wish code is already in place, though
                        maximumValue={100}
                        steps={1}
                        tintColor='#4286f4'
                        onValueChange={(value) => this.props.changeSlots(value)}
                        displayValue={true}
                        textColor={'#000'}
                        onMinimumReached={() => this.props.slots.prepared > 0 ? this.minimumReachedWarning() : null}
                    />
                </View>
            );
        } else {
            return(
                <View>
                    <Text style={styles.slotsStyle}>{'Slots: ' + (this.props.slots.available + this.props.slots.prepared + this.props.slots.exhausted)}</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={styles.leftChunk}>
                    <Text style={styles.levelStyle}>{'Level ' + this.props.slots.level}</Text>
                </View>
                <View style={styles.middleChunk}>
                    <TouchableHighlight
                        style={styles.touchableStyle}
                        onPress={() => this.setState({editSlots: !this.state.editSlots})}
                    >
                        <Image style={styles.iconStyle} source={this.state.editSlots ? require('../img/checkmark.png') : require('../img/edit.png')} resizeMode='contain' />
                    </TouchableHighlight>
                    {this.renderSlots()}
                </View>
                <View style={styles.rightChunk}>
                    <Text style={styles.availableStyle}>{'Available: ' + this.props.slots.available}</Text>
                    <Text style={styles.preparedStyle}>{'Prepared: ' + this.props.slots.prepared}</Text>
                    <Text style={styles.exhaustedStyle}>{'Exhausted: ' + this.props.slots.exhausted}</Text>
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#ddd',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5
    },
    leftChunk: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    middleChunk: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rightChunk: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 10
    },
    levelStyle: {
        fontSize: 16,
        fontWeight: '500',
        width: 70
    },
    touchableStyle: {
        padding: 7
    },
    iconStyle: {
        width: 12,
        height: 12,
        tintColor: '#4286f4'
    },
    stepperContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    stepperStyle: {
        selfAlign: 'flex-end'
    },
    slotsStyle: {
        fontSize: 15,
        textAlign: 'right',
        marginRight: 5
    },
    availableStyle: {
        fontSize: 9,
        textAlign: 'right',
        marginLeft: 5
    },
    preparedStyle: {
        fontSize: 9,
        textAlign: 'right',
        marginLeft: 5
    },
    exhaustedStyle: {
        fontSize: 9,
        textAlign: 'right',
        marginLeft: 5
    }
}

export default PreparedSectionListHeader