import React, { useState, useEffect } from 'react'
import { StyleSheet, TextInput, Picker } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons';
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
    Spinner
} from 'native-base';

const Step5 = (props) => {

    const textColor = { color: 'muted.700', fontSize: 'sm', fontWeight: 600 }

    const showOptionsSelect = (extintorProp) => {
        return (
            <Select
                selectedValue={props.extintor[extintorProp]}
                minWidth={200}
                placeholder="Selecciona uno..."
                onValueChange={(itemValue) => {
                    props.setExtintorValues(extintorProp, itemValue)
                }}
                _selectedItem={{
                    bg: "cyan.600",
                    endIcon: <CheckIcon size={4} />,
                }}
            >
                <Select.Item label="Bueno" value="Bueno" />
                <Select.Item label="Regular" value="Regular" />
                <Select.Item label="No Tiene" value="N/T" />
                <Select.Item label="No Aplica" value="N/A" />
            </Select>
        )
    }

    const demoValueControlledTextArea = (e) => {
        props.setExtintorValues("observaciones", e.currentTarget.value)
    }

    return (
        <View>
            <Box
                p={2}
                w="90%"
                mx='auto'
            >
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


                <HStack justifyContent="space-between">
                    <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={props.previousStep}>
                        <Stack direction="row" space={3} alignItems="center">
                            <SimpleLineIcons name="arrow-left" size={24} color="white" />
                            <Text fontSize="md" color='#ffffff'>Regresar</Text>
                        </Stack>
                    </Button>
                    <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }}
                        onPress={props.nextStep}>
                        <Stack direction="row" space={3} alignItems="center">
                            <Text fontSize="md" color='#ffffff'>Continuar</Text>
                            <SimpleLineIcons name="arrow-right" size={24} color="white" />
                        </Stack>
                    </Button>
                </HStack>
            </Box>
        </View >
    )
}

export default Step5
