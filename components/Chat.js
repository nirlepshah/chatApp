import React from "react";
import { Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { View, Text, Button } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import CustomActions from './CustomActions';
import { initializeApp } from "firebase/app";
const firebase = require('firebase');
require('firebase/firestore');
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

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
            },
            isConnected: false,
            image: null,
            location: null,
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
        this.refMsgsUser = null;
    }
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    };
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    };
    componentDidMount() {
        //entered name state from Start screen gets displayed in status bar at the top of the app
        const name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log('online');

                // stop receiving updates about a collection
                this.unsubscribe = this.referenceChatMessages
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(this.onCollectionUpdate);

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
                        },
                    });

                    this.refMsgsUser = firebase
                        .firestore()
                        .collection("messages")
                        .where("uid", "==", this.state.uid);

                });
                this.saveMessages();
            } else {
                // if user offline
                this.setState({ isConnected: false });
                console.log('offline');
                this.getMessages();
            }
        });
    }
    //listen for the updates in the collection using Firestore’s onSnapshot function
    //loops through each field within each doucment saved into the messages object

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
                },
                image: data.image || null,
                location: data.location || null,
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
            uid: this.state.uid,
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }

    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
            this.saveMessages();
        })
    }

    //dont receive updates from collection
    componentWillUnmount() {
        if (this.state.isConnected) {
            //stop listening to the authentication
            this.authUnsubscribe();
            //stop listening ofr the changes
            this.unsubscribe();
        }
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

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }
    //renderCustomActions function is responsible for creating the circle button
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };
    //return a MapView when surrentMessage contains location data
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    render() {
        // Value received from the Start screen. Entered nams is displayed on the top 
        let name = this.props.route.params.name;

        // Background color received from the Start screen 
        const { bgColor } = this.props.route.params;
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: bgColor }}>
                {/* <Text>{name} entered the chat</Text> */}

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
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