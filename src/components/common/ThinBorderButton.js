import React, { Component } from 'react';
import { TouchableHighlight, Text } from 'react-native';

class ThinBorderButton extends Component {

    render() {
        styles = {
            buttonStyle: {
                borderWidth: this.props.small ? 1 : 2,
                backgroundColor: '#e9e9ef',
                borderRadius: 10,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: this.props.color
            },
            buttonText: {
                color: this.props.color,
                fontSize: this.props.small ? 16 : 20,
                paddingLeft: this.props.small? 20 : 30,
                paddingRight: this.props.small? 20 : 30,
                paddingTop: this.props.small? 3 : 5,
                paddingBottom: this.props.small? 3 : 5
            }
        };
        
        return (
            <TouchableHighlight
                style={[styles.buttonStyle, this.props.style]}
                underlayColor='#e9e9ef'
                onPress={this.props.onPress}
            >
                <Text style={styles.buttonText}>{this.props.children}</Text>
            </TouchableHighlight>
        ); 
    }
}

export { ThinBorderButton };