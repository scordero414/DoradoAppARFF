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

    const fecha_recarga = useInput(props.extintor.fecha_recarga !== null ? new Date(props.extintor.fecha_recarga) : new Date());
    const fecha_proxima_recarga = useInput(props.extintor.fecha_proxima_recarga !== null ? new Date(props.extintor.fecha_proxima_recarga) : new Date());
    const fecha_prueba_hidrostatica = useInput(props.extintor.fecha_prueba_hidrostatica !== null ? new Date(props.extintor.fecha_prueba_hidrostatica) : new Date());
    const fecha_proxima_prueba_hidrostatica = useInput(props.extintor.fecha_proxima_prueba_hidrostatica !== null ? new Date(props.extintor.fecha_proxima_prueba_hidrostatica) : new Date());

    const saveDates = () => {
        props.extintor.fecha_recarga = fecha_recarga.date;
        props.extintor.fecha_proxima_recarga = fecha_proxima_recarga.date;
        props.extintor.fecha_prueba_hidrostatica = fecha_prueba_hidrostatica.date;
        props.extintor.fecha_proxima_prueba_hidrostatica = fecha_proxima_prueba_hidrostatica.date;
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
                    selectedValue={props.extintor.tipo_agente}
                    minWidth={200}
                    placeholder="Selecciona uno..."
                    onValueChange={(itemValue) => {
                        // props.extintor.tipo_agente = itemValue
                        props.setExtintorValues("tipo_agente", itemValue)
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
                        props.setExtintorValues("capacidad", text)
                    }} />
                    <Select
                        selectedValue={props.extintor.capacidad_medida}
                        // isDisabled={true}
                        minWidth={150}
                        placeholder="Selecciona uno..."
                        _selectedItem={{
                            bg: "cyan.600",
                            endIcon: <CheckIcon size={4} />,
                        }}
                        onValueChange={(itemValue) => {
                            props.setExtintorValues("capacidad_medida", itemValue)
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
                    onPress={fecha_recarga.showDatepicker}
                >
                    {fecha_recarga.date.toDateString()}
                </Button>
                {fecha_recarga.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fecha_recarga.date}
                        mode={fecha_recarga.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fecha_recarga.onChange}
                    />
                )}

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de próxima recarga o mantenimiento
                </FormControl.Label>
                <Button
                    variant="outline"
                    onPress={fecha_proxima_recarga.showDatepicker}
                    colorScheme="light"
                >
                    {fecha_proxima_recarga.date.toDateString()}
                </Button>
                {fecha_proxima_recarga.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fecha_proxima_recarga.date}
                        mode={fecha_proxima_recarga.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fecha_proxima_recarga.onChange}
                    />
                )}

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de prueba hidrostática
                </FormControl.Label>
                <Button
                    variant="outline"
                    onPress={fecha_prueba_hidrostatica.showDatepicker}
                    colorScheme="light"
                >
                    {fecha_prueba_hidrostatica.date.toDateString()}
                </Button>
                {fecha_prueba_hidrostatica.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fecha_prueba_hidrostatica.date}
                        mode={fecha_prueba_hidrostatica.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fecha_prueba_hidrostatica.onChange}
                    />
                )}

                <FormControl.Label mt={2} _text={{ textColor }}>
                    Fecha de próxima prueba hidrostatica
                </FormControl.Label>
                <Button
                    variant="outline"
                    onPress={fecha_proxima_prueba_hidrostatica.showDatepicker}
                    colorScheme="light"
                >
                    {fecha_proxima_prueba_hidrostatica.date.toDateString()}
                </Button>
                {fecha_proxima_prueba_hidrostatica.show && (
                    <DateTimePicker
                        testID="dateTimePicker1"
                        value={fecha_proxima_prueba_hidrostatica.date}
                        mode={fecha_proxima_prueba_hidrostatica.mode}
                        is24Hour={true}
                        display="default"
                        onChange={fecha_proxima_prueba_hidrostatica.onChange}
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
