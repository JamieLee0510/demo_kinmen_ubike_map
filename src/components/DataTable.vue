<template>
    <table id="my-data-table">
        <tr>
            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
        <slot name="datatable-rows" />
        <slot name="loading" />
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
export default defineComponent({
    props: {
        headers: Array as PropType<Array<string>>
    }
});
</script>
