<template>
    <Mapbox :options="mapOptions" ref="mapboxRef">
        <template #loading>
            <Loading />
        </template>
        <template>
            <MapboxMarker v-for="data in cityYoubike" :key="data.uid" :lngLat="data.position">
                <template #popup>
                    <h3 class="popup-title">{{ data.stationName }}</h3>
                    <p class="popup-content">剩餘:{{ data.availableRentBikes }}</p>
                </template>
            </MapboxMarker>
        </template>
    </Mapbox>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, Ref, ref, watch } from 'vue';
import { useCityYoubikeStore } from '@base/store';
import { storeToRefs } from 'pinia';
import { Mapbox, MapboxMarker, MapboxPopup } from '@components/Mapbox';
import Loading from '@components/Loading.vue';
export default defineComponent({
    name: 'MapComp',
    components: { Mapbox, MapboxMarker, MapboxPopup, Loading },
    setup() {
        const mapboxRef = ref<any>(null);
        const getCityYoubikeStore = useCityYoubikeStore();
        const { cityYoubike, currMapCenter } = storeToRefs(getCityYoubikeStore);

        watch(
            () => currMapCenter.value,
            (newValue) => {
                mapboxRef.value.map!.setCenter(newValue);
                mapboxRef.value.map!.setZoom(15);
            }
        );

        const mapOptions = computed(() => {
            return {
                mapStyle: 'mapbox://styles/mapbox/streets-v12',
                center: currMapCenter.value,
                zoom: 15
            };
        });

        return { mapboxRef, cityYoubike, mapOptions };
    }
});
</script>
