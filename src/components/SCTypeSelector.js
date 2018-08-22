import React from 'react';
import ModalSelector from 'react-native-modal-selector';

const SCTypeSelector = (props) => {

    decodeSpellCasterTypeText = (type) => {
        switch (type) {
            case 'preparedSpellbook':
                return 'Prepared, from spellbook';
            case 'preparedList':
                return 'Prepared, from list';
            case 'spontaneous':
                return 'Spontaneous';
            default:
                return 'Select spellcaster type';
        }
    }

    return(
        <ModalSelector
            data={[
                { key: 0, label: 'Prepared, from spellbook', type: 'preparedSpellbook' },
                { key: 1, label: 'Prepared, from list', type: 'preparedList' },
                { key: 2, label: 'Spontaneous', type: 'spontaneous' }
            ]}
            keyExtractor={(option) => option.key}
            labelExtractor={(option) => option.label}
            initValue={decodeSpellCasterTypeText(props.initValue)}
            onChange={props.onChange}
            animationType='fade'
            style={props.style}
        />
    );
}

export default SCTypeSelector;