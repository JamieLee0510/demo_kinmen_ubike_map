import { useLoadingStore } from '@base/store';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, Ref, ref } from 'vue';
import { throttle } from 'echarts/core';
import { addListener, removeListener, ResizeCallback } from 'resize-detector';

export const useLoading = (key: string) => {
    const getLoadingStore = useLoadingStore();
    const { loading } = storeToRefs(getLoadingStore);

    return loading.value.get(key);
};

export const useResizeThottle = (ms: number, resizingFunc: Function, containerRef: Ref<HTMLElement | null>) => {
    const isResizing = ref(false);
    const resizeObserver2 = ref<ResizeObserver | null>(null);
    let resizeListener: ResizeCallback | null = null;
    onMounted(() => {
        resizeListener = throttle(() => {
            resizingFunc();
        }, 100);

        addListener(containerRef.value!, resizeListener);
        // resizeObserver2.value = new ResizeObserver(() => {
        //     if (isResizing.value) return;
        //     isResizing.value = true;
        //     setTimeout(() => {
        //         console.log('resizing~');
        //         resizingFunc();
        //         isResizing.value = false;
        //     }, ms);
        // });
        // resizeObserver2.value.observe(containerRef.value!);
    });

    onUnmounted(() => {
        // resizeObserver.disconnect();
        removeListener(containerRef.value!, resizeListener);
    });
};
