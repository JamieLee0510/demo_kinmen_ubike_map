export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOEKN;
export const TDX_GRANT_TYPE = import.meta.env.VITE_TDX_GRANT_TYPE;
export const TDX_CLIENT_ID = import.meta.env.VITE_TDX_CLIENT_ID;
export const TDX_CLIENT_SECRET = import.meta.env.VITE_TDX_CLIENT_SECRET;

export const citySelectArr = [
    { name: '金門', value: 'KinmenCounty' },
    { name: '台中', value: 'Taichung' },
    { name: '新竹', value: 'Hsinchu' },
    { name: '苗栗', value: 'MiaoliCounty' },
    { name: '新北', value: 'NewTaipei' },
    { name: '屏東', value: 'PingtungCounty' },
    { name: '桃園', value: 'Taoyuan' },
    { name: '台北', value: 'Taipei' },
    { name: '高雄', value: 'Kaohsiung' },
    { name: '台南', value: 'Tainan' },
    { name: '嘉義', value: 'Chiayi' },
    { name: '新竹縣', value: 'HsinchuCounty' }
];

export const cityArr = citySelectArr.map((item) => item.value);
