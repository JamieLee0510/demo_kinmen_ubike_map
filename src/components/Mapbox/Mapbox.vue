<template>
    <div ref="mapContainer" class="my-map-container">
        <div v-if="isLoading">
            <slot name="loading" />
        </div>
        <div v-else>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, PropType, computed, defineExpose, watch, watchEffect, provide } from 'vue';
import { debounce } from 'lodash';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@utils/const';

type BasicMapOptions = {
    mapStyle: string;
    center: [number, number];
    zoom: number;
};

export default defineComponent({
    name: 'Mapbox',
    props: {
        options: {
            type: Object as PropType<BasicMapOptions>,
            require: true
        }
    },
    setup(props) {
        const mapContainer = ref<HTMLElement | null>(null);
        const resizeObserver = ref<ResizeObserver | null>(null);
        const map = ref<mapboxgl.Map | null>(null);
        provide('mapbox-map', map);
        const isLoading = ref(true);
        const mapOptions = computed(() => {
            return {
                container: mapContainer.value as string | HTMLElement,
                style: props.options!.mapStyle,
                center: props.options!.center,
                zoom: props.options!.zoom
            };
        });

        // watchEffect(() => {
        //     map.value?.setCenter(props.options!.center);
        //     map.value?.setZoom(props.options!.zoom);
        // });

        onMounted(() => {
            mapboxgl.accessToken = MAPBOX_TOKEN;
            map.value = new mapboxgl.Map(mapOptions.value);
            map.value.on('load', () => {
                isLoading.value = false;
            });
            resizeObserver.value = new ResizeObserver(() => {
                debounce(() => {
                    console.log('debounce?');
                    map.value!.resize();
                }, 300);
            });
            resizeObserver.value.observe(mapContainer.value!);
        });
        onUnmounted(() => {
            map.value?.remove();
            resizeObserver.value?.disconnect();
        });

        return { mapContainer, isLoading, map };
    }
});
</script>
