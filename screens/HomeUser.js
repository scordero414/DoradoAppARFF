import { NativeBaseProvider, View, Center, VStack, HStack, Modal, Image, Stack, Spinner, Heading, IconButton, Box, Flex, Spacer, Button, Text, CheckIcon, Accordion, Select, Content, Alert, List } from 'native-base'
import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, ScrollView, Share } from 'react-native'
import { auth, store } from '../constants/keys'
import { SimpleLineIcons } from '@expo/vector-icons';
import Scanner from '../components/Scanner';


const HomeUser = (props) => {

    const [qrCodeScanner, setQrCodeScanner] = useState(false)

    const [user, setUser] = useState({
        id: '',
        nombre: '',
        email: '',
        img: null,
        state: null
    })

    const [loading, setLoading] = useState(false)
    const [usuarios, setUsuarios] = useState([])

    const [showModal, setShowModal] = useState(false)

    const getUserById = async (id) => {
        const dbRef = store.collection("usuarios").doc(id)
        const doc = await dbRef.get()
        const user = doc.data()
        setUser({
            ...user,
            id: doc.id,
        })
        setShowModal(false)
    }

    useEffect(() => {
        setShowModal(true)
        // setLoading(true)
        getUserById(props.route.params)
        getUsuarios()
        // setLoading(false)
    }, [])

    const goCreateQR = () => {
        setLoading(true)
        props.navigation.navigate('InfoQR', {revision: null, revisionId: null, userId: user.id})
        setLoading(false)
    }

    const logout = () => {
        auth.signOut().
            then(res => {
                props.navigation.popToTop()
                    && props.navigation.navigate('Home');
            })
            .catch((e) => {
                console.log(e.code)
            })
    }

    const setUserState = async (id, state) => {
        const batch = store.batch();
        const ref = store.collection("usuarios").doc(id);
        batch.update(ref, { "state": state });
        await batch.commit().then(() => {
            getUsuarios()
        });
    }

    const getUsuarios = async () => {
        const { docs } = await store.collection('usuarios').get()
        const arr = docs.map(item => ({ id: item.id, ...item.data() }))
        setUsuarios(arr)
    }

    function handleChange(newValue) {
        setQrCodeScanner(newValue);
    }

    return (
        <NativeBaseProvider>
            {
                user.img !== null ?
                    (
                        <View style={styles.container}>

                            <ScrollView >
                                <View style={styles.topView}>
                                    <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center', }}>
                                        {
                                            user.img !== null
                                                ?
                                                (<Image alt="perfilUserImg"
                                                    source={{ uri: user.img }}
                                                    style={styles.image2}
                                                />)
                                                :
                                                <Spinner size="lg" />

                                        }
                                        < View justifyContent="center" alignItems="center">
                                            <Text fontSize="xl" color='#ffffff'>{user.nombre}</Text>
                                            <Text fontSize="md" color='#ffffff'>{user.email}</Text>

                                        </View>

                                    </View>
                                    <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => logout()}>
                                        <Stack direction="row" space={3} alignItems="center">
                                            <Text fontSize="md" color='#ffffff'>Cerrar Sesión</Text>
                                            <SimpleLineIcons name="logout" size={24} color="white" />
                                        </Stack>
                                    </Button>
                                </View>

                                <View style={styles.bottonView}>
                                    {
                                        user.state === "admin"
                                            ?
                                            <View >
                                                <Box m={3}>
                                                    <Accordion allowMultiple >
                                                        <Accordion.Item>
                                                            <Accordion.Summary _expanded={{ backgroundColor: '#FFCA00' }}>
                                                                Usuarios
                                                                <Accordion.Icon />
                                                            </Accordion.Summary>
                                                            <Accordion.Details>
                                                                {
                                                                    usuarios.length !== 0
                                                                        ?
                                                                        (usuarios.map(item => (
                                                                            (

                                                                                <HStack my={2} key={item.id} alignItems="center" justifyContent="space-between">
                                                                                    <Text>{item.nombre}</Text>
                                                                                    <Select
                                                                                        // color="#7dd3fc"
                                                                                        selectedValue={item.state}
                                                                                        minWidth={120}
                                                                                        placeholder={item.state === null ? "Elije un rango" : item.state}
                                                                                        onValueChange={(itemValue) => setUserState(item.id, itemValue)}
                                                                                        _selectedItem={{
                                                                                            bg: "cyan.600",
                                                                                            endIcon: <CheckIcon size={2} />,
                                                                                        }}
                                                                                    >
                                                                                        <Select.Item label="Member" value="member" />
                                                                                        <Select.Item label="Admin" value="admin" />
                                                                                    </Select>
                                                                                </HStack>
                                                                            ))))
                                                                        :
                                                                        <View></View>
                                                                }
                                                            </Accordion.Details>
                                                        </Accordion.Item>

                                                    </Accordion>
                                                </Box>

                                            </View>
                                            :
                                            <View></View>
                                    }
                                    {
                                        (user.state === "member" | user.state === "admin")
                                            ?
                                            <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => setQrCodeScanner(!qrCodeScanner)}>
                                                <Stack direction="row" space={3} alignItems="center">
                                                    <Text fontSize="md" color='#ffffff'>Escanear Código QR</Text>
                                                    <SimpleLineIcons name="logout" size={24} color="white" />
                                                </Stack>
                                            </Button>
                                            :
                                            <View></View>
                                    }
                                    {
                                        qrCodeScanner
                                            ?
                                            <Scanner props={props} userId={user.id} onChange={handleChange}></Scanner>
                                            :
                                            <View></View>
                                    }
                                    {
                                        (user.state === "member" | user.state === "admin")
                                            ?
                                            <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => goCreateQR()}>
                                                <Stack direction="row" space={3} alignItems="center">
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
                                                            <Text fontSize="md" color='#ffffff'>Crear Código QR</Text>
                                                    }
                                                </Stack>
                                            </Button>
                                            :
                                            <View></View>
                                    }

                                    <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => { props.navigation.navigate('Revision', {idExtintor: "SRhGnJDjjMMBwCgJFjK7", userId: user.id}) }}>
                                        Revisión
                                    </Button>



                                </View>
                            </ScrollView>
                        </View>
                    )
                    :
                    <View style={styles.container}>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                            <Modal.Content>
                                <Modal.Body alignItems="center">
                                    <HStack space={2} alignItems="center">
                                        <Spinner size="lg" />
                                        <Heading color="primary.500" fontSize="md" textAlign="center">
                                            Loading
                                        </Heading>
                                    </HStack>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                    </View>
            }
        </NativeBaseProvider >

    )
}

export default HomeUser

const styles = StyleSheet.create({
    upperContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    loginText: {
        fontSize: 32,
        color: "#fff"
    },
    lowerContainer: {
        flex: 2
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',

    },
    brandView: {
        backgroundColor: '#ffffff'
    },
    bottonView: {
        flex: 2,
        backgroundColor: 'white',
        bottom: 50,
    },
    topView: {
        flex: 1.5,
        backgroundColor: '#0c4a6e',
        bottom: 50,
        marginBottom: 40
        // borderBottomRightRadius: 50,
        // borderBottomLeftRadius: 50,
    },
    image2: {
        height: 120,
        width: 120,
        borderRadius: 120 / 2,
        // resizeMode: 'contain',
    }
})


