<template>
    <div>
        <Datepicker
            v-model="selectDate"
            :min-date="new Date('2021-06-01')"
            :max-date="getYesterdayDate()"
            :format="dateFormatter"
        />
        <div class="chart-container">
            <EChart :option="cityBikeHistoryChartOptions" :isLoading="isChartLoading" />
        </div>
    </div>
</template>

<script leng="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import EChart from '@components/EChart.vue';
import '@vuepic/vue-datepicker/dist/main.css';
import { initMockSeries, mockHistoryLegend, mockXAxis } from '@utils/mockData';
import { useCityYoubikeStore } from '@base/store';
import { storeToRefs } from 'pinia';
import { getYesterdayDate, dateFormatter } from '@utils/helper';
import { useLoading } from '@utils/hooks';
const demoEchartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: mockHistoryLegend
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
        data: mockXAxis,
        show: true
    },
    yAxis: {
        type: 'value'
    },
    series: initMockSeries()
};
// const format = (date) => {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     const changeMonth = month.toString().split('').length <= 1 ? `0${month}` : month;
//     const changeDay = day.toString().split('').length <= 1 ? `0${day}` : day;
//     return `${year}-${changeMonth}-${changeDay}`;
// };

export default defineComponent({
    components: {
        Datepicker,
        EChart
    },
    setup() {
        const selectDate = ref(getYesterdayDate());
        const getCityYoubikeStore = useCityYoubikeStore();
        const { cityBikeHistoryChartOptions } = storeToRefs(getCityYoubikeStore);
        const { getCityYoubikeHistory } = getCityYoubikeStore;
        const isChartLoading = computed(() => useLoading('getCityYoubikeHistory'));
        watch(selectDate, (newValue) => {
            getCityYoubikeHistory(newValue);
        });

        return { selectDate, demoEchartOption, cityBikeHistoryChartOptions, dateFormatter, getYesterdayDate, isChartLoading };
    }
});
</script>

<style lang="scss" scoped>
.chart-container {
    width: 600px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
