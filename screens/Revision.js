import React, { useState, useEffect } from 'react'
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
    Spinner,
    View,
    Text,
    Image,
    Badge,
    Center,
    Avatar,
    ScrollView,
    Modal
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { store } from '../constants/keys'


const Revision = (props) => {


    const [showModal, setShowModal] = useState(false)
    const [revision, setRevision] = useState(props.route.params.revision ? props.route.params.revision : {
        userId: null,
        ultima_modificacion: null,
        extintor: null
    });
    const [revisionIds, setRevisionIds] = useState(null);


    useEffect(() => {
        setShowModal(true)

        if (revision.userId == null) {
            getRevisionById(props.route.params.idExtintor);
        }
        if (revision.extintor !== null) {
            if ((revision.extintor.fechaRecarga.seconds !== undefined)) {
                revision.extintor.fechaProximaRecarga = revision.extintor.fechaProximaRecarga.toDate();
                revision.extintor.fechaRecarga = revision.extintor.fechaRecarga.toDate();
                revision.extintor.fechaPruebaHidrostatica = revision.extintor.fechaPruebaHidrostatica.toDate();
                revision.extintor.fechaProximaPruebaHidrostatica = revision.extintor.fechaProximaPruebaHidrostatica.toDate();
                setRevision({ ...revision })
            }
        }
    }, [revision])

    const knowEstatus = () => {
        let arr = [];
        for (const property in revision.extintor) {
            if ((typeof revision.extintor[property]) === "string") {
                // if (revision.extintor[property] == ["Regular" || "Malo" || "N/T"]) {
                if (revision.extintor[property] == "Regular" || revision.extintor[property] == "Malo" || revision.extintor[property] == "N/T") {
                    arr.push(`${property}: ${revision.extintor[property]}`);
                }
            }

        }
        return arr;
    }

    const getRevisionById = async (id) => {
        if (id === null)
            return

        const dbRef = store.collection("revision_extintores").doc(id)
        const doc = await dbRef.get()
        const revision_db = doc.data()

        const user = store.collection("usuarios").doc(revision_db.userId)
        const doc_user = await user.get()
        const user_db = doc_user.data()

        const extintor = store.collection("extintores").doc(revision_db.extintor)
        const doc_extintor = await extintor.get()
        const extintor_db = doc_extintor.data()


        setRevisionIds(id)

        setRevision({ ...revision, extintor: extintor_db, userId: user_db, ultima_modificacion: revision_db.ultima_modificacion })

        setShowModal(false)
    }

    const dateFormat = (date) => {
        return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear()
    }

    const goNewRevision = () => {
        props.navigation.navigate('InfoQR', { revision: revision, revisionId: revisionIds, userId: props.route.params.userId })
    }

    return (
        <NativeBaseProvider>
            {
                revision.userId !== null ?
                    (

                        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                            <HStack bg='#0c4a6e' px={1} py={3} justifyContent='space-between' alignItems='center'>
                                <HStack mt={10} space={4} alignItems='center'>
                                    <IconButton onPress={() => props.navigation.goBack()} icon={<Icon size="sm" as={<MaterialIcons name='arrow-back' />} color="white" />} />
                                    <Text color="white" fontSize={20} fontWeight='bold'>Revision realizada</Text>
                                </HStack>
                            </HStack>
                            <ScrollView>
                                <Box
                                    p={2}
                                    w="95%"
                                    mx='auto'
                                >
                                    {
                                        revision.userId !== null
                                            ?
                                            <HStack shadow={8} bg="blueGray.50" rounded={10} mt={3} justifyContent="center">

                                                {
                                                    revision.userId && <Image
                                                        m={4}
                                                        size={130}
                                                        alt="userIdImg"
                                                        borderRadius={100}
                                                        source={{
                                                            uri: revision.userId.img,
                                                        }} />
                                                }
                                                <VStack flex={1} alignItems="center" space={3}>
                                                    <Heading mt={6} ml={2} size="xs" fontSize={23} bold textAlign="center">
                                                        {revision.userId.nombre}
                                                    </Heading>
                                                    <Text textAlign="center">{"Fecha revisión: " + dateFormat(revision.ultima_modificacion.toDate())}</Text>
                                                </VStack>
                                            </HStack>
                                            :
                                            <View></View>
                                    }
                                    {
                                        revision.extintor !== null
                                            ?
                                            <VStack mt={5} shadow={8} bg="blueGray.100" rounded={10} mb={5}>
                                                <HStack alignItems="center" justifyContent="center">
                                                    <Heading mt={3} size="xs" fontSize={23} bold textAlign="center">
                                                        {"Extintor " + revision.extintor.codigo }
                                                    </Heading>
                                                    <Badge ml={2} mt={4} p={1} rounded={8} colorScheme="info" variant="subtle">{revision.extintor.tipoAgente}</Badge>
                                                </HStack>




                                                {
                                                    revision.extintor && <Image
                                                        alignSelf="center"
                                                        m={4}
                                                        size={200}
                                                        alt="exrevision.extintorImg"
                                                        borderRadius={20}
                                                        source={{
                                                            uri: revision.extintor.foto,
                                                        }} />
                                                }
                                                <View ml={5} mr={5} mb={5}>
                                                    <Heading size="xs" fontSize={18} bold >
                                                        Ubicación:
                                                    </Heading>
                                                    <Text >{`${revision.extintor.terminal}, ${revision.extintor.ubicacion}, ${revision.extintor.ubicacionDetallada}, ${revision.extintor.ubicacionExacta}`}</Text>

                                                    <Divider my={3} bg="primary.900" thickness="2" />

                                                    <Heading size="xs" fontSize={18} bold >
                                                        Fechas importantes:
                                                    </Heading>
                                                    {
                                                        (revision.extintor.fechaRecarga.seconds === undefined)
                                                            ?
                                                            <View>
                                                                <HStack my={2} justifyContent="space-between">
                                                                    <Text fontSize={"sm"} >
                                                                        Recarga o mantenimiento:
                                                                    </Text>
                                                                    <Badge colorScheme="success">{dateFormat(revision.extintor.fechaRecarga)}</Badge>
                                                                </HStack>
                                                                <HStack my={2} justifyContent="space-between">
                                                                    <Text fontSize={"sm"} >
                                                                        Próxima recarga o mantenimiento:
                                                                    </Text>
                                                                    <Badge colorScheme="yellow">{dateFormat(revision.extintor.fechaProximaRecarga)}</Badge>
                                                                </HStack>
                                                                <HStack my={2} justifyContent="space-between">
                                                                    <Text fontSize={"sm"} >
                                                                        Prueba hidrostática:
                                                                    </Text>
                                                                    <Badge colorScheme="success">{dateFormat(revision.extintor.fechaPruebaHidrostatica)}</Badge>
                                                                </HStack>
                                                                <HStack my={2} justifyContent="space-between">
                                                                    <Text fontSize={"sm"} >
                                                                        Próxima prueba hidrostática:
                                                                    </Text>
                                                                    <Badge colorScheme="yellow">{dateFormat(revision.extintor.fechaProximaPruebaHidrostatica)}</Badge>
                                                                </HStack>
                                                            </View>
                                                            :
                                                            <View></View>
                                                    }


                                                    <Divider my={3} bg="primary.900" thickness="2" />

                                                    <Heading size="xs" fontSize={18} bold >
                                                        Revisar:
                                                    </Heading>
                                                    <VStack >

                                                        {
                                                            knowEstatus().map(item => {
                                                                return (
                                                                    <Text key={item}>-{item}</Text>
                                                                );
                                                            })
                                                        }
                                                    </VStack>

                                                    <Divider my={3} bg="primary.900" thickness="2" />

                                                    <Heading size="xs" fontSize={18} bold >
                                                        Observaciones:
                                                    </Heading>
                                                    <Text fontSize={"sm"}>{revision.extintor.observaciones}</Text>
                                                </View>

                                            </VStack>
                                            :
                                            <View></View>
                                    }
                                    {
                                        props.route.params.userId !== null &&
                                        <Button mb={4} colorScheme="cyan" _text={{ color: 'white' }} onPress={goNewRevision}>
                                            <HStack direction="row" space={3} alignItems="center">
                                                <Text fontSize="md" color='#ffffff'>Realizar nueva revisión</Text>
                                                <MaterialIcons name='edit' size={24} color="white" />
                                            </HStack>
                                        </Button>
                                    }


                                </Box>

                            </ScrollView>
                        </View>
                    )
                    :
                    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
        </NativeBaseProvider>

    )
}

export default Revision
