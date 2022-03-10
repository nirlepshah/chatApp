import React from "react";
import { Platform, KeyboardAvoidingView } from 'react-native';
import { View, Text, Button } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { initializeApp } from "firebase/app";
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            //container to hold messages
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            }
        }
        //firebase configuration info. 
        const firebaseConfig = {
            apiKey: "AIzaSyCSZasU59QsD2osKGI9qx3LnVJqrgjm0oY",
            authDomain: "chatapp-e7ccc.firebaseapp.com",
            projectId: "chatapp-e7ccc",
            storageBucket: "chatapp-e7ccc.appspot.com",
            messagingSenderId: "724556454034",
            appId: "1:724556454034:web:38a596e3fdcac729bf2e4b"
        };
        //initialize app 
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        //refernece to the message collections created in firestore database

        this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    componentDidMount() {
        //entered name state from Start screen gets displayed in status bar at the top of the app
        const name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        //authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            //update user state with the currently active user data
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any"
                }
            });
            // stop receiving updates about a collection
            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    }
    //listen for the updates in your collection using Firestore’s onSnapshot function

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                }
            });
        });
        this.setState({
            messages: messages
        });
    }

    addMessage() {
        const message = this.state.messages[0];
        //function to add new message to the collection 
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: this.state.user
        });
    }


    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
        })
    }

    //dont receive updates from collection
    componentWillUnmount() {
        //stop listening to the authentication
        this.authUnsubscribe();
        //stop listening ofr the changes
        this.unsubscribe();
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {},
                    right: {},
                }}
            />
        )
    };

    render() {
        // Value received from the Start screen. Entered nams is displayed on the top 
        let name = this.props.route.params.name;

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
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.user.avatar
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        )
    }
}