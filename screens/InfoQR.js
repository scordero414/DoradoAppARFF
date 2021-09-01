import React, { useRef, useState } from 'react';
import { StyleSheet, ScrollView, Share, Platform } from 'react-native'
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
    View,
    StatusBar,
    Select,
    Radio,
    TextArea,
    KeyboardAvoidingView,
    Spinner
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
// import { NativeBaseProvider, View, VStack, HStack, Image, Stack, Heading, IconButton, Box, Flex, Spacer, Button, Text, CheckIcon, Accordion, Select, Content, Alert, List } from 'native-base'
import QRGnereator from '../components/QRGenerator'
import ViewShot from "react-native-view-shot";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { store, storage } from '../constants/keys'

const InfoQR = (props) => {

    // const [qrCodeScanner, setQrCodeScanner] = useState(false)
    const [createQr, setCreateQr] = useState(false)
    const viewShotRef = useRef()
    // setQrCodeScanner(!qrCodeScanner)}
    // setCreateQr(!createQr)}
    const [selectedImage, setSelectedImage] = useState(null)
    const [imgURL, setImgURL] = useState(null)
    const [error, setError] = useState(null)

    const [extintor, setExtintor] = useState({
        userId: props.route.params,
        foto: null,
        codigo: null,
        terminal: null,
        ubicacion: null,
        ubicacionDetallada: null,
        ubicacionExacta: null,
        tipoAgente: null,
        capacidad: null,
        capacidadMedida: null,
        fechaRecarga: new Date(),
        fechaProximaRecarga: new Date(),
        fechaPruebaHidrostatica: new Date(),
        fechaProximaPruebaHidrostatica: new Date(),
        pesoTotal: null,
        pintura: null,
        aroProtectorCilindro: null,
        golpes: null,
        placaInstruccion: null,
        tarjetaRecarga: null,
        etiquetaCodificacion: null,
        valvula: null,
        manijaSuperior: null,
        manijaInferior: null,
        pinSeguridad: null,
        sujetador: null,
        manometro: null,
        presionManometro: null,
        boquilla: null,
        manguera: null,
        anilloVerificacion: null,
        corneta: null,
        senalizacion: null,
        soporte: null,
        demarcacion: null,
        tarjetaInspeccionMensual: null,
        observaciones: null
    })
    const [idRefExt, setIdRefExt] = useState(null)

    // const onChangeDateFechaRecarga = (event, selectedDate) => {
    //     const currentDate = selectedDate || extintor.fechaRecarga;
    //     setExtintorValues("fechaRecarga", currentDate);
    //     console.log("1")
    // };

    // const onChangeDateProxFechaRecarga = (event, selectedDate) => {
    //     const currentDate = selectedDate || extintor.fechaProximaRecarga;
    //     setExtintorValues("fechaProximaRecarga", currentDate);
    //     console.log("2")
    // };

    // const onChangeDateProxPruebaHidrostatica = (event, selectedDate) => {
    //     const currentDate = selectedDate || extintor.fechaProximaPruebaHidrostatica;
    //     setExtintorValues("fechaProximaPruebaHidrostatica", currentDate);
    //     console.log("3")
    // };

    // const onChangeDatePruebaHidrostatica = (event, selectedDate) => {
    //     const currentDate = selectedDate || extintor.fechaPruebaHidrostatica;
    //     setExtintorValues("fechaPruebaHidrostatica", currentDate);
    //     console.log("4")
    // };

    const validate = () => {
        for (i in extintor) {
            if (extintor[i] === null) {
                setError("Debes de llenar todos los campos, revisa: " + i.charAt(0).toUpperCase() + i.slice(1))
                return false
            }
        }
        return true
    }

    const textColor = { color: 'muted.700', fontSize: 'sm', fontWeight: 600 }

    const createQrCode = () => {
        // console.log(extintor)
        console.log("Imagen: " + imgURL)
        // setExtintor({ ...extintor, foto: imgURL })
        setExtintorValues("foto", imgURL)
        console.log("Foto: " + extintor.foto)
        if (validate()) {
            store.collection("extintores").add(extintor)
                .then((docRef) => {
                    // setExtintor({ ...copyExtintor, QR:})
                    setIdRefExt(docRef.id)
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error.code);
                });
            setCreateQr(!createQr)
        }

    }

    const setExtintorValues = (item, itemValue) => {
        const copyExtintor = extintor
        copyExtintor[item] = itemValue
        setExtintor({ ...copyExtintor })
    }

    const showOptionsRadio = () => {
        return (
            <HStack space={4} alignItems="center" >
                <Radio value="Bueno" aria-label="bueno">
                    Bueno
                </Radio>
                <Radio value="Malo" aria-label="malo">
                    Malo
                </Radio>
                <Radio value="NoTiene" aria-label="No tiene">
                    N/T
                </Radio>
                <Radio value="N/A" aria-label="No aplica">
                    N/A
                </Radio>
            </HStack>
        )

    }

    const showOptionsSelect = (extintorProp) => {
        return (
            <Select
                minWidth={200}
                placeholder="Selecciona uno..."
                onValueChange={(itemValue) => {
                    setExtintorValues(extintorProp, itemValue)
                }}
                _selectedItem={{
                    bg: "cyan.600",
                    endIcon: <CheckIcon size={4} />,
                }}
            >
                <Select.Item label="Bueno" value="Bueno" />
                <Select.Item label="Malo" value="Malo" />
                <Select.Item label="No Tiene" value="N/T" />
                <Select.Item label="No Aplica" value="N/A" />
            </Select>
        )
    }


    const captureViewShot = async () => {
        const imageURI = await viewShotRef.current.capture();
        Share.share({ title: 'QRcode', url: imageURI })
        navigation.goBack()
    }

    const uploadImage = async (uri, folder) => {

        // const filename = uri.substring(uri.lastIndexOf('/') + 1)
        const filename = `${extintor.codigo}.png`
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
                setImgURL(downloadURL);
            });
        });

    };

    const openCamera = async () => {
        // console.log(props.route.params)

        const permissionResult = await ImagePicker.getCameraPermissionsAsync()
        if (permissionResult.granted === false) {
            alert('Los permisos para acceder a la cámara son requeridos.')
            return
        }

        const pickedImage = await ImagePicker.launchCameraAsync()
        if (pickedImage.cancelled)
            return

        setSelectedImage(pickedImage.uri)
        setImgURL(uploadImage(pickedImage.uri, "fotosExtintores/"))

    }

    const demoValueControlledTextArea = (e) => {
        setExtintorValues("observaciones", e.currentTarget.value)
    }

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >

                    <ScrollView>


                        <StatusBar backgroundColor="#3700B3" barStyle="light-content" />

                        <Box safeAreaTop backgroundColor="#0c4a6e" />

                        <HStack bg='#0c4a6e' px={1} py={3} justifyContent='space-between' alignItems='center'>
                            <HStack space={4} alignItems='center'>
                                <IconButton onPress={() => props.navigation.goBack()} icon={<Icon size="sm" as={<MaterialIcons name='arrow-back' />} color="white" />} />
                                <Text color="white" fontSize={20} fontWeight='bold'>Crear Extintor</Text>
                            </HStack>
                        </HStack>

                        <Box
                            flex={1}
                            p={2}
                            w="90%"
                            mx='auto'
                            mt={5}
                            mb={10}
                        >
                            <Heading color="muted.400" size="xs">
                                Ingresa todos los datos correspondientes y crea el QR.
                            </Heading>

                            <VStack space={2} mt={5}>
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
                                        <HStack justifyContent="center" alignItem='center'>
                                            {selectedImage !== null ?
                                                (<Image
                                                    source={{ uri: selectedImage }}
                                                    alt="Extintor"
                                                    size="2xl"
                                                />) :
                                                <View></View>}
                                        </HStack>

                                    </VStack>

                                    <FormControl.Label _text={{ textColor }}>
                                        Código
                                    </FormControl.Label>
                                    <Input variant="outline" onChangeText={(text) => {
                                        setExtintor({
                                            ...extintor,
                                            codigo: text
                                        })
                                    }} />
                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Terminal
                                    </FormControl.Label>
                                    <Input variant="outline" onChangeText={(text) => {
                                        setExtintor({
                                            ...extintor,
                                            terminal: text
                                        })
                                    }} />

                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Ubicación
                                    </FormControl.Label>
                                    <Input variant="outline" onChangeText={(text) => {
                                        setExtintor({
                                            ...extintor,
                                            ubicacion: text
                                        })
                                    }} />


                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Ubicación detallada
                                    </FormControl.Label>
                                    <Input variant="outline" onChangeText={(text) => {
                                        setExtintor({
                                            ...extintor,
                                            ubicacionDetallada: text
                                        })
                                    }} />


                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Ubicación exacta
                                    </FormControl.Label>
                                    <Input variant="outline" onChangeText={(text) => {
                                        setExtintor({
                                            ...extintor,
                                            ubicacionExacta: text
                                        })
                                    }} />


                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Tipo de agente
                                    </FormControl.Label>
                                    <Select
                                        // selectedValue={tipoAgente}
                                        minWidth={200}
                                        placeholder="Selecciona uno..."
                                        onValueChange={(itemValue) => {
                                            setExtintorValues("tipoAgente", itemValue)
                                        }}
                                        _selectedItem={{
                                            bg: "cyan.600",
                                            endIcon: <CheckIcon size={4} />,
                                        }}
                                    >
                                        <Select.Item label="CO2" value="CO2" />
                                        <Select.Item label="ABC" value="ABC" />
                                        <Select.Item label="AL" value="AL" />
                                        <Select.Item label="BCL" value="BCL" />
                                        <Select.Item label="ABC L" value="ABC L" />
                                        <Select.Item label="BC" value="BC" />
                                        <Select.Item label="ES" value="ES" />
                                    </Select>

                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Capacidad
                                    </FormControl.Label>
                                    <HStack>
                                        <Input minWidth={175} variant="outline" keyboardType="decimal-pad" onChangeText={(text) => {
                                            setExtintor({
                                                ...extintor,
                                                capacidad: text
                                            })
                                        }} />
                                        <Select
                                            // selectedValue={tipoAgente}
                                            minWidth={150}
                                            placeholder="Selecciona uno..."
                                            onValueChange={(itemValue) => {
                                                setExtintor({
                                                    ...extintor,
                                                    capacidadMedida: itemValue
                                                })
                                            }}
                                            _selectedItem={{
                                                bg: "cyan.600",
                                                endIcon: <CheckIcon size={4} />,
                                            }}
                                        >
                                            <Select.Item label="Lbs" value="Lbs" />
                                            <Select.Item label="G" value="G" />
                                        </Select>
                                    </HStack>


                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Fecha de recarga o mantenimiento
                                    </FormControl.Label>
                                    <View style={{ justifyContent: "center" }}>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={extintor.fechaRecarga}
                                            is24Hour={true}
                                            display="default"
                                            // onChange={onChangeDateFechaRecarga}
                                        />
                                        {/* <DateTimePicker
                                            value={extintor.fechaRecarga}
                                            display="default"
                                            onChange={(dateSelected) => {
                                                setExtintor({
                                                    ...extintor,
                                                    fechaRecarga: dateSelected
                                                })
                                            }}
                                            style={styles.dates}
                                        /> */}
                                    </View>



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Fecha de próxima recarga o mantenimiento
                                    </FormControl.Label>
                                    <View style={{ justifyContent: "center" }}>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={extintor.fechaProximaRecarga}
                                            is24Hour={true}
                                            display="default"
                                            // onChange={onChangeDateProxFechaRecarga}
                                        />
                                        {/* <DateTimePicker
                                            value={extintor.fechaProximaRecarga}
                                            display="default"
                                            onChange={(date) => {
                                                setExtintor({
                                                    ...extintor,
                                                    fechaProximaRecarga: date
                                                })
                                            }}
                                            style={styles.dates}
                                        /> */}
                                    </View>




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Fecha de prueba hidrostática
                                    </FormControl.Label>
                                    <View style={{ justifyContent: "center" }}>
                                        {/* <DateTimePicker
                                            value={extintor.fechaPruebaHidrostatica}
                                            display="default"
                                            onChange={(date) => {
                                                setExtintor({
                                                    ...extintor,
                                                    fechaPruebaHidrostatica: date
                                                })
                                            }}
                                            style={styles.dates}
                                        /> */}
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={extintor.fechaPruebaHidrostatica}
                                            is24Hour={true}
                                            display="default"
                                            // onChange={onChangeDatePruebaHidrostatica}
                                        />
                                    </View>




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Fecha de próxima prueba hidrostatica
                                    </FormControl.Label>
                                    <View style={{ justifyContent: "center" }}>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={extintor.fechaProximaPruebaHidrostatica}
                                            is24Hour={true}
                                            display="default"
                                            // onChange={onChangeDateProxPruebaHidrostatica}
                                        />
                                        {/* <DateTimePicker
                                            value={extintor.fechaProximaPruebaHidrostatica}
                                            display="default"
                                            onChange={(date) => {
                                                setExtintor({
                                                    ...extintor,
                                                    fechaProximaPruebaHidrostatica: date
                                                })
                                            }}
                                            style={styles.dates}
                                        /> */}
                                    </View>




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Peso total (Co2)
                                    </FormControl.Label>
                                    <HStack>
                                        <Input minWidth={175} variant="outline" keyboardType="decimal-pad" onChangeText={(text) => {
                                            setExtintor({
                                                ...extintor,
                                                pesoTotal: text
                                            })
                                        }} />
                                        <Select
                                            // selectedValue={tipoAgente}
                                            minWidth={150}
                                            placeholder="Selecciona uno..."
                                            onValueChange={(itemValue) => {
                                                setExtintor({
                                                    ...extintor,
                                                    capacidadMedida: itemValue
                                                })
                                            }}
                                            _selectedItem={{
                                                bg: "cyan.600",
                                                endIcon: <CheckIcon size={4} />,
                                            }}
                                        >
                                            <Select.Item label="Lbs" value="Lbs" />
                                            <Select.Item label="G" value="G" />
                                        </Select>
                                    </HStack>



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Pintura
                                    </FormControl.Label>
                                    <Radio.Group
                                        name="pintura"
                                        accessibilityLabel="Pick your favorite number"
                                        // onChange={setExtintorPintura}
                                        onChange={(nextValue) => {
                                            setExtintorValues("pintura", nextValue)
                                        }}
                                    >
                                        {
                                            showOptionsRadio()
                                        }

                                    </Radio.Group>



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Aro protector de cilindro
                                    </FormControl.Label>
                                    <Radio.Group
                                        name="aroProtectorCilindro"
                                        accessibilityLabel="Pick your favorite number"
                                        onChange={(nextValue) => {
                                            setExtintorValues("aroProtectorCilindro", nextValue)
                                        }}
                                    // onChange={(nextValue) => {
                                    //     setExtintor({
                                    //         ...extintor,
                                    //         aroProtectorCilindro: nextValue
                                    //     })
                                    // }}
                                    >
                                        {
                                            showOptionsRadio()
                                        }

                                    </Radio.Group>



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Golpes
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("golpes")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Placa de instrucción
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("placaInstruccion")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Tarjeta recarga
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("tarjetaRecarga")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Etiqueta de codificación
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("etiquetaCodificacion")
                                    }




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Válvula
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("valvula")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Manija superior
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("manijaSuperior")
                                    }




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Manija inferior
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("manijaInferior")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Pin de seguridad
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("pinSeguridad")
                                    }




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Sujetador o amarre
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("sujetador")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Manómetro
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("manometro")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Presión manómetro
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("presionManometro")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Boquilla
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("boquilla")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Manguera
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("manguera")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Anillo de verificación
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("anilloVerificacion")
                                    }




                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Corneta (Co2)
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("corneta")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Señalización
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("senalizacion")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Soporte o base
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("soporte")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Demarcación
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("demarcacion")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Tarjeta de inspección mensual
                                    </FormControl.Label>
                                    {
                                        showOptionsSelect("tarjetaInspeccionMensual")
                                    }



                                    <FormControl.Label mt={2} _text={{ textColor }}>
                                        Observaciones
                                    </FormControl.Label>
                                    <TextArea onChange={demoValueControlledTextArea} />

                                    <VStack space={2} mt={5}>
                                        {/* {error !== null ?
                                    <Alert status="error" w="100%">
                                        <Alert.Icon />
                                        <Alert.Title
                                            flexShrink={1}
                                        >{error}</Alert.Title>
                                    </Alert> :
                                    <View></View>
                                } */}
                                    </VStack>
                                </FormControl>
                                {error !== null ?
                                    <Alert status="error" w="100%">
                                        <Alert.Icon />
                                        <Alert.Title
                                            flexShrink={1}
                                        >{error}</Alert.Title>
                                    </Alert> :
                                    <View></View>
                                }
                            </VStack>
                            <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => createQrCode()}>
                                <Stack direction="row" space={3} alignItems="center">
                                    <Text fontSize="md" color='#ffffff'>Crear Código QR</Text>
                                </Stack>
                            </Button>
                            {
                                createQr
                                    ?
                                    (

                                        <View justifyContent='center' alignItems='center'>
                                            <Heading color="muted.400" size="xs" mt={5}>
                                                Guarda el código QR.
                                            </Heading>
                                            <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: 'png', quality: 1.0 }}>
                                                {
                                                    idRefExt !== null
                                                        ?
                                                        <QRGnereator props={idRefExt}></QRGnereator>
                                                        :
                                                        <Spinner size="lg" />
                                                }

                                            </ViewShot>
                                            <Button mt={2} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => captureViewShot()}>
                                                <Stack direction="row" space={3} alignItems="center">
                                                    <Text fontSize="md" color='#ffffff'>Guardar</Text>
                                                </Stack>
                                            </Button>
                                        </View>
                                    )
                                    :
                                    <View></View>
                            }


                        </Box>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </NativeBaseProvider >
    )
}

export default InfoQR


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    dates: {
        borderWidth: 1,
        borderColor: "#e7e5e4",
        borderRadius: 5,
        height: 45
    }
})