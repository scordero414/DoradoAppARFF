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


function useCapture() {
    const captureViewRef = useRef(null);

    const onCapture = useCallback(() => {
        (async function onCapture() {

            captureRef(captureViewRef, {
                format: 'jpg',
                quality: 0.9,
            })
                .then(uri => {
                    console.log('storing ', uri);
                    Share.share({ url: uri }).then(({ action, activityType }) => {
                        if (action === Share.sharedAction)
                            console.log('Share was successful');
                        else
                            console.log('Share was dismissed');
                    });
                })
                .catch(error => console.log('Oops, snapshot failed', error));
        })();
    }, []);

    return {
        captureViewRef,
        onCapture,
    };
}

const FinalStep = (props) => {


    const { captureViewRef, onCapture } = useCapture();
    const toast = useToast()

    const [createQr, setCreateQr] = useState(false)
    const viewShotRef = useRef()
    const [idRefExt, setIdRefExt] = useState(null)
    const [idRevision, setIdRevision] = useState(null);
    const [error, setError] = useState(null)

    useEffect(() => {
        if (idRefExt !== null)
            createExtintorRevision();
    }, [idRefExt])

    const validate = () => {

        for (let i in props.extintor) {
            if (props.extintor[i] === null) {
                setError("Debes de llenar todos los campos, revisa: " + i.charAt(0).toUpperCase() + i.slice(1))
                return false
            }
        }
        return true
    }

    const createQrCode = () => {
        if (validate()) {
            store.collection("extintores").add(props.extintor)
                .then((docRef) => {
                    setIdRefExt(docRef.id);
                    // console.log("Document written with ID: ", docRef.id);
                    // createExtintorRevision(docRef.id);
                })
                .catch((error) => {
                    // console.error("Error adding document: ", error.code);
                });
            setCreateQr(!createQr)
        }
    }

    const createExtintorRevision = () => {
        let revision = {
            userId: props.userId,
            extintor: idRefExt,
            ultima_modificacion: new Date()
        }
        store.collection("revision_extintores").add(revision)
            .then((docRef) => {
                setIdRevision(docRef.id)
                toast.show({
                    title: "¡Código QR creado exitosamente!",
                    status: "success",
                    description: "Por favor guarda el código.",
                })
            })
            .catch((error) => {
                // console.error("Error adding document: ", error.code);
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
            {idRevision == null
                ?
                <HStack justifyContent="space-between">
                    <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={props.previousStep}>
                        <Stack direction="row" space={3} alignItems="center">
                            <SimpleLineIcons name="arrow-left" size={24} color="white" />
                            <Text fontSize="md" color='#ffffff'>Regresar</Text>
                        </Stack>
                    </Button>
                </HStack>
                : <View>
                </View>
            }
            {
                idRefExt == null
                    ?
                    <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => createQrCode()}>
                        <Stack direction="row" space={3} alignItems="center">
                            <Text fontSize="md" color='#ffffff'>Crear Código QR</Text>
                        </Stack>
                    </Button>
                    :
                    <View></View>
            }

            {
                createQr
                    ?
                    (

                        <View justifyContent='center' alignItems='center'>

                            <Heading color="muted.400" size="xs" mt={5}>
                                Guarda el código QR.
                            </Heading>
                            {idRevision !== null
                                ?
                                <Button variant="unlisted" onPress={onCapture}>
                                    <View ref={captureViewRef} collapsable={false}>
                                        <QRGnereator props={idRevision}></QRGnereator>
                                    </View>
                                </Button>
                                :
                                <Spinner m={5} size="lg" />
                            }
                            <Heading color="muted.400" size="xs" >
                                Dale click al código QR para guardarlo.
                            </Heading>
                        </View>
                    )
                    :
                    <View></View>
            }
        </View>
    )
}

export default FinalStep
