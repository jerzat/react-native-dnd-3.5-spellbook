import React, { Component } from 'react';
import { View } from 'react-native';
import { ThinBorderButton } from './common';

class PreparedSpellListRestoreButtons extends Component {
    render() {
        return(
            <View style={styles.containerStyle}>
                <View style={styles.buttonContainerStyle}>
                    <ThinBorderButton
                        small
                        style={styles.buttonStyle}
                        textStyle={styles.buttonTextStyle}
                        color={'#c00'}
                        onPress={this.props.restoreExhausted}
                    >
                        Restore exhausted slots
                    </ThinBorderButton>
                </View>
                <View style={styles.buttonContainerStyle}>
                    <ThinBorderButton
                        small
                        style={styles.buttonStyle}
                        textStyle={styles.buttonTextStyle}
                        color={'#c00'}
                        onPress={this.props.restoreAll}
                    >
                        Empty and restore all slots
                    </ThinBorderButton>
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        marginTop: 10
    },
    buttonContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    buttonStyle: {
        padding: 6
    },
    buttonTextStyle: {
        fontSize: 15
    }
}

export default PreparedSpellListRestoreButtons;