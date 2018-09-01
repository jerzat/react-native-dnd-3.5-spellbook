import React from 'react';
import { View, ScrollView, Text, TouchableHighlight, Button } from 'react-native';
import { BorderDismissableModal } from './common';

class SearchItemModalPicker extends React.Component {

    state = {
        modalVisible: false
    }
    
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    // Selectable items in the modal
    generateSelectable(item) {
        let selected = this.props.selectionInfo.selected.findIndex(element => element.id === item.id);
        return(
            <TouchableHighlight
                underlayColor='#fff'
                key={item.id}
                onPress={() => this.props.toggleItem(this.props.selectionInfo.type, item)}
            >
                <View style={[styles.selectableItemElement, this.props.selectableStyles, selected > -1 ? styles.selectableItemElementPressed : styles.selectableItemElementUnpressed]}>
                    <Text style={[styles.selectableItemElementText, this.props.selectableTextStyles]}>{''+item.name}</Text>
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
                <BorderDismissableModal
                    visible={this.state.modalVisible}
                    visibilitySetter={(visibility) => this.setModalVisible(visibility)}
                    modalStyles={this.props.modalStyles}
                >
                    <ScrollView>
                        <View style={styles.selectableItemsContainer}>
                            {this.props.selectionInfo.selectable.length === 0 ?
                                <Text>Database busy, please wait...</Text> :
                                this.props.selectionInfo.selectable.map(item => this.generateSelectable(item))
                            }
                        </View>
                    </ScrollView>

                    <Button
                        style={{alignSelf: 'flex-end'}}
                        title='Done'
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                    </Button>
                </BorderDismissableModal>

                <TouchableHighlight
                    underlayColor='#e9e9ef'
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
        padding: 15 // Shadow
    },
    modalContent: {
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 5,
        shadowOpacity: 0.5,
        borderRadius: 10,
        elevation: 5,
        minHeight: 50
    },
    selectableItemsContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    selectableItemElement: {
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#68b1ff',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 7,
        paddingRight: 7,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectableItemElementUnpressed: {
        backgroundColor: '#fff'
    },
    selectableItemElementPressed: {
        backgroundColor: '#cfc'
    },
    selectableItemElementText: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    mainButtonLabel: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#68b1ff',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 7,
        paddingRight: 7,
        margin: 10
    }
};

export default SearchItemModalPicker;