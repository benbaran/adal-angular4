/// <reference types="adal" />
declare module 'adal-angular' {
    function inject(config: adal.Config): adal.AuthenticationContext;
}
declare namespace adal {
    interface AuthenticationContext {
        REQUEST_TYPE: {
            LOGIN: string;
            RENEW_TOKEN: string;
            UNKNOWN: string;
        };
        callback: any;
        _getItem: any;
        _renewFailed: any;
        CONSTANTS: any;
    }
}
interface Window {
    AuthenticationContext: any;
    callBackMappedToRenewStates: any;
}
