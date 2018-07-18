import React from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Text, TouchableHighlight, TouchableOpacity, Modal, Button } from 'react-native';

class SearchItemModalPicker extends React.Component {

    state = {
        modalVisible: false
    }
    
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    // Selectable items in the modal
    generateSelectable(item) {
        return(
            <TouchableHighlight
                underlayColor='#fff'
                key={item.id}
                onPress={() => this.props.toggleItem(this.props.selectionInfo.type, item)}
            >
                <View style={[styles.selectableItemElement, this.props.selectionInfo.selected.includes(item) ? styles.selectableItemElementPressed : styles.selectableItemElementUnpressed]}>
                    <Text>{''+item.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    mainButtonLabel() {
        let label = this.props.name + ': ';
        if (this.props.selectionInfo.selected.length === 0 || this.props.selectionInfo.selected === this.props.selectionInfo.selectable) {
            label += 'any';
        } else {
            this.props.selectionInfo.selected.forEach(item => label = label + item.name + ' ');
        }
        return label;
    }

    render() {
        return(
            <View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { // Back button
                        this.setModalVisible(false);
                    }}>
                    <TouchableOpacity 
                        style={styles.modalContainer} 
                        activeOpacity={1} 
                        onPressOut={() => {this.setModalVisible(false)}}
                    >
                        <ScrollView 
                            directionalLockEnabled={true} 
                            contentContainerStyle={styles.scrollModal}
                        >
                            <TouchableWithoutFeedback>
                                <View style={[styles.modalContent, style=this.props.modalStyles]}>
                                    <ScrollView style={{flex: 1}}>
                                        <View>
                                            <View style={styles.selectableItemsContainer}>
                                                {this.props.selectionInfo.selectable.map(item => this.generateSelectable(item))}
                                            </View>
                                        </View>
                                    </ScrollView>

                                    <Button
                                        style={{alignSelf: 'flex-end'}}
                                        title='Done'
                                        onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible);
                                        }}>
                                    </Button>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </TouchableOpacity>
                </Modal>

                <TouchableHighlight
                    underlayColor='#fff'
                    style={styles.mainButtonLabel}
                    onPress={() => {
                        this.setModalVisible(true);
                    }}>
                    <View style={styles.touchableHighlightBackground}>
                        <Text>{this.mainButtonLabel()}</Text>
                    </View>
                </TouchableHighlight>

            </View>
        );
    }
}

var styles = {
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff33'
    },
    scrollModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    selectableItemsContainer: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selectableItemElement: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 7,
        paddingRight: 7,
        margin: 5
    },
    selectableItemElementUnpressed: {
        backgroundColor: '#fff'
    },
    selectableItemElementPressed: {
        backgroundColor: '#cfc'
    },
    mainButtonLabel: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 7,
        paddingRight: 7,
        margin: 10
    }
};

export default SearchItemModalPicker;