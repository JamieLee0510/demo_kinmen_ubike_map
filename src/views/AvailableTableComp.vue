<template>
    <div class="counting-text">距離刷新時間剩 {{ counter }} 秒</div>
    <DataTable :headers="headers">
        <template #loading v-if="isLoading">
            <tr>
                <td :colspan="headers.length">
                    <Loading />
                </td>
            </tr>
        </template>
        <template #datatable-rows v-else>
            <tr v-for="(item, index) in cityYoubike" :key="item.uid">
                <td>{{ item.stationName }}</td>
                <td>{{ item.availableRentBikes }}</td>
                <td>{{ item.serverType }}</td>
                <td>{{ item.updateTime }}</td>
                <td @click="changeCenter(index)" class="table-clickable-item">前往地點</td>
            </tr>
        </template>
    </DataTable>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, onUnmounted } from 'vue';
import { useCityYoubikeStore } from '@base/store';
import { storeToRefs } from 'pinia';
import DataTable from '@components/DataTable.vue';
import Loading from '@components/Loading.vue';
import { useLoading } from '@utils/hooks';
import { delay } from '@base/utils/helper';

const headersDemo = ['StationName', 'BikesCapacity', 'ServiceType', 'SrcUpdateTime', '地點'];
const headers = ['站名', '剩餘可租用Youbike', '服務類型', '更新時間', '地點'];
export default defineComponent({
    components: {
        DataTable,
        Loading
    },
    setup() {
        const getCityYoubikeStore = useCityYoubikeStore();
        const timer = ref<NodeJS.Timer | null>(null);
        const counter = ref(60);
        const counterTimer = ref<NodeJS.Timer | null>(null);
        const { changeCenter, getCurrAvailable } = getCityYoubikeStore;
        const { cityYoubike } = storeToRefs(getCityYoubikeStore);
        const isLoading = useLoading('getCurrAvailable');

        onMounted(() => {
            timer.value = setInterval(async () => {
                await getCurrAvailable();
                counter.value = 60;
            }, 60000);
            counterTimer.value = setInterval(() => {
                if (counter.value > 0) {
                    counter.value--;
                }
            }, 1000);
        });

        onUnmounted(() => {
            if (timer.value) {
                clearInterval(timer.value);
            }
            if (counterTimer.value) {
                clearInterval(counterTimer.value);
            }
        });

        return { cityYoubike, changeCenter, headers, counter, isLoading };
    }
});
</script>

<style scoped>
.counting-text {
    text-align: right;
}
</style>
