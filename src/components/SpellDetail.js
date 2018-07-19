import React from 'react';
import { ScrollView, View, Text, Icon } from 'react-native';

class SpellDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.record.spell_name}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        }
    });

    render() {
        const record = this.props.navigation.getParam('record');
        return(
        <ScrollView>
            <View style={styles.detailStyle}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>School: </Text>
                    <Text>{record.school_name}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Descriptor: </Text>
                    <Text>{(record.descriptor !== undefined ? record.descriptor.map((desc) => {return(desc.name + ' ')}).toString().replace(/,/g,'') : '')}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Level: </Text>
                    <Text>
                        {
                            (record.class !== undefined ? record.class.map((sclass) => {return(sclass.name + ' ' + sclass.level + ' ')}).toString().replace(/,/g,'') : '')
                            + (record.domain !== undefined ? record.domain.map((domain) => {return(domain.name + ' ' + domain.level + ' ')}).toString().replace(/,/g,'') : '')
                        }
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Components: </Text>
                    <Text>
                    {
                        (record.verbal_component ? 'Verbal ' : '') +
                        (record.somatic_component ? 'Somatic ' : '') +
                        (record.material_component ? 'Material ' : '') +
                        (record.arcane_focus_component ? 'Arcane Focus ' : '') +
                        (record.divine_focus_component ? 'Divine Focus ' : '') +
                        (record.xp_component ? 'XP' : '')
                    }
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Casting Time: </Text>
                    <Text>{record.casting_time}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Range: </Text>
                    <Text>{record.range}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Target: </Text>
                    <Text>{record.target}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Effect: </Text>
                    <Text>{record.effect}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Area: </Text>
                    <Text>{record.area}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Duration: </Text>
                    <Text>{record.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Saving Throw: </Text>
                    <Text>{record.saving_throw}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Spell Resistance: </Text>
                    <Text>{record.spell_resistance}</Text>
                </View>
            </View>
            <View style={styles.descriptionStyle}>
                <Text>
                    {record.description}
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
        flexWrap: 'nowrap'
    },
    detailTitleStyle: {
        fontWeight: '500'
    },
    descriptionStyle: {
        padding: 7
    }
}

export default SpellDetail;