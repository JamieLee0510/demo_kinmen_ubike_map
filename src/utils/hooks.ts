import { useLoadingStore } from '@base/store';
import { storeToRefs } from 'pinia';

export const useLoading = (key: string) => {
    const getLoadingStore = useLoadingStore();
    const { loading } = storeToRefs(getLoadingStore);

    return loading.value.get(key);
};
