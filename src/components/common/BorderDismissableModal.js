import React from 'react';
import { Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, View } from 'react-native';

const BorderDismissableModal = (props) => {
    return(
        <Modal
            animationType='fade'
            transparent={true}
            visible={props.visible}
            onRequestClose={() => { // Back button
                props.visibilitySetter(false);
            }}>
            <TouchableOpacity 
                style={styles.modalContainer} 
                activeOpacity={1} 
                onPressOut={() => {props.visibilitySetter(false)}}
            >
                <ScrollView 
                    directionalLockEnabled={true} 
                    contentContainerStyle={styles.scrollModal}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContent, props.modalStyles]}>
                            {props.children}
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = {
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
        elevation: 5
    }
}

export { BorderDismissableModal };