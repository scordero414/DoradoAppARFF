import React, { useState } from 'react'
import { StyleSheet, View, Dimensions, ScrollView, ImageBackground, Item, RefreshControl } from 'react-native'
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    FormControl,
    Image,
    Input,
    Link,
    Button,
    Icon,
    IconButton,
    HStack,
    Divider,
    Alert,
    Spinner
} from 'native-base';
import { auth } from '../constants/keys'

const LogIn = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const usuario = {
        email: email,
    }

    const iniciarSesion = () => {
        setLoading(true)
        auth.signInWithEmailAndPassword(email, password)
            .then(res => {
                props.navigation.navigate('HomeUser', id = res.user.uid)
                console.log(res.user.uid)
                setLoading(false)
            })
            .catch(e => {
                if (e.code === "auth/wrong-password") {
                    setError("La contraseña es incorrecta.")
                }
                else if (e.code === "auth/user-not-found") {
                    setError("Usuario no registrado")
                }
                console.log(e.code)
                setLoading(false)
            })
    }

    return (
        <NativeBaseProvider>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={false} />}>

                <ImageBackground source={require('../assets/nubes.png')} style={styles.fondo}>
                    <View style={styles.brandView}>
                        <Image alt="eldoradoImg" source={require('../assets/eldorado.png')} style={{
                            resizeMode: "center",
                            height: 100,
                            width: 200
                        }} />
                    </View>

                </ImageBackground>

                <View style={styles.bottonView}>

                    <View style={{ marginTop: 50 }}>
                        <NativeBaseProvider>
                            <Box
                                flex={1}
                                p={2}
                                w="90%"
                                mx='auto'
                            >
                                <Heading size="lg" color='003049'>
                                    Inicia Sesión
                                </Heading>
                                <Heading color="muted.400" size="xs">
                                    ¿No tienes una cuenta?.
                                    <Heading color="#FFCA00" size="xs" onPress={() => props.navigation.navigate('CreateUser')}>
                                        Regístrate
                                    </Heading>
                                </Heading>

                                <VStack space={2} mt={5}>
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
                                        <Input onChangeText={(value) => { setPassword(value) }} variant="rounded" type="password" />
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
                                        <Button onPress={() => iniciarSesion()} colorScheme="cyan" _text={{ color: 'white' }}>
                                            {
                                                loading
                                                    ?
                                                    (
                                                        <View>
                                                            {/* <Text>Iniciar Sesión</Text> */}
                                                            <Spinner accessibilityLabel="Loading posts" />
                                                        </View>
                                                    )
                                                    :
                                                    "Iniciar Sesión"
                                            }


                                        </Button>

                                        <HStack justifyContent="center" alignItem='center' >
                                            <IconButton
                                                variant='unstyled'
                                                startIcon={
                                                    <Image alt="opainImg" source={require('../assets/opain.png')} style={{
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
                        </NativeBaseProvider>
                        {/* </View> */}
                    </View>
                </View>



            </ScrollView>
        </NativeBaseProvider>
    )
}

export default LogIn


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
