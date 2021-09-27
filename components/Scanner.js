import React, { Component, useState, useEffect} from 'react';
import { StyleSheet, Button, View, Dimensions, Text} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const Scanner = (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(data);
        console.log(props)
        props.props.navigation.navigate('Revision', data)
        props.onChange(false);
        // props.props.navigation.navigate('ScannedQR', data)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                    height: DEVICE_HEIGHT / 3,
                    width: DEVICE_WIDTH,
                }}
            >
                {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </BarCodeScanner>
        </View>
    );

    // }
    //   }
}

export default Scanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});