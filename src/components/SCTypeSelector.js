import React from 'react';
import ModalSelector from 'react-native-modal-selector';

const SCTypeSelector = (props) => {
    return(
        <ModalSelector
            data={[
                { key: 0, label: 'Prepared, from spellbook', type: 'preparedSpellbook' },
                { key: 1, label: 'Prepared, from list', type: 'preparedList' },
                { key: 2, label: 'Spontaneous', type: 'spontaneous' }
            ]}
            keyExtractor={(option) => option.key}
            labelExtractor={(option) => option.label}
            initValue='Select spellcaster type'
            onChange={props.onChange}
            animationType='fade'
            style={props.style}
        />
    );
}

export default SCTypeSelector;