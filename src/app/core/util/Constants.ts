import { environment } from "../../../environments/environment";

export class Constants {
    public static readonly apiBaseUrl = environment.API_URL;

    public static readonly LOGIN_URL = Constants.apiBaseUrl + 'v1/login';
    public static readonly URL: string = Constants.apiBaseUrl + 'services/';

    public static readonly DEVICE_OS_TYPE: number = 3;

    public static readonly OFFER_TYPE_NONE_CODE = 'NOOFFER';
    public static readonly OFFER_TYPE_PERCENTAGEDISCOUNT_CODE = 'PERCENTAGEDISCOUNT';

    public static readonly STRIPE_CALLBACK_URL = environment.STRIPE_CALLBACK_URL;
    public static readonly STRIPE_CLIENT_ID = environment.STRIPE_CLIENT_ID;
    public static readonly STRIPE_PUB_KEY = environment.STRIPE_PUB_KEY;
    public static readonly STRIPE_SECRET_KEY = environment.STRIPE_SECRET_KEY;

    public static readonly GOOGLE_MAP_API_KEY = environment.GOOGLE_MAP_API_KEY;
    public static readonly FACEBOOK_APP_ID = environment.FACEBOOK_APP_ID;
}