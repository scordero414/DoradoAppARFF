import React, { useState } from 'react'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Dimensions, ScrollView, ImageBackground, Text, Image, Item, RefreshControl, Platform } from 'react-native'
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
    HStack,
    Divider,
    Alert,
    useDisclose,
    Actionsheet,
} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { auth, store, storage } from '../constants/keys'

const CreateUser = (props) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclose()
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState(null)
    const [imgURL, setImgURL] = useState(null)


    const uploadImage = async (uri) => {

        const filename = uri.substring(uri.lastIndexOf('/') + 1)
        const response = await fetch(uri)
        const blob = await response.blob()

        const ref = storage.ref().child("userImages/" + filename).put(blob)

        ref.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log(error.code);
        }, function () {
            ref.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                setImgURL(downloadURL);
            });
        });
    };


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const openImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permissionResult.granted === false) {
            alert('Los permisos para acceder a la cámara son requeridos.')
            return
        }

        const pickedImage = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true })
        if (pickedImage.cancelled)
            return
        setSelectedImage(pickedImage.uri)
        uploadImage(pickedImage.uri)
    }

    const openCamera = async () => {

        const permissionResult = await ImagePicker.getCameraPermissionsAsync()
        if (permissionResult.granted === false) {
            alert('Los permisos para acceder a la cámara son requeridos.')
            return
        }

        const pickedImage = await ImagePicker.launchCameraAsync()
        if (pickedImage.cancelled)
            return
        setSelectedImage(pickedImage.uri)
        uploadImage(pickedImage.uri)
    }

    const registrarUsuario = async () => {
        
        if (!nombre.trim()) {
            setError("Ingrese su nombre.")
            return
        }
        if (!email.trim()) {
            setError("Ingrese su email.")
            return
        } else if (!password1.trim() || !password2.trim()) {
            setError("Ingrese una contraseña.")
            return
        } else if (password1 !== password2) {
            setError("Las contraseñas tienen que coincidir.")
            return
        }

        if (!email.endsWith('@eldorado.aero')) {
            setError("No estás autorizado para crear cuentas.")
            return
        }

        if (!selectedImage.trim()) {
            setError("Tienes que elegir una foto.")
            return
        }
        

        auth.createUserWithEmailAndPassword(email, password1)
            .then((res) => {
                // console.log(res.user.uid)
                const usuario = {
                    nombre: nombre,
                    email: email,
                    img: imgURL,
                    state: null
                }
                store.collection('usuarios').doc(res.user.uid).set(usuario)
                alert("Usuario Registrado exitosamente")
                props.navigation.navigate('HomeUser', res.user.uid)
                // guardarInfoUser(usuario, res.user.uid)

            })
            .catch((e) => {
                if (e.code === "auth/invalid-email") {
                    setError("El formato de email es incorrecto.")
                } else if (e.code === "auth/weak-password") {
                    setError("La contraseña debe de ser de 6 caracteres o más.")
                } else if (e.code === "auth/email-already-in-use") {
                    setError("El email ya está registrado.")
                } else {
                    setError(e.code)
                }
            })

    }

    // const guardarInfoUser = async (usuario, res) => {

    //     try {
    //         await 
    //     } catch (err) {
    //         console.log("ERORRRR: "+ err.code)
    //     }
    //     // setNombre('')
    //     // setEmail('')
    //     // setSelectedImage(null)
    //     // setError(null)
    // }

    return (
        <NativeBaseProvider>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={false} />}>

                <ImageBackground source={require('../assets/nubes.png')} style={styles.fondo}>
                    <View style={styles.brandView}>
                        <Image source={require('../assets/eldorado.png')} style={{
                            resizeMode: "center",
                            height: 100,
                            width: 200
                        }} />
                    </View>

                </ImageBackground>

                <View style={styles.bottonView}>

                    <View style={{ marginTop: 50 }}>

                        <Box
                            flex={1}
                            p={2}
                            w="90%"
                            mx='auto'
                        >
                            <Heading size="lg" color='003049'>
                                Bienvendido
                            </Heading>
                            <Heading color="muted.400" size="xs">
                                Crea tu cuenta para continuar.
                            </Heading>

                            <VStack space={2} mt={5}>
                                <FormControl>
                                    <FormControl.Label placeholder="Juan Perez" _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Nombre Completo
                                    </FormControl.Label>
                                    <Input onChangeText={(value) => { setNombre(value) }} variant="rounded" />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label placeholder="example@gmail.com" _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Email
                                    </FormControl.Label>
                                    <Input onChangeText={(value) => { setEmail(value) }} variant="rounded" />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Contraseña
                                    </FormControl.Label>
                                    <Input onChangeText={(value) => { setPassword1(value) }} variant="rounded" type="password" />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Confirmar Contraseña
                                    </FormControl.Label>
                                    <Input onChangeText={(value) => { setPassword2(value) }} variant="rounded" type="password" />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Selecciona una foto.
                                    </FormControl.Label>
                                    <Button size="xs" colorScheme="yellow" _text={{ color: 'white' }} onPress={onOpen}>
                                        Seleccionar...
                                    </Button>

                                    <VStack space={2} mt={5} justifyContent="center" alignItem='center' >
                                        <HStack justifyContent="center" alignItem='center'>
                                            {selectedImage !== null ?
                                                (<Image
                                                    source={{ uri: selectedImage }}
                                                    style={styles.image2}
                                                />) :
                                                <View></View>}
                                        </HStack>

                                    </VStack>

                                </FormControl>

                                <VStack space={2} mt={5}>
                                    {error !== null ?
                                        <Alert status="error" w="100%">
                                            <Alert.Icon />
                                            <Alert.Title
                                                flexShrink={1}
                                            >{error}</Alert.Title>
                                        </Alert> :
                                        <View></View>
                                    }
                                    <Button colorScheme="cyan" _text={{ color: 'white' }} onPress={() => registrarUsuario()}>
                                        Registrarse
                                    </Button>

                                    <HStack justifyContent="center" alignItem='center' >
                                        <IconButton
                                            variant='unstyled'
                                            startIcon={
                                                <Image source={require('../assets/opain.png')} style={{
                                                    resizeMode: "center",
                                                    height: 100,
                                                    width: 200
                                                }} />
                                            }
                                        />
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>


                        {/* </NativeBaseProvider> */}
                        {/* </View> */}
                    </View>
                </View>



            </ScrollView>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Actionsheet.Item onPress={() => {
                        onClose()
                        openCamera()
                    }}>Abrir cámara</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => {
                        onClose()
                        openImagePicker()
                    }}>Abrir galería</Actionsheet.Item>
                    <Actionsheet.Item onPress={onClose}>Cancelar</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </NativeBaseProvider>

    )
}


export default CreateUser


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',

    },
    fondo: {
        height: Dimensions.get('window').height / 3.5,
    },
    brandView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottonView: {
        flex: 1.5,
        backgroundColor: 'white',
        bottom: 50,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
    },
    image2: {
        height: 200,
        width: 200,
        borderRadius: 200 / 2,
        // resizeMode: 'contain',
    }
})
