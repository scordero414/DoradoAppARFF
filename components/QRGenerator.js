import * as React from 'react';

/*
 * See https://github.com/eddyoc/react-native-custom-qr-codes-expo
 *
 * This library does not work on Expo Web but does work on iOS and Android.
 * The linearGradient option doesn't seem to work.
 */
import { QRCode as CustomQRCode } from 'react-native-custom-qr-codes-expo';

export default function CustomQRCodes(props) {
  return (
    <>
      <CustomQRCode
        codeStyle='square'
        linearGradient={['blue', 'yellow']}
        content={props.props}
      />
    </>
  );
}
