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
    Spinner,
    ScrollView
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
        props.extintor.observaciones = e.currentTarget.value;
    }

    return (
        <View>
            <ScrollView>
                <Box
                    p={2}
                    w="90%"
                    mx='auto'
                >
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
                        showOptionsSelect("tarjeta_inspeccion_mensual")
                    }

                    <FormControl.Label mt={2} _text={{ textColor }}>
                        Observaciones
                    </FormControl.Label>
                    <Input variant="outline" defaultValue={props.extintor.observaciones} onChangeText={(text) => {
                        props.extintor.observaciones = text
                    }} />
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
            </ScrollView>
        </View >
    )
}

export default Step5