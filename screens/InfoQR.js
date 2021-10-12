import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Share, Platform } from 'react-native'
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    Button,
    Icon,
    IconButton,
    HStack,
    Alert,
    Text,
    Stack,
    View,
    StatusBar,
    KeyboardAvoidingView,
    Spinner,
    Progress
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
// import { NativeBaseProvider, View, VStack, HStack, Image, Stack, Heading, IconButton, Box, Flex, Spacer, Button, Text, CheckIcon, Accordion, Select, Content, Alert, List } from 'native-base'
import QRGnereator from '../components/QRGenerator'
import ViewShot from "react-native-view-shot";
import Step1 from '../components/FormSteps/Step1';
import Step2 from '../components/FormSteps/Step2';
import Step3 from '../components/FormSteps/Step3';
import Step4 from '../components/FormSteps/Step4';
import Step5 from '../components/FormSteps/Step5';
import Step6 from '../components/FormSteps/Step6';
import FinalStep from '../components/FormSteps/FinalStep';
import FinalUpdateStep from '../components/FormSteps/FinalUpdateStep';

const InfoQR = (props) => {

    const [extintor, setExtintor] = useState(props.route.params.revision ? props.route.params.revision.extintor : ({
        foto: null,
        codigo: null,
        terminal: null,
        ubicacion: null,
        ubicacionDetallada: null,
        ubicacionExacta: null,
        tipoAgente: null,
        capacidad: null,
        capacidadMedida: null,
        fechaRecarga: null,
        fechaProximaRecarga: null,
        fechaPruebaHidrostatica: null,
        fechaProximaPruebaHidrostatica: null,
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
    }))

    useEffect(() => {
        console.log(props.route.params.revisionId)
    }, [])

    const [countStep, setCountStep] = useState(0)

    const nextStep = () => {
        setCountStep(countStep + 1)
    }
    const previousStep = () => {
        setCountStep(countStep - 1)
    }
    const setExtintorValues = (item, itemValue) => {
        const copyExtintor = extintor
        copyExtintor[item] = itemValue
        setExtintor({ ...copyExtintor })
    }

    const steps = [
        <Step1 extintor={extintor} setExtintor={setExtintor} nextStep={nextStep}></Step1>,
        <Step2 extintor={extintor} setExtintorValues={setExtintorValues} previousStep={previousStep} nextStep={nextStep}></Step2>,
        <Step3 extintor={extintor} setExtintorValues={setExtintorValues} previousStep={previousStep} nextStep={nextStep}></Step3>,
        <Step4 extintor={extintor} setExtintorValues={setExtintorValues} previousStep={previousStep} nextStep={nextStep}></Step4>,
        <Step5 extintor={extintor} setExtintorValues={setExtintorValues} previousStep={previousStep} nextStep={nextStep}></Step5>,
        <Step6 extintor={extintor} setExtintorValues={setExtintorValues} previousStep={previousStep} nextStep={nextStep}></Step6>,
        props.route.params.revisionId ?
            <FinalUpdateStep navigation={props.navigation} extintor={extintor} previousStep={previousStep} revisionId={props.route.params.revisionId} userId={props.route.params.userId}></FinalUpdateStep>
            :
            <FinalStep extintor={extintor} previousStep={previousStep} userId={props.route.params.userId}></FinalStep>
    ];

    return (
        <NativeBaseProvider>
            <View style={styles.container}>

                {/* <StatusBar backgroundColor="#3700B3" barStyle="light-content" /> */}

                {/* <Box safeAreaTop backgroundColor="#0c4a6e" /> */}

                <HStack bg='#0c4a6e' px={1} py={3} justifyContent='space-between' alignItems='center'>
                    <HStack mt={10} space={4} alignItems='center'>
                        <IconButton onPress={() => props.navigation.goBack()} icon={<Icon size="sm" as={<MaterialIcons name='arrow-back' />} color="white" />} />
                        <Text color="white" fontSize={20} fontWeight='bold'>Realizar revisión de extintor</Text>
                    </HStack>
                </HStack>
                <Progress rounded="0" size="sm" colorScheme="primary" value={(((countStep + 1) * 100) / steps.length)} />

                <Box
                    flex={1}
                    w="100%"
                >
                    <VStack space={2} mt={5}>


                        {
                            steps[countStep]
                        }
                        {/* </KeyboardAvoidingView> */}
                    </VStack>


                </Box>
                {/* </ScrollView> */}
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