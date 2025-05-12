export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    VerifyMail: {
        email: string;
        mobile: string;
    };
    VerifyMobile: {
        mobile: string;
    };
    ResetPassword: undefined;
    Home: undefined;
    Contact: {
        contacts: any
    }
    Chat: undefined;
    GroupSummary: undefined;
}
