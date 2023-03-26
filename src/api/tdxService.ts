import { TDX_CLIENT_ID, TDX_CLIENT_SECRET, TDX_GRANT_TYPE } from '@utils/const';
import axios from 'axios';
import Cookies from 'js-cookie';

const TDX_API = 'https://tdx.transportdata.tw';

export const getTdxAuth = async () => {
    if (Cookies.get('TDX_Auth_Token') == undefined) {
        const parameter = {
            grant_type: TDX_GRANT_TYPE,
            client_id: TDX_CLIENT_ID,
            client_secret: TDX_CLIENT_SECRET
        };
        console.log('parameter:', parameter);
        const auth_url = `${TDX_API}/auth/realms/TDXConnect/protocol/openid-connect/token`;

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
        } catch (e) {}
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
    const url = `${TDX_API}/api/historical/v2/Historical/Bike/Availability/${city}?Dates=${date}&%24format=JSONL&%24top=1000`;
    const config = {
        headers: { authorization: 'Bearer ' + (await getTdxAuth()) }
    };
    const response = await axios.get(url, config);
    return response.data;
};

//
export const getYoubikeAvailable = async (city: string) => {
    const url = `${TDX_API}/api/basic/v2/Bike/Availability/City/${city}?%24top=30&%24format=JSON`;
    const config = {
        headers: { authorization: 'Bearer ' + (await getTdxAuth()) }
    };
    const response = await axios.get(url, config);
    return response.data;
};

export const getStationNamesByCity = async (city: string) => {
    const url = `${TDX_API}/api/basic/v2/Bike/Station/City/${city}?%24top=30&%24format=JSON`;
    const config = {
        headers: { authorization: 'Bearer ' + (await getTdxAuth()) }
    };
    const response = await axios.get(url, config);
    return response.data;
};
