<template>
    <div class="main-container">
        <div class="left-container">
            <h1>金門Youbike地圖</h1>
            <MapComp />
        </div>

        <div class="right-container">
            <h1>即時Youbike紀錄</h1>
            <div class="table-container">
                <AvailableTableComp />
            </div>

            <div class="rent-chart-area">
                <h1>歷史紀錄</h1>
                <RentChartComp />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import MapComp from '@views/MapComp.vue';
import AvailableTableComp from '@views/AvailableTableComp.vue';
import RentChartComp from '@views/RentChartComp.vue';
import { useCityYoubikeStore } from '@base/store';

export default defineComponent({
    name: 'Main',
    components: {
        MapComp,
        AvailableTableComp,
        RentChartComp
    },
    setup() {
        const getCityYoubikeStore = useCityYoubikeStore();
        const { initCityYoubike, getCurrAvailable, getCityYoubikeHistory } = getCityYoubikeStore;
        onMounted(async () => {
            await initCityYoubike();
            await getCurrAvailable();
            await getCityYoubikeHistory();
        });

        return {};
    }
});
</script>
<style scoped lang="scss">
.main-container {
    width: 100%;
    padding: 20px;
    overflow: scroll;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .left-container {
        width: 400px;
        height: 700px;
    }

    .right-container {
        width: 50%;
        height: auto;
        display: flex;
        flex-direction: column;
        .rent-chart-area {
            width: 100%;
            height: 300px;
        }
        .table-container {
            width: 100%;
            height: 300px;
            overflow: scroll;
        }
    }
}

@media (max-width: 992px) {
    .main-container {
        width: 100%;
        padding: 20px;
        overflow: scroll;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .left-container {
            width: 800px;
            height: 400px;
        }

        .right-container {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            margin-top: 100px;
            .rent-chart-area {
                width: 100%;
                height: 600px;
            }
            .table-container {
                width: 100%;
                height: 300px;
                overflow: scroll;
            }
        }
    }
}
</style>
