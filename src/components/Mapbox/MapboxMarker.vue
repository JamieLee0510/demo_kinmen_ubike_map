<template>
    <div ref="mapMarker" class="map-marker">
        <!-- <slot name="popup" /> -->
    </div>
    <MapboxPopup v-if="hasPopup" ref="popupRef" :lngLat="lngLat">
        <slot name="popup" />
    </MapboxPopup>
</template>

<script lang="ts">
import mapboxgl, { Point } from 'mapbox-gl';
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, useSlots } from 'vue';
import MapboxPopup from './MapboxPopup.vue';
import { useMap } from './useMap';
type LngLatArray = [number, number];
export default defineComponent({
    name: 'MapboxMarker',
    props: {
        lngLat: {
            type: Object as PropType<LngLatArray>,
            require: true
        }
    },
    components: {
        MapboxPopup
    },
    setup(props) {
        const mapMarker = ref<HTMLElement | null>(null);
        const popupRef = ref<any>(null);
        const marker = ref<mapboxgl.Marker>();
        const slots = useSlots();
        const hasPopup = computed(() => typeof slots.popup !== 'undefined');
        const popupInstance = computed(() => (hasPopup.value ? popupRef.value : null));

        onMounted(() => {
            const { map } = useMap();
            marker.value = new mapboxgl.Marker(mapMarker.value!).setLngLat(props.lngLat!).addTo(map!.value!);
            if (hasPopup.value) {
                marker.value.setPopup(popupInstance.value.popup);
            }
        });

        onUnmounted(() => {
            marker.value?.remove();
        });

        return { mapMarker, hasPopup, popupRef };
    }
});
</script>
