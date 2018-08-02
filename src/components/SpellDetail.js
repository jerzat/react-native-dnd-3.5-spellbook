import React from 'react';
import { ScrollView, View, Text, Icon } from 'react-native';
import StatusParsedText from './StatusParsedText';

class SpellDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.record.spell_name}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        }
    });

    renderItem(name, content) {
        if (content === '' || content === undefined || content === null) {
            return;
        }
        return (
        <View style={styles.detailItem}>
            <View style={styles.detailItemTitleStyle}>
                <Text style={styles.detailItemTitleTextStyle}>{name}</Text>
            </View>
            <View style={styles.detailItemContentStyle}>
                <Text style={styles.detailItemContentTextStyle}>{content}</Text>
            </View>
        </View>
        );
    }

    render() {
        const record = this.props.navigation.getParam('record');
        return(
        <ScrollView>
            <View style={styles.detailStyle}>
                {this.renderItem(
                    'School',
                    record.school_name
                )}
                {this.renderItem(
                    'Descriptor',
                    record.descriptor !== undefined ? record.descriptor.map((desc) => {return(desc.name + ' ')}).toString().replace(/ ,/g,', ') : ''
                )}
                {this.renderItem(
                    'Level',
                    (record.class !== undefined ? record.class.map((sclass) => {return(sclass.name + ' ' + sclass.level + ' ')}).toString().replace(/ ,/g,', ') : '')
                    + (record.domain !== undefined ? record.domain.map((domain) => {return(domain.name + ' ' + domain.level + ' ')}).toString().replace(/ ,/g,', ') : '')
                )}
                {this.renderItem(
                    'Components',
                    (record.verbal_component ? 'Verbal ' : '') +
                    (record.somatic_component ? 'Somatic ' : '') +
                    (record.material_component ? 'Material ' : '') +
                    (record.arcane_focus_component ? 'Arcane Focus ' : '') +
                    (record.divine_focus_component ? 'Divine Focus ' : '') +
                    (record.xp_component ? 'XP' : '')
                )}
                {this.renderItem(
                    'Casting Time',
                    record.casting_time
                )}
                {this.renderItem(
                    'Range',
                    record.range
                )}
                {this.renderItem(
                    'Target',
                    record.target
                )}
                {this.renderItem(
                    'Effect',
                    record.effect
                )}
                {this.renderItem(
                    'Area',
                    record.area
                )}
                {this.renderItem(
                    'Duration',
                    record.duration
                )}
                {this.renderItem(
                    'Saving Throw',
                    record.saving_throw
                )}
                {this.renderItem(
                    'Spell Resistance',
                    record.spell_resistance
                )}
            </View>
            <View style={styles.descriptionStyle}>
                <StatusParsedText>
                    {record.description}
                </StatusParsedText>
            </View>
            <View style={styles.rulebookStyle}>
                <Text style={styles.rulebookTextStyle}>
                    {record.rulebook.length > 1 ? record.rulebook.map((rulebook) => {return(rulebook.name + ' ')}).toString().replace(/ ,/g,', ') : record.rulebook[0].name}
                </Text>
            </View>
        </ScrollView>
        );
    }

}

const styles = {
    schoolStyle: {

    },
    schoolTextStyle: {
        fontStyle: 'italic'
    },
    detailStyle: {
        padding: 7
    },
    detailItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: 5
    },
    detailItemTitleStyle: {
        flex: 1.5
    },
    detailItemTitleTextStyle: {
        fontWeight: 'bold',
        textAlign: 'right',
        textAlignVertical: 'top'
    },
    detailItemContentStyle: {
        flex: 4,
        paddingLeft: 5,
    },
    detailItemContentTextStyle: {
        fontWeight: 'normal',
        textAlign: 'left',
        textAlignVertical: 'top'
        
    },
    detailTitleStyle: {
        fontWeight: '500'
    },
    descriptionStyle: {
        padding: 7
    },
    rulebookStyle: {
        padding: 7
    },
    rulebookTextStyle: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#444',
        textAlign: 'right'
    }
}

export default SpellDetail;