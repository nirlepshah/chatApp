import React from "react";
import react from "react";
import { View, Text, Button, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import BackgroundImage from '../assets/background-image.png';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Start extends React.Component {

    constructor(props) {
        super(props);
        // State value will be updated based on the change

        this.state = {
            name: '',
            bgColor: ''
        };
    }



    //function to change the state with the background color from the color list

    changeBgColor = (newColor) => {
        this.setState({ bgColor: newColor });
    };
    //background colors
    colors = {
        color1: '#090C08',
        color2: '#474056',
        color3: '#8A95A5',
        color4: '#B9C6AE'
    };

    render() {

        return (
            //View act as Div
            <View style={styles.container}>
                <ImageBackground source={BackgroundImage} resizeMode='cover' style={styles.backgroundImage}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Chat App</Text>
                    </View>

                    <View style={styles.box1}>
                        <View style={styles.inputBox}>
                            <Icon style={styles.icon} name="user" size={30} color="#888" />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder='Your Name'
                            />
                        </View>
                        <View style={styles.colorBox}>
                            <Text style={styles.chooseColor}> Choose Background Color: </Text>
                        </View>
                        <View style={styles.colorPicker}>
                            {/* Green color */}
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="Background color change"
                                accessibilityHint="Lets you choose a green background color for the Chat Screen"
                                accessibilityRole="button"
                                style={styles.roundButton1}
                                onPress={() => this.changeBgColor(this.colors.color1)}>

                            </TouchableOpacity>
                            {/* Wine color */}
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="Background color change"
                                accessibilityHint="Lets you choose a wine background color for the Chat Screen"
                                accessibilityRole="button"
                                style={styles.roundButton2}
                                onPress={() => this.changeBgColor(this.colors.color2)}>

                            </TouchableOpacity>
                            {/* Gray color */}
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="Background color change"
                                accessibilityHint="Lets you choose a gray background color for the Chat Screen"
                                accessibilityRole="button"
                                style={styles.roundButton3}
                                onPress={() => this.changeBgColor(this.colors.color3)}
                            >

                            </TouchableOpacity>
                            {/* Ash color */}
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="Background color change"
                                accessibilityHint="Lets you choose a ash background color for the Chat Screen"
                                accessibilityRole="button"
                                style={styles.roundButton4}
                                onPress={() => this.changeBgColor(this.colors.color4)}>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.button}>
                            <Button style={styles.buttontext}
                                color="#FFFFFF"
                                title="Start Chatting"
                                onPress={() =>
                                    this.props.navigation.navigate('Chat', {
                                        name: this.state.name,
                                        bgColor: this.state.bgColor
                                    })
                                }
                            />

                        </View>

                    </View>


                </ImageBackground >
            </View >


        )
    }

}
//Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
    },

    titleContainer: {
        width: '60%',
        height: 'auto',
        alignItems: 'center',
        marginTop: 60,
        resizeMode: 'contain',
        flex: 1,
    },
    titleText: {
        fontSize: 50,
        fontWeight: '600',
        color: '#ffffff',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box1: {
        backgroundColor: 'white',
        height: '44%',
        width: '88%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 0.5,
    },

    box1: {
        backgroundColor: 'white',
        height: '44%',
        width: '88%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 50

    },
    inputBox: {
        borderWidth: 2,
        borderRadius: 1,
        borderColor: 'grey',
        width: '88%',
        height: 60,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,


    },
    colorBox: {
        flex: 1,
        width: '70%',

    },

    chooseColor: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 1,
        marginTop: 20,
        marginLeft: -100,
    },

    button: {
        height: 70,
        width: 300,
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,


    },
    buttontext: {
        fontSize: 16,
        fontWeight: "300",


    },
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '88%',
        paddingBottom: 15,
        textAlign: "left",
        paddingRight: 40
    },

    roundButton1: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#090C08',
        marginBottom: 30
    },
    roundButton2: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#474056',
        marginBottom: 30
    },
    roundButton3: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#8A95A5',
        marginBottom: 30
    },
    roundButton4: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#B9C6AE',
        marginBottom: 30
    },
});

