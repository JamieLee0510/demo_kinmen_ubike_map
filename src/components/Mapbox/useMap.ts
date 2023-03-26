import { inject, Ref } from 'vue';
import mapboxgl from 'mapbox-gl';

export function useMap() {
    const map = inject<Ref<mapboxgl.Map>>('mapbox-map');
    return {
        map
    };
}
