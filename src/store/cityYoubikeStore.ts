import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { cityArr } from '@utils/const';
import { getStationNamesByCity, getYoubikeAvailable, getYoubikeHistory } from '@api/tdxService';
import { convertTime12to24, dateFormatter, getYesterdayDate, timeFormatMmHmSs, transJsonl2Json } from '@utils/helper';
import dayjs from 'dayjs';
import { LineChartSeries } from '@base/utils/type';
import { useLoadingStore } from './loadingStore';

export const useCityYoubikeStore = defineStore('cityYoubike', () => {
    const currCity = ref(cityArr[0]);
    const currMapCenter = ref<[number, number]>([0, 0]);
    const cityYoubikeInfo = reactive<any>({});
    const cityYoubike = ref<Array<any>>([]);
    const cityBikeHistoryChartOptions = reactive({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [] as string[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [] as any[],
            show: true
        },
        yAxis: {
            type: 'value'
        },
        series: [] as any[]
    });

    const getLoadingStore = useLoadingStore();
    const { startLoading, endLoading } = getLoadingStore;

    function changeCurrCity(city: string) {
        currCity.value = city;
    }

    async function initCityYoubike() {
        try {
            startLoading('initCityYoubike');
            cityYoubike.value = [];
            const result = await getStationNamesByCity(currCity.value);
            for (let i = 0; i < result.length; i++) {
                const uid = result[i].StationUID;
                const stationName = result[i].StationName.Zh_tw;
                const position = [result[i].StationPosition.PositionLon, result[i].StationPosition.PositionLat];
                const serverType = result[i].ServiceType;
                cityYoubikeInfo[uid] = { stationName, position, serverType };
            }
        } catch (e) {
            console.log('initCityYoubike error:', e);
        } finally {
            endLoading('initCityYoubike');
        }
    }

    async function getCurrAvailable() {
        try {
            startLoading('getCurrAvailable');
            const result = await getYoubikeAvailable(currCity.value);
            const tempData = [];
            for (let i = 0; i < result.length; i++) {
                const tempResult = result[i];
                const uid = tempResult.StationUID;
                tempData.push({
                    ...cityYoubikeInfo[uid],
                    uid: uid,
                    availableReturnBikes: tempResult.AvailableReturnBikes,
                    availableRentBikes: tempResult.AvailableRentBikes,
                    updateTime: timeFormatMmHmSs(tempResult.SrcUpdateTime)
                });
            }
            currMapCenter.value = tempData[0].position;
            cityYoubike.value = tempData;
        } catch (e) {
            console.log('getCurrAvailable error:', e);
        } finally {
            endLoading('getCurrAvailable');
        }
    }

    function changeCenter(index: number) {
        const data = JSON.parse(JSON.stringify(cityYoubike.value[index].position));
        currMapCenter.value = data;
    }

    async function getCityYoubikeHistory(date: Date = getYesterdayDate()) {
        try {
            startLoading('getCityYoubikeHistory');
            const dateParams = dateFormatter(date);

            const result = await getYoubikeHistory(currCity.value, dateParams);
            // 將資料進行時間排序處理
            const sortedHistoryData = transJsonl2Json(result)
                .map((item) => {
                    if (item) {
                        const dateTime = dayjs(item.UpdateTime).format('HH:mm:ss');
                        return {
                            StationUID: item.StationUID,
                            AvailableReturnBikes: item.AvailableReturnBikes,
                            dateTime
                        };
                    }
                })
                .filter((item) => item !== undefined)
                .sort((a, b) => {
                    const [h1, m1, s1] = convertTime12to24(a!.dateTime);
                    const [h2, m2, s2] = convertTime12to24(b!.dateTime);
                    return h1 - h2 || m1 - m2 || s1 - s2;
                });

            // 去重，並且filter掉undefined來獲取車站UID list
            const historyLegend = Array.from(
                new Set(
                    sortedHistoryData.map((item) => {
                        return item!.StationUID;
                    })
                )
            );

            // 獲取時間序列，設定為x軸
            const xAxis = sortedHistoryData.map((item) => item!.dateTime);

            // 初始化 echart的series
            const series = Array.from(historyLegend, (x) => {
                return { name: x, type: 'line', stack: 'Total', data: [] } as LineChartSeries;
            });

            // series 的 data整理
            for (let i = 0; i < xAxis.length; i++) {
                const dateTime = xAxis[i];
                const foundArr = sortedHistoryData.filter((item) => item!.dateTime == dateTime);
                foundArr.forEach((item) => {
                    const { StationUID, AvailableReturnBikes } = item!;
                    for (let j = 0; j < series.length; j++) {
                        if (series[j].name == StationUID) {
                            series[j].data.push(AvailableReturnBikes);
                        }
                    }
                });
                const currentLength = i + 1;
                for (let j = 0; j < series.length; j++) {
                    const dataLength = series[j].data.length;
                    const preData = dataLength > 1 ? series[j].data[dataLength - 1] : null;
                    if (series[j].data.length < currentLength) {
                        series[j].data.push(preData);
                    }
                }
            }
            cityBikeHistoryChartOptions.legend.data = historyLegend.map((uid) => {
                return cityYoubikeInfo[uid].stationName;
            });
            cityBikeHistoryChartOptions.xAxis.data = xAxis;
            cityBikeHistoryChartOptions.series = series.map((sery) => {
                const uid = sery.name;
                return { ...sery, name: cityYoubikeInfo[uid].stationName };
            });
        } catch (e) {
            console.log('getCityYoubikeHistory error:', e);
        } finally {
            endLoading('getCityYoubikeHistory');
        }
    }

    return {
        changeCurrCity,
        cityYoubike,
        initCityYoubike,
        getCurrAvailable,
        changeCenter,
        currMapCenter,
        getCityYoubikeHistory,
        cityBikeHistoryChartOptions
    };
});
