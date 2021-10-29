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
    Radio,
    Progress,
    FlatList,
    Spinner,
    Spacer,
    Divider,
    Pressable,
    Menu, HamburgerIcon,
    Checkbox

} from 'native-base';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { store } from '../constants/keys'

const ListRevisions = (props) => {

    const [allRevisions, setAllRevisions] = useState([]);
    const [filterRevisions, setFilterRevisions] = useState([]);
    const [search, setSearch] = useState('');
    const [size, setSize] = useState(0);
    const [isForRevision, setForRevision] = useState(false);

    useEffect(() => {
        setAllRevisions([])
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
                            setAllRevisions((oldArray) => [...oldArray, appObj])
                        })
                    })
                })

            })
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = allRevisions.filter(function (item) {
                // Applying filter for the inserted text in search bar
                const itemData1 = item.extintor.codigo
                    ? item.extintor.codigo.toUpperCase()
                    : ''.toUpperCase();


                const itemData2 = item.userId.nombre
                    ? item.userId.nombre.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData1.indexOf(textData) > -1 | itemData2.indexOf(textData) > -1;
            });
            setFilterRevisions(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            if (isForRevision) {
                checkPropsInExtintors()
            } else {
                setFilterRevisions([]);
                setSearch(text);
            }

        }
    };

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
        props.navigation.navigate('Revision', { revision: revision, userId: null })
        console.log(revision)
    }

    const handleFilter = () => {
        if (!isForRevision) {
            checkPropsInExtintors()
        } else {
            setFilterRevisions([])

        }
        setForRevision(!isForRevision)
        

        // for (const revision in allRevisions) {
        //     console.log(revision)
        // 
        // }
    }

    const checkPropsInExtintors = () => {
        setFilterRevisions([])
        allRevisions.map(revision => {
            for (const property in revision.extintor) {

                if ((typeof revision.extintor[property]) === "string") {
                    // if (revision.extintor[property] == ["Regular" || "Malo" || "N/T"]) {
                    if (revision.extintor[property] == "Regular" || revision.extintor[property] == "Malo" || revision.extintor[property] == "N/T") {
                        setFilterRevisions((oldArray) => [...oldArray, revision])
                        return;
                    }
                }
            }
        })
    }

    const renderRevision = (revision) => {
        return (
            <TouchableOpacity onPress={() => goNewRevision(revision)} key={revision.id}>
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
                            fontSize="sm"
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
        )
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
                                    fontSize={14}
                                    onChangeText={(text) => searchFilterFunction(text)}
                                    value={search}
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
                        <Checkbox colorScheme="info" isChecked={isForRevision} onChange={handleFilter} accessibilityLabel="choose numbers" >
                            Filtrar por extintores pendientes.
                        </Checkbox>
                        <Divider my="2"/>
                        {/* <Heading fontSize="2xl" alignSelf="center">Revisiones</Heading> */}
                        <VStack space={2} >
                            {
                                filterRevisions.length > 0
                                    ? filterRevisions.map(revision => (
                                        renderRevision(revision)
                                    ))
                                    :
                                    <View><Text alignSelf="center">No se encontró información</Text></View>
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
