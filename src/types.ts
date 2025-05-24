export type RootStackParamList = {
    Splash: undefined;
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
    Group: undefined;
    Contact: {
        contacts: any
    }
    Chat: {
        groupId: string;
    };
    SplitExpense: {
        groupId: string;
    };
    GroupSummary: undefined;
}
