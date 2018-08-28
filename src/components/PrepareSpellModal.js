import React, { Component } from 'react';
import { View, Text, Dimensions, TextInput, Button } from 'react-native';
import UIStepper from 'react-native-ui-stepper';

class PrepareSpellModal extends Component {

    state = {
        level: this.props.spell.lowestLevel,
        amount: 1,
        modifier: ''
    }

    componentDidMount() {
        if (this.props.slots.find((element) => element.level === this.state.level).available < 1) {
            this.setState({amount: 0});
        }
    }

    setLevel(level) {
        this.setState({level});
        availableSlots = this.props.slots.find((element) => element.level === level).available;
        if (availableSlots < this.state.amount) {
            this.setState({amount: availableSlots});
        }
        if (availableSlots > 0 && this.state.amount === 0) {
            this.setState({amount: 1});
        }
    }

    render() {
        availableSlots = this.props.slots.find((element) => element.level === this.state.level).available;
        return(
            <View style={styles.containerStyle}>
                <View style={styles.headerStyle}>
                    <Text style={styles.spellNameStyle}>{this.state.modifier + ' ' + this.props.spell.spell_name}</Text>
                </View>
                <View style={styles.steppersBlockStyle}>
                    <View style={styles.amountBlockStyle}>
                        <Text style={styles.amountLabelStyle}>Amount</Text>
                        <UIStepper
                            style={styles.stepperStyle}
                            width={80}
                            height={25}
                            initialValue={availableSlots > 0 ? 1 : 0}
                            minimumValue={availableSlots > 0 ? 1 : 0}
                            maximumValue={availableSlots}
                            steps={1}
                            tintColor='#4286f4'
                            onValueChange={(value) => this.setState({amount: value})}
                            displayValue={true}
                            textColor={this.state.amount > 0 ? '#000' : '#c00'}
                            value={this.state.amount}
                        />
                        <Text style={styles.noteStyle}>{'(Available: ' + availableSlots + ')'}</Text>
                    </View>
                    <View style={styles.levelBlockStyle}>
                        <Text style={styles.levelLabelStyle}>Level</Text>
                        <UIStepper
                            style={styles.stepperStyle}
                            width={80}
                            height={25}
                            initialValue={this.props.spell.lowestLevel}
                            minimumValue={0}
                            maximumValue={9}
                            steps={1}
                            tintColor='#4286f4'
                            onValueChange={(value) => this.setLevel(value)}
                            displayValue={true}
                            textColor={'#000'}
                            value={this.state.level}
                        />
                        <Text style={styles.noteStyle}>{'(Original: ' + this.props.spell.lowestLevel + ')'}</Text>
                    </View>
                </View>
                <View style={styles.modifierBlockStyle}>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder={'Spell Modifier or note'}
                        onChangeText={(value) => this.setState({modifier: value})}
                    />
                </View>
                <Button
                    title={'Prepare'}
                    onPress={() => this.props.prepare(this.props.spell, this.state.level, this.state.amount, this.state.modifier)}
                />
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'column',
        width: Dimensions.get('window').width * 0.7
    },
    headerStyle: {
        height: 36,
        justifyContent: 'center'
    },
    spellNameStyle: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center'
    },
    steppersBlockStyle: {
        flexDirection: 'row',
        marginTop: 5
    },
    amountBlockStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    amountLabelStyle: {
        marginBottom: 3
    },
    noteStyle: {
        fontSize: 9,
        color: '#888'
    },
    stepperStyle: {

    },
    levelBlockStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    levelLabelStyle: {
        marginBottom: 3
    },
    modifierBlockStyle: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        padding: 10
    },
    textInputStyle: {
        textAlign: 'center'
    }
}

export default PrepareSpellModal;