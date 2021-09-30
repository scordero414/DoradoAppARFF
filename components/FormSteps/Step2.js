import React, { useEffect, useState } from "react";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Image, TouchableOpacity } from "react-native";
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
import DateTimePicker from '@react-native-community/datetimepicker'

function useInput(dateS) {
    const [date, setDate] = useState(dateS);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    }
    return {
        date,
        showDatepicker,
        show,
        mode,
        onChange
    }
}

const Step2 = (props) => {
    const textColor = { color: 'muted.700', fontSize: 'sm', fontWeight: 600 }

    const fechaRecarga = useInput(props.extintor.fechaRecarga !== null ? new Date(props.extintor.fechaRecarga) : new Date());
    const fechaProximaRecarga = useInput(props.extintor.fechaProximaRecarga !== null ? new Date(props.extintor.fechaProximaRecarga) : new Date());
    const fechaPruebaHidrostatica = useInput(props.extintor.fechaPruebaHidrostatica !== null ? new Date(props.extintor.fechaPruebaHidrostatica) : new Date());
    const fechaProximaPruebaHidrostatica = useInput(props.extintor.fechaProximaPruebaHidrostatica !== null ? new Date(props.extintor.fechaProximaPruebaHidrostatica) : new Date());

    const saveDates = () => {
        props.extintor.fechaRecarga = fechaRecarga.date;
        props.extintor.fechaProximaRecarga = fechaProximaRecarga.date;
        props.extintor.fechaPruebaHidrostatica = fechaPruebaHidrostatica.date;
        props.extintor.fechaProximaPruebaHidrostatica = fechaProximaPruebaHidrostatica.date;
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
                    Tipo de agente
                </FormControl.Label>
                <Select
                    selectedValue={props.extintor.tipoAgente}
                    minWidth={200}
                    placeholder="Selecciona uno..."
                    onValueChange={(itemValue) => {
                        // props.extintor.tipoAgente = itemValue
                        props.setExtintorValues("tipoAgente", itemValue)
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
                <HStack justifyContent="space-between">
                    <Input minWidth={175} value={props.extintor.capacidad} variant="outline" keyboardType="decimal-pad" onChangeText={(text) => {
                        // props.extintor.capacidad = text
                        // setExtintor({
                        //     ...extintor,
                        //     capacidad: text
                        // })
                        props.setExtintorValues("capacidad", text)
                    }} />
                    <Select
                        selectedValue={props.extintor.capacidadMedida}
                        // isDisabled={true}
                        minWidth={150}
                        placeholder="Selecciona uno..."
                        _selectedItem={{
                            bg: "cyan.600",
                            endIcon: <CheckIcon size={4} />,
                        }}
                        onValueChange={(itemValue) => {
                            // props.extintor.tipoAgente = itemValue
                            props.setExtintorValues("capacidadMedida", itemValue)
                        }}
                    >
                        <Select.Item label="Lbs" value="Lbs" />
                        <Select.Item label="G" value="G" />
                    </Select>
                </HStack>

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de recarga o mantenimiento
                </FormControl.Label>
                <Button
                    variant="outline"
                    colorScheme="light"
                    onPress={fechaRecarga.showDatepicker}
                >
                    {fechaRecarga.date.toDateString()}
                </Button>
                {fechaRecarga.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fechaRecarga.date}
                        mode={fechaRecarga.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fechaRecarga.onChange}
                    />
                )}

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de próxima recarga o mantenimiento
                </FormControl.Label>
                <Button
                    variant="outline"
                    onPress={fechaProximaRecarga.showDatepicker}
                    colorScheme="light"
                >
                    {fechaProximaRecarga.date.toDateString()}
                </Button>
                {fechaProximaRecarga.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fechaProximaRecarga.date}
                        mode={fechaProximaRecarga.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fechaProximaRecarga.onChange}
                    />
                )}

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de prueba hidrostática
                </FormControl.Label>
                <Button
                    variant="outline"
                    onPress={fechaPruebaHidrostatica.showDatepicker}
                    colorScheme="light"
                >
                    {fechaPruebaHidrostatica.date.toDateString()}
                </Button>
                {fechaPruebaHidrostatica.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fechaPruebaHidrostatica.date}
                        mode={fechaPruebaHidrostatica.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fechaPruebaHidrostatica.onChange}
                    />
                )}

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de próxima prueba hidrostatica
                </FormControl.Label>
                <Button
                    variant="outline"
                    onPress={fechaProximaPruebaHidrostatica.showDatepicker}
                    colorScheme="light"
                >
                    {fechaProximaPruebaHidrostatica.date.toDateString()}
                </Button>
                {fechaProximaPruebaHidrostatica.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fechaProximaPruebaHidrostatica.date}
                        mode={fechaProximaPruebaHidrostatica.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fechaProximaPruebaHidrostatica.onChange}
                    />
                )}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                <HStack justifyContent="space-between">
                    {/* <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={goBack()}> */}
                    <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={() => {
                        props.previousStep();
                        saveDates();
                    }}>
                        <Stack direction="row" space={3} alignItems="center">
                            <SimpleLineIcons name="arrow-left" size={24} color="white" />
                            <Text fontSize="md" color='#ffffff'>Regresar</Text>
                        </Stack>
                    </Button>
                    {/* <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }} onPress={goNext()}> */}
                    <Button mt={5} colorScheme="cyan" _text={{ color: 'white' }}
                        onPress={() => {
                            props.nextStep();
                            saveDates();
                        }}>
                        <Stack direction="row" space={3} alignItems="center">
                            <Text fontSize="md" color='#ffffff'>Continuar</Text>
                            <SimpleLineIcons name="arrow-right" size={24} color="white" />
                        </Stack>
                    </Button>
                </HStack>
            </Box>
            </ScrollView>
        </View>

    )
}

export default Step2
