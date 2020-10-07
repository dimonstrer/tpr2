<template>
    <el-table :data="events">
        <el-table-column
                label="Номер события"
                prop="index">
        </el-table-column>
        <el-table-column
                width="200"
                label="Родительское событие"
                prop="parentName">
        </el-table-column>
        <el-table-column
                label="Наименование"
                prop="name">
        </el-table-column>
        <el-table-column
                label="Вероятность"
                prop="probability">
        </el-table-column>
        <el-table-column
                label="Стоимость"
                prop="cost">
        </el-table-column>
        <el-table-column
                label="Условие">
            <template slot-scope="{row}">
                <span>{{getCondition(row.condition)}}</span>
            </template>
        </el-table-column>
        <el-table-column>
            <template slot-scope="scope">
                <el-button
                        size="mini"
                        type="danger"
                        @click="removeEvent(scope.$index)">Удалить</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        computed: {
            ...mapGetters('States', ['events'])
        },
        methods: {
            getCondition(value){
                return value == 'AND' ? 'И' : (value == 'OR' ? 'ИЛИ' : '') ;
            },
            removeEvent(index){
                this.$store.commit('States/REMOVE_EVENT', index);
            }
        }
    }
</script>
