import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

type LoadingMap = Map<string, boolean>;

export const useLoadingStore = defineStore('loading', () => {
    const loading = reactive<LoadingMap>(new Map<string, boolean>());

    function startLoading(key: string) {
        if (loading.has(key) && loading.get(key) == true) {
            return;
        }
        if (!loading.has(key)) {
            loading.set(key, true);
        }
        loading.set(key, true);
    }
    function endLoading(key: string) {
        loading.set(key, false);
    }
    return { loading, startLoading, endLoading };
});
