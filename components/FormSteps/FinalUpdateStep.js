import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Share, Platform, View } from 'react-native'
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
    StatusBar,
    Select,
    Radio,
    TextArea,
    KeyboardAvoidingView,
    Spinner,
    Progress,
    useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
// import { NativeBaseProvider, View, VStack, HStack, Image, Stack, Heading, IconButton, Box, Flex, Spacer, Button, Text, CheckIcon, Accordion, Select, Content, Alert, List } from 'native-base'
import QRGnereator from '../QRGenerator'
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";

import { store, storage } from '../../constants/keys'
import { SimpleLineIcons } from '@expo/vector-icons';


const FinalUpdateStep = (props) => {

    const [error, setError] = useState(null);
    const [revision, setRevision] = useState(null);
    const toast = useToast()

    const validate = () => {

        for (let i in props.extintor) {
            if (props.extintor[i] === null) {
                setError("Debes de llenar todos los campos, revisa: " + i.charAt(0).toUpperCase() + i.slice(1))
                return false
            }
        }
        return true
    }

    const createNewRevision = async (id) => {
        const dbRef = store.collection("revision_extintores").doc(id)
        const doc = await dbRef.get()
        const revision_db = doc.data()

        store.collection("extintores").doc(revision_db.extintor).update(props.extintor)
            .then(() => {
                toast.show({
                    title: "Revision actualizada exitosamente",
                    status: "success",
                    description: `Regresaremos a la página principal.`,
                })
                store.collection("revision_extintores").doc(id).update({
                    userId: props.userId,
                    ultima_modificacion: new Date()
                })
                    .then(() => {
                        console.log(id);

                        props.navigation.navigate('Revision', {idExtintor: id, userId: props.userId})

                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });


    }


    return (
        <View>
            {error !== null ?
                <Alert status="error" w="100%">
                    <Alert.Icon />
                    <Alert.Title
                        flexShrink={1}
                    >{error}</Alert.Title>
                </Alert> :
                <View></View>
            }
            {/* {idRevision == null
                ? */}
            <HStack justifyContent="space-between">
                <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={props.previousStep}>
                    <Stack direction="row" space={3} alignItems="center">
                        <SimpleLineIcons name="arrow-left" size={24} color="white" />
                        <Text fontSize="md" color='#ffffff'>Regresar</Text>
                    </Stack>
                </Button>
            </HStack>
            {/* : <View>
                </View>
            } */}
            <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => { createNewRevision(props.revisionId) }} >
                <Stack direction="row" space={3} alignItems="center">
                    <Text fontSize="md" color='#ffffff'>Actualizar información</Text>
                </Stack>
            </Button>


        </View>
    )
}

export default FinalUpdateStep
