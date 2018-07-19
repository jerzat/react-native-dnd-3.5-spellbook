import React, {Component} from 'react';
import { ScrollView, View, Text, TouchableHighlight, Dimensions } from 'react-native';

class SpellDetail extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.record.spell_name}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
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
                    <Text>{record.descriptor_name}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailTitleStyle}>Level: </Text>
                    <Text>
                        {
                            (record.class_name ? record.class_name + ' ' : '') +
                            +(record.class_level ? record.class_level : '')
                            +(record.domain_name ? ' ' + record.domain_name + ' ' : '')
                            +(record.domain_level ? record.domain_level : '')
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