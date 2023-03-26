<template>
    <div ref="chartDom" class="chart-dom"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash';
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
        const resizeObserver = ref<ResizeObserver | null>(null);
        const chart = ref<echarts.ECharts | null>(null);

        watch(props.option, (newValue) => {
            chart.value!.setOption(newValue);
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

            chart.value.setOption(props.option);

            resizeObserver.value = new ResizeObserver(() => {
                debounce(() => {
                    chart.value!.resize();
                }, 300);
            });
            resizeObserver.value.observe(chartDom.value!);
        });

        onUnmounted(() => {
            resizeObserver.value!.disconnect();
            chart.value!.dispose();
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
