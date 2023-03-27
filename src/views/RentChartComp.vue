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

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted, watchEffect } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import EChart from '@components/EChart.vue';
import '@vuepic/vue-datepicker/dist/main.css';
import { useCityYoubikeStore } from '@base/store';
import { storeToRefs } from 'pinia';
import { getYesterdayDate, dateFormatter } from '@utils/helper';
import { useLoading } from '@utils/hooks';

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
        const containerRef = ref<HTMLElement | null>(null);
        const datePickerRef = ref<HTMLElement | null>(null);

        return {
            selectDate,
            cityBikeHistoryChartOptions,
            dateFormatter,
            getYesterdayDate,
            isChartLoading
        };
    }
});
</script>

<style lang="scss" scoped>
.chart-container {
    width: 600px;
    height: 400px;
    @media (max-width: 992px) {
        width: 800px;
        height: 600px;
    }
}

// .chart-container {
//     width: 600px;
//     height: 400px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
// .echart-area {
//     width: 300px;
//     height: 500px;
// }
</style>
