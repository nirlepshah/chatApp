import React from "react";
import react from "react";
import { View, Text, Button } from 'react-native';

export default class Chat extends React.Component {

    render() {
        // Value received from the Start screen. Entered nams is displayed on the top 
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name })
        // Background color received from the Start screen 
        const { bgColor } = this.props.route.params;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }}>
                <Text>Hello {name} Welcome to the Chat</Text>
            </View>
        )
    }
}