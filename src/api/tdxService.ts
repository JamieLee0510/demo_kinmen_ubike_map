import { TDX_CLIENT_ID, TDX_CLIENT_SECRET, TDX_GRANT_TYPE } from '@utils/const';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';

const TDX_API = 'https://tdx.transportdata.tw';

const oidcSettings = {
    authority: `${TDX_API}/auth/realms/TDXConnect/protocol/openid-connect/token`,
    grant_type: TDX_GRANT_TYPE,
    redirect_uri: `${TDX_API}/auth/realms/TDXConnect/protocol/openid-connect/token`,
    client_id: TDX_CLIENT_ID,
    client_secret: TDX_CLIENT_SECRET,
    userStore: new WebStorageStateStore({ store: window.sessionStorage })
};

const userManager = new UserManager(oidcSettings);

const apiClient = axios.create({
    baseURL: TDX_API
});
apiClient.interceptors.request.use(async (config: any) => {
    const user = await userManager.getUser();
    if (user && !user.expired) {
        config.headers['Authorization'] = `Bearer ${user.access_token}`;
    }
    return config;
});

// 響應攔截器
apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (error.response?.status === 401) {
        const user = await userManager.getUser();

        // 如果 access_token 過期，嘗試進行無聲刷新
        if (user && user.expired) {
            try {
                const newUser = await userManager.signinSilent();
                // 無聲刷新成功，重新發送原請求
                console.log('無聲刷新', newUser);
                error.config!.headers['Authorization'] = `Bearer ${newUser!.access_token}`;
                return apiClient.request(error.config!);
            } catch (e) {
                // 無聲刷新失敗，引導用戶登錄
                userManager.signinRedirect();
            }
        } else {
            // 如果 access_token 仍然有效，引導用戶登錄
            userManager.signinRedirect();
        }
    } else {
        return Promise.reject(error);
    }
});

export const getTdxData = async (path: string) => {
    const response = await apiClient.get(path);
    return response.data;
};

export const getTdxAuth = async () => {
    if (Cookies.get('TDX_Auth_Token') == undefined) {
        const parameter = {
            grant_type: TDX_GRANT_TYPE,
            client_id: TDX_CLIENT_ID,
            client_secret: TDX_CLIENT_SECRET
        };

        const auth_url = `${TDX_API}/auth/realms/TDXConnect/protocol/openid-connect/token`;

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const response = await axios.post(auth_url, parameter, config);

        const token = response.data.access_token;
        Cookies.set('TDX_Auth_Token', token, { expires: 24 * 60 * 60 * 1000 });

        return token;
    } else {
        return Cookies.get('TDX_Auth_Token');
    }
};

// 歷史資料，取前1000筆
// https://tdx.transportdata.tw/api/historical/v2/Historical/Bike/Availability/KinmenCounty?Dates=2021-06-03~2021-06-05&%24format=JSONL&%24top=1000
export const getYoubikeHistory = async (city: string, date: string) => {
    // const url = `${TDX_API}/api/historical/v2/Historical/Bike/Availability/${city}?Dates=${date}&%24format=JSONL&%24top=1000`;
    // const config = {
    //     headers: { authorization: 'Bearer ' + (await getTdxAuth()) }
    // };
    const result = await getTdxData(
        `/api/historical/v2/Historical/Bike/Availability/${city}?Dates=${date}&%24format=JSONL&%24top=1000`
    );
    return result;

    // const response = await axios.get(url, config);

    // return response.data;
};

//
export const getYoubikeAvailable = async (city: string) => {
    // const url = `${TDX_API}/api/basic/v2/Bike/Availability/City/${city}?%24top=30&%24format=JSON`;
    // const config = {
    //     headers: { authorization: 'Bearer ' + (await getTdxAuth()) }
    // };
    const result = await getTdxData(`/api/basic/v2/Bike/Availability/City/${city}?%24top=30&%24format=JSON`);
    return result;
    // const response = await axios.get(url, config);
    // return response.data;
};

export const getStationNamesByCity = async (city: string) => {
    // const url = `${TDX_API}/api/basic/v2/Bike/Station/City/${city}?%24top=30&%24format=JSON`;
    // const config = {
    //     headers: { authorization: 'Bearer ' + (await getTdxAuth()) }
    // };
    const result = await getTdxData(`/api/basic/v2/Bike/Station/City/${city}?%24top=30&%24format=JSON`);
    console.log(`getStationNamesByCity result:`, result);
    return result;
    // const response = await axios.get(url, config);
    // return response.data;
};
