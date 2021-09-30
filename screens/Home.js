import { VStack, Heading, NativeBaseProvider, HStack, Button, IconButton } from 'native-base'
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import Carousel from '../components/Carousel'
import { dummyData } from '../data/Data'


const Home = (props) => {
    
    return (
        <View style={styles.container}>
            <NativeBaseProvider>
                <VStack mt={10}>
                    <HStack justifyContent="center" alignItem='center' >
                        <Image source={require('../assets/eldorado.png')} style={{
                            height: 100,
                            width: 200
                        }} resizeMode="contain"/>
                    </HStack>
                        <Carousel data={dummyData} />
                    {/* <Heading mt={10} color="#0c4a6e">El Dorado ARFFS </Heading> */}
                    <VStack space={10} mt={5} mr={3} ml={3} mb={6}>
                        <Button colorScheme="cyan" _text={{ color: 'white' }} onPress={() => props.navigation.navigate('CreateUser')}>
                            Regístrate
                        </Button>
                        <Button colorScheme="cyan" _text={{ color: 'white' }} onPress={() => props.navigation.navigate('LogIn')}>
                            Iniciar Sesión
                        </Button>
                        <HStack justifyContent="center" alignItem='center' >
                            <IconButton
                                variant='unstyled'
                                startIcon={
                                    <Image source={require('../assets/opain.png')} style={{
                                        height: 100,
                                        width: 200
                                    }} resizeMode="contain"/>
                                }
                            />
                        </HStack>
                    </VStack>
                </VStack>


            </NativeBaseProvider>


        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    carousel: {
        marginTop: 50,

    },
    brandView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


