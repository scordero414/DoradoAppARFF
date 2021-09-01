import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Share, Platform } from 'react-native'
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    Icon,
    IconButton,
    CheckIcon,
    HStack,
    Divider,
    useDisclose,
    Actionsheet,
    RefreshControl,
    Alert,
    Image,
    Text,
    Stack,
    View,
    StatusBar,
    Select,
    Radio,
    TextArea,
    KeyboardAvoidingView,
    Spinner
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const ScannedQR = (props) => {

    const [ultUser, setUltUser] = useState(null)
    const [extintor, setExtintor] = useState(null)
    console.log(props)
    const getUserById = async (id) => {
        // console.log(id)
        const dbRef = store.collection("usuarios").doc(id)
        const doc = await dbRef.get()
        const user = doc.data()
        setUltUser(user)

    }

    const getExtintor = async (id) => {
        // console.log(id)
        const dbRef = store.collection("extintores").doc(id)
        const doc = await dbRef.get()
        const extintor = doc.data()
        setExtintor(extintor)
        getUserById(extintor.userId)
    }



    useEffect(() => {
        getExtintor(props.route.params)
    }, [])

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >

                    <ScrollView>


                        <StatusBar backgroundColor="#3700B3" barStyle="light-content" />

                        <Box safeAreaTop backgroundColor="#0c4a6e" />

                        <HStack bg='#0c4a6e' px={1} py={3} justifyContent='space-between' alignItems='center'>
                            <HStack space={4} alignItems='center'>
                                <IconButton onPress={() => props.navigation.goBack()} icon={<Icon size="sm" as={<MaterialIcons name='arrow-back' />} color="white" />} />
                                <Text color="white" fontSize={20} fontWeight='bold'>Extintor escaneado</Text>
                                <Text color="white" fontSize={20} fontWeight='bold'>EN DESARROLLO</Text>
                            </HStack>
                        </HStack>

                        <Box
                            flex={1}
                            p={2}
                            w="90%"
                            mx='auto'
                            mt={5}
                            mb={10}
                        >
                            <Heading color="muted.400" size="xs">
                                Actualiza la información del extintor.
                            </Heading>
                            <Heading color="muted.400" size="xs">
                                {extintor !== null
                                    ?
                                    (
                                        ultUser.name +
                                        "     " +
                                        extintor.codigo
                                    )
                                    :
                                    ""
                                }
                            </Heading>

                        </Box>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </NativeBaseProvider >
    )
}

export default ScannedQR


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    dates: {
        borderWidth: 1,
        borderColor: "#e7e5e4",
        borderRadius: 5,
        height: 45
    }
})