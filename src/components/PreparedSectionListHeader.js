import React from 'react';
import { View, Text } from 'react-native';
import UIStepper from 'react-native-ui-stepper';

const PreparedSectionListHeader = (props) => {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.leftChunk}>
                <Text style={styles.levelStyle}>{'Level ' + props.slots.level}</Text>
            </View>
            <View style={styles.middleChunk}>
                <Text style={styles.slotsStyle}>{'Slots'}</Text>
                <UIStepper
                    style={styles.stepperStyle}
                    width={80}
                    height={25}
                    initialValue={props.slots.available + props.slots.prepared + props.slots.exhausted}
                    minimumValue={0}
                    maximumValue={100}
                    steps={1}
                    tintColor='#4286f4'
                    onValueChange={(value) => props.changeSlots(value)}
                    displayValue={true}
                    textColor={'#000'}
                />
            </View>
            <View style={styles.rightChunk}>
                <Text style={styles.availableStyle}>{'Available: ' + props.slots.available}</Text>
                <Text style={styles.preparedStyle}>{'Prepared: ' + props.slots.prepared}</Text>
                <Text style={styles.exhaustedStyle}>{'Exhausted: ' + props.slots.exhausted}</Text>
            </View>
        </View>
    );
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