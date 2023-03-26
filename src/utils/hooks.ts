import { useLoadingStore } from '@base/store';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, Ref, ref } from 'vue';

export const useLoading = (key: string) => {
    const getLoadingStore = useLoadingStore();
    const { loading } = storeToRefs(getLoadingStore);

    return loading.value.get(key);
};

export const useResizeThottle = (ms: number, resizingFunc: Function, containerRef: Ref<HTMLElement | null>) => {
    const isResizing = ref(false);
    const resizeObserver2 = ref<ResizeObserver | null>(null);
    // const resizeObserver = new ResizeObserver(() => {
    //     if (isResizing.value) return;
    //     isResizing.value = true;
    //     setTimeout(() => {
    //         console.log('resizing~');
    //         resizingFunc();
    //         isResizing.value = false;
    //     }, ms);
    // });

    onMounted(() => {
        resizeObserver2.value = new ResizeObserver(() => {
            if (isResizing.value) return;
            isResizing.value = true;
            setTimeout(() => {
                console.log('resizing~');
                resizingFunc();
                isResizing.value = false;
            }, ms);
        });
        resizeObserver2.value.observe(containerRef.value!);
        //  resizeObserver.observe(containerRef.value!);
    });

    onUnmounted(() => {
        // resizeObserver.disconnect();
    });
};
