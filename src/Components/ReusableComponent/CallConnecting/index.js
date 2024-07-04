import { ImageBackground, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Heading from '../Heading';

export const CallConnecting = () => {
    return (
        <>
            {/* <ImageBackground
        source={require('../../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={{flex: 1}}> */}
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    backgroundColor: 'black'
                }}>
                {/* <ActivityIndicator size="large" color="#EDCC45" /> */}
                <Heading
                    Stylefont={'normal'}
                    //   Fontweight={'bold'}
                    Fontsize={18}
                    Heading={'Call Connecting...'}
                    color={'white'}
                />
            </View>
            {/* </ImageBackground> */}
        </>
    );
};