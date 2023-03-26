<template>
    <div ref="mapPopup">
        <slot />
    </div>
</template>

<script lang="ts">
import mapboxgl, { Point } from 'mapbox-gl';
import { defineComponent, onMounted, PropType, ref, onUnmounted } from 'vue';

type LngLatArray = [number, number];
export default defineComponent({
    name: 'MapboxPopup',
    props: {
        offset: {
            type: Number,
            default: 25
        },
        lngLat: {
            type: Object as PropType<LngLatArray>,
            require: true
        }
    },

    setup(props) {
        const mapPopup = ref<HTMLElement | null>(null);
        const popup = ref<mapboxgl.Popup | null>(null);

        onMounted(() => {
            popup.value = new mapboxgl.Popup({ offset: props.offset }).setLngLat(props.lngLat!).setDOMContent(mapPopup.value!);
        });

        onUnmounted(() => {
            popup.value?.remove();
        });

        return { mapPopup, popup };
    }
});
</script>
