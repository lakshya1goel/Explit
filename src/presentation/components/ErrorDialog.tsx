import Snackbar from 'react-native-snackbar';

const showErrorMessage = (message: string) => {
    Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
    });
};

export default showErrorMessage;
