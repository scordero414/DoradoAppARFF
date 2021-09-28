import React, { useEffect, useState } from "react";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Image, TouchableOpacity } from "react-native";
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
    Text,
    Stack,
    View,
    StatusBar,
    Select,
    Radio,
    TextArea,
    KeyboardAvoidingView,
    Spinner,
    usePropsResolution,
    ScrollView,
} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { store, storage } from '../../constants/keys'

const Step1 = (props) => {
    const textColor = { color: 'muted.700', fontSize: 'sm', fontWeight: 600 }
    const [selectedImage, setSelectedImage] = useState(props.extintor.foto)
    const [imgURL, setImgURL] = useState(null)
    const [loadingImage, setLoadingImage] = useState(false)

    const uploadImage = async (uri, folder) => {

        const filename = uri.substring(uri.lastIndexOf('/') + 1)
        // const filename3 = `${extintor.codigo}.png`
        const response = await fetch(uri)
        const blob = await response.blob()

        const ref = storage.ref().child(folder + filename).put(blob)

        ref.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log('Eroor' + error.code);
        }, function () {
            ref.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                props.extintor.foto = downloadURL;
                // setImgURL(downloadURL)
                // setLoadingImage(false)
            });
        });

    };

    const openCamera = async () => {

        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if (permissionResult.granted === false) {
            alert('Los permisos para acceder a la cámara son requeridos.')
            return
        }

        const pickedImage = await ImagePicker.launchCameraAsync()
        if (pickedImage.cancelled)
            return
        //setLoadingImage(true)
        setSelectedImage(pickedImage.uri)
        uploadImage(pickedImage.uri)
        return
    }

    const handleChange = (event) => {
        props.extintor.codigo = (event.target.value)
        // props.extintor[extintorProp] = event.target.value
    };

    return (
        <View>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
                    <Box
                        p={2}
                        w="90%"
                        mx='auto'
                        mt={5}
                        mb={20}
                    >
                        <FormControl>
                            <FormControl.Label _text={{ textColor }}>
                                Toma una foto del extintor.
                            </FormControl.Label>
                            {
                                selectedImage === null ?
                                    <Button size="xs" colorScheme="yellow" _text={{ color: 'white' }} onPress={openCamera} >
                                        Tomar foto
                                    </Button>
                                    :
                                    <View></View>
                            }


                            <VStack space={2} mt={5} mb={5} justifyContent="center" alignItem='center' >
                                <HStack justifyContent="center" alignItem='center' >
                                    {
                                        selectedImage && <Image m={5} source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
                                    }
                                </HStack>
                            </VStack>

                            <FormControl.Label _text={{ textColor }}>
                                Código
                            </FormControl.Label>
                            <Input variant="outline" defaultValue={props.extintor.codigo} onChangeText={(text) => {
                                props.extintor.codigo = text
                            }} />
                            <FormControl.Label mt={2} _text={{ textColor }}>
                                Terminal
                            </FormControl.Label>
                            <Input variant="outline" defaultValue={props.extintor.terminal} onChangeText={(text) => {
                                props.extintor.terminal = text
                            }} />

                            <FormControl.Label mt={2} _text={{ textColor }}>
                                Ubicación
                            </FormControl.Label>
                            <Input variant="outline" defaultValue={props.extintor.ubicacion} onChangeText={(text) => {
                                props.extintor.ubicacion = text
                            }} />


                            <FormControl.Label mt={2} _text={{ textColor }}>
                                Ubicación detallada
                            </FormControl.Label>
                            <Input variant="outline" defaultValue={props.extintor.ubicacionDetallada} onChangeText={(text) => {
                                props.extintor.ubicacionDetallada = text
                            }} />


                            <FormControl.Label mt={2} _text={{ textColor }}>
                                Ubicación exacta
                            </FormControl.Label>
                            <Input variant="outline" defaultValue={props.extintor.ubicacionExacta} onChangeText={(text) => {
                                props.extintor.ubicacionExacta = text
                            }} />
                        </FormControl>
                        <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={props.nextStep}>
                            <Stack direction="row" space={3} alignItems="center">
                                <Text fontSize="md" color='#ffffff'>Continuar</Text>
                                <SimpleLineIcons name="arrow-right" size={24} color="white" />
                            </Stack>
                        </Button>
                    </Box>
                </KeyboardAvoidingView>
            </ScrollView>

        </View>
    );
}



export default Step1;