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

const Step3 = (props) => {
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

    return (
        <View >
            <Box
                p={2}
                w="90%"
                mx='auto'
            >
            <FormControl.Label mt={2} _text={{ textColor }}>
                Peso total (Co2)
            </FormControl.Label>
            <HStack justifyContent="space-between">
                <Input minWidth={175} value={props.extintor.peso_total} variant="outline"  onChangeText={(text) => {
                    props.extintor.peso_total = text
                }} />
                <Select
                    selectedValue={props.extintor.capacidad_medida}
                    isDisabled={true}
                    minWidth={150}
                    placeholder="Selecciona uno..."
                >
                    <Select.Item label="Lbs" value="Lbs" />
                    <Select.Item label="G" value="G" />
                </Select>
            </HStack>



            <FormControl.Label mt={2} _text={{ textColor }}>
                Pintura
            </FormControl.Label>
            {
                showOptionsSelect("pintura")
            }



            <FormControl.Label mt={2} _text={{ textColor }}>
                Aro protector de cilindro
            </FormControl.Label>
            {
                showOptionsSelect("aro_protector_cilindro")
            }




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
                showOptionsSelect("placa_instruccion")
            }



            <FormControl.Label mt={2} _text={{ textColor }}>
                Tarjeta recarga
            </FormControl.Label>
            {
                showOptionsSelect("tarjeta_recarga")
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
        </View>
    )
}

export default Step3