import Snackbar from 'react-native-snackbar';

const showSuccessMessage = (message: string) => {
    Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'green',
    });
};

export default showSuccessMessage;
