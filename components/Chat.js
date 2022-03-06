import React from "react";
import { Platform, KeyboardAvoidingView } from 'react-native';
import { View, Text, Button } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        const name = this.props.route.params.name;
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello ' + name,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: name + ' has entered the chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    render() {
        // Value received from the Start screen. Entered nams is displayed on the top 
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name })
        // Background color received from the Start screen 
        const { bgColor } = this.props.route.params;
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: bgColor }}>
                {/* <Text>Hello {name} Welcome to the Chat</Text> */}
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        )
    }
}