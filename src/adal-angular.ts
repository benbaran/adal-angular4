// adal-angular module to create type definition file

declare module "adal-angular" {
    export function inject(config: adal.Config): adal.AuthenticationContext;
}

// tslint:disable-next-line:no-namespace
declare namespace adal {
    // tslint:disable-next-line:interface-name
    interface AuthenticationContext {
        REQUEST_TYPE: {
            LOGIN: string,
            RENEW_TOKEN: string,
            UNKNOWN: string,
        };

        callback: any;

        _getItem: any;

        _renewFailed: any;

        CONSTANTS: any;
    }

}

// tslint:disable-next-line:interface-name
interface Window {
    AuthenticationContext: any;
    callBackMappedToRenewStates: any;
}
