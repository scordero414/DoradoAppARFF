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
                <Select.Item label="Malo" value="Malo" />
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
                        showOptionsSelect("tarjetaInspeccionMensual")
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
// import React, { useState } from 'react'
// import { View, Text, StyleSheet, Button, TextInput, Picker } from 'react-native'
// import DateTimePicker from '@react-native-community/datetimepicker'

// function useInput() {
//     const [date, setDate] = useState(new Date());
//     const [mode, setMode] = useState('date');
//     const [show, setShow] = useState(false);

//     const showMode = (currentMode) => {
//         setShow(true);
//         setMode(currentMode);
//     };
//     const showDatepicker = () => {
//         showMode('date');
//     };

//     const onChange = (event, selectedDate) => {
//         const currentDate = selectedDate || date
//         setShow(Platform.OS === 'ios');
//         setDate(currentDate);
//     }
//     return {
//         date,
//         showDatepicker,
//         show,
//         mode,
//         onChange
//     }
// }

// const Step6 = () => {
//     const input = useInput(new Date())
//     const input2 = useInput(new Date())
//     return (
//         <View >
//             <Button
//                 onPress={input.showDatepicker}
//                 title={input.date.toLocaleDateString()} />
//             {input.show && (
//                 <DateTimePicker
//                     testID="dateTimePicker1"
//                     value={input.date}
//                     mode={input.mode}
//                     is24Hour={true}
//                     display="default"
//                     onChange={input.onChange}
//                 />
//             )}

//             <Button
//                 onPress={input2.showDatepicker}
//                 title={input2.date.toLocaleDateString()} />
//             {input2.show && (
//                 <DateTimePicker
//                     testID="dateTimePicker2"
//                     value={input2.date}
//                     mode={input2.mode}
//                     is24Hour={true}
//                     display="default"
//                     onChange={input2.onChange}
//                 />
//             )}
//         </View>
//     )
// }
// export default Step6