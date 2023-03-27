<template>
    <div ref="chartDom" class="chart-dom"></div>
</template>

<script lang="ts">
import { defineComponent, onActivated, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash';
import { useResizeThottle } from '@base/utils/hooks';
export default defineComponent({
    name: 'EChart',
    props: {
        option: {
            type: Object,
            default: () => {}
        },
        isLoading: {
            type: Boolean,
            default: () => false
        }
    },
    setup(props) {
        const chartDom = ref<HTMLElement | null>(null);
        const chart = ref<echarts.ECharts | null>(null);

        useResizeThottle(
            300,
            () => {
                console.log('chart.value?.resize();');

                chart.value!.resize();
            },
            chartDom
        );

        // const isResizing = ref(false);
        // const resizeObserver = new ResizeObserver(() => {
        //     if (isResizing.value) return;
        //     isResizing.value = true;
        //     setTimeout(() => {
        //         chart.value?.resize();
        //         isResizing.value = false;
        //     }, 300);
        // });

        watch(props.option, (newValue) => {
            chart.value!.setOption({ ...newValue });
        });
        watch(
            () => props.isLoading,
            (newValue) => {
                if (newValue) {
                    chart.value?.showLoading({
                        text: 'loading',
                        color: '#c23531',
                        textColor: '#000',
                        maskColor: 'rgba(255, 255, 255, 0.2)',
                        zlevel: 0
                    });
                } else {
                    chart.value?.hideLoading();
                }
            }
        );

        onMounted(() => {
            chart.value = echarts.init(chartDom.value!);
            chart.value.setOption({ ...props.option });
        });

        onUnmounted(() => {
            chart.value?.dispose();
        });

        return { chartDom };
    }
});
</script>

<style scoped>
.chart-dom {
    width: 100%;
    height: 100%;
}
</style>
