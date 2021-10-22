import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Share, Platform, TouchableOpacity } from 'react-native'
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    Button,
    Input,
    Icon,
    IconButton,
    HStack,
    Text,
    View,
    Progress,
    FlatList,
    Spinner,
    Spacer, 
    Divider, 

} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { store } from '../constants/keys'

const ListRevisions = (props) => {

    const [revisiones, setRevisiones] = useState([]);


    useEffect(() => {
        setRevisiones([])
        getRevisions()
    }, [])


    const getRevisions = () => {
        store.collection('revision_extintores').get()
            .then(snapshot => {
                snapshot.docs.map(revision => {
                    let currentID = revision.id
                    getExtintorById(revision.data().extintor).then(ext => {
                        // ext = { ...ext, ["id"]: ext.id };
                        getUserById(revision.data().userId).then(user => {
                            // user = { ...user, ["id"]: user.id };
                            let appObj = { ...revision.data(), ['id']: currentID, userId: user, extintor: ext }
                            setRevisiones((oldArray) => [...oldArray, appObj])
                        })
                    })
                })
            })
    }

    const getExtintorById = async (id) => {
        const snapshot = await store.collection('extintores').doc(id).get()
        return snapshot.data();
    }
    const getUserById = async (id) => {
        const snapshot = await store.collection('usuarios').doc(id).get()
        return snapshot.data();
    }
    const dateFormat = (date) => {
        return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear()
    }

    const goNewRevision = (revision) => {        
        props.navigation.navigate('Revision', {revision: revision, userId: null})
        console.log(revision)
    }

    return (
        <NativeBaseProvider>
            <View style={styles.container}>

                <HStack bg='#0c4a6e' px={1} py={3} justifyContent='space-between' alignItems='center'>
                    <HStack mt={10} space={4} alignItems='center'>
                        <IconButton onPress={() => props.navigation.goBack()} icon={<Icon size="sm" as={<MaterialIcons name='arrow-back' />} color="white" />} />
                        <Text color="white" fontSize={20} fontWeight='bold'>Revisiones realizadas</Text>
                    </HStack>
                </HStack>

                <Box flex={1} w="100%">

                    <ScrollView>

                        <VStack mx={3} my={3}>
                            <VStack width="100%" space={5} alignItems="center">
                                <Input
                                    placeholder="Busca revisiones por su código"
                                    bg="#fff"
                                    width="100%"
                                    borderRadius={4}
                                    py="3"
                                    px="1"
                                    fontSize="14"
                                    _web={{
                                        _focus: { borderColor: 'muted.300', style: { boxShadow: 'none' } },
                                    }}
                                    InputLeftElement={
                                        <Icon
                                            m="2"
                                            ml="3"
                                            size="6"
                                            color="gray.400"
                                            as={<MaterialIcons name="search" />}
                                        />
                                    }
                                />
                            </VStack>
                        </VStack>

                        <Heading fontSize="2xl" alignSelf="center">Revisiones</Heading>
                        <VStack space={2} >
                            {
                                revisiones.length > 0 && revisiones.map(revision => (
                                    <TouchableOpacity onPress={()  => goNewRevision(revision)} key={revision.id}>
                                    <Box
                                        borderBottomWidth={2}
                                        _dark={{
                                            borderColor: "gray.600",
                                        }}
                                        borderColor="coolGray.200"
                                        pl="4"
                                        pr="5"
                                        py="2"
                                    >
                                        <HStack space={3} justifyContent="space-between" >
                                            <VStack>
                                                <Text
                                                    _dark={{
                                                        color: "warmGray.50",
                                                    }}
                                                    color="coolGray.800"
                                                    bold
                                                >

                                                    {revision.extintor?.codigo}

                                                </Text>

                                                <Text
                                                    color="coolGray.600"
                                                    _dark={{
                                                        color: "warmGray.200",
                                                    }}
                                                >
                                                    {revision.userId?.nombre}
                                                </Text>
                                            </VStack>
                                            <Spacer />
                                            <Text
                                                fontSize="xs"
                                                _dark={{
                                                    color: "warmGray.50",
                                                }}
                                                color="coolGray.800"
                                                alignSelf="center"
                                            >
                                                {dateFormat(revision?.ultima_modificacion.toDate())}
                                            </Text>
                                        </HStack>
                                    </Box>
                                    </TouchableOpacity>
                                ))
                            }
                        </VStack>

                    </ScrollView>
                </Box>
            </View>
        </NativeBaseProvider >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    }
})
export default ListRevisions
