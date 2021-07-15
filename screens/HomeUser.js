import { NativeBaseProvider, View, VStack, HStack, Image, Stack, Heading, IconButton, Box, Flex, Spacer, Button, Text, CheckIcon, Accordion, Select, Content, Alert, List } from 'native-base'
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { auth, store } from '../constants/keys'
import { SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeUser = (props) => {

    const [user, setUser] = useState({
        id: '',
        nombre: '',
        email: '',
        img: null,
        state: null
    })

    const [usuarios, setUsuarios] = useState([])

    const getUserById = async (id) => {
        const dbRef = store.collection("usuarios").doc(id)
        const doc = await dbRef.get()
        const user = doc.data()
        setUser({
            ...user,
            id: doc.id,
        })

    }

    useEffect(() => {
        getUserById(props.route.params)
        getUsuarios()
        // console.log(usuarios)
    }, [])

    const logout = () => {
        auth.signOut().
            then(res => {
                alert("Sesión Cerrada")
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

    return (
        <NativeBaseProvider>

            <View style={styles.container}>
                <ScrollView >
                    <View style={styles.topView}>
                        <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center', }}>
                            {
                                user.img !== null ?
                                    (<Image alt="perfilUserImg"
                                        source={{ uri: user.img }}
                                        style={styles.image2}
                                    />) :
                                    <View></View>
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
                                        <Accordion allowMultiple>
                                            <Accordion.Item>
                                                <Accordion.Summary _expanded={{ backgroundColor: '#FFCA00' }}>
                                                    Usuarios
                                                    <Accordion.Icon />
                                                </Accordion.Summary>
                                                <Accordion.Details>
                                                    <List space={2} my={2}>
                                                        {
                                                            usuarios.length !== 0
                                                                ?
                                                                (usuarios.map(item => (
                                                                    (
                                                                        <List.Item key={item.id}>
                                                                            <Box flexDirection="row" justifyContent="space-between" >
                                                                                {item.nombre}
                                                                                <Select
                                                                                    // color="#7dd3fc"
                                                                                    selectedValue={item.state}
                                                                                    minWidth={170}
                                                                                    accessibilityLabel="Select your favorite programming language"
                                                                                    placeholder={item.state === null ? "Elije un rango" : item.state}
                                                                                    onValueChange={(itemValue) => setUserState(item.id, itemValue)}
                                                                                    _selectedItem={{
                                                                                        bg: "cyan.600",
                                                                                        endIcon: <CheckIcon size={2} />,
                                                                                    }}
                                                                                >
                                                                                    <Select.Item label="Miembro" value="member" />
                                                                                    <Select.Item label="Administrador" value="admin" />
                                                                                </Select>
                                                                            </Box>
                                                                        </List.Item>
                                                                    )
                                                                )))
                                                                :
                                                                (
                                                                    <List.Item>
                                                                        No hay usuarios.
                                                                    </List.Item>
                                                                )
                                                        }
                                                    </List>
                                                </Accordion.Details>
                                            </Accordion.Item>

                                        </Accordion>
                                    </Box>

                                </View>
                                :
                                <View></View>
                        }



                    </View>
                </ScrollView>
            </View>

        </NativeBaseProvider >

    )
}

export default HomeUser

const styles = StyleSheet.create({
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


