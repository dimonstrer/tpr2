<template>
    <el-container class="container">
        <el-main>
            <h3>Логико-вероятностный метод</h3>

            <el-row>
                <el-col :span="6" :offset="6">
                    <el-button v-bind:class="{ 'el-button--primary': isEvent}" @click="isEvent = true" style="width: 100%">Событие</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button v-bind:class="{ 'el-button--primary': !isEvent}" @click="isEvent = false" style="width: 100%">Инициирующее событие</el-button>
                </el-col>
            </el-row>

            <RiskForm :is-event="isEvent"></RiskForm>
            <StatesList></StatesList>
            <div class="center" style="margin-top: 8px">
                <el-button type="primary" round @click="solve" >Решить</el-button>
                <el-button type="danger" round @click="removeAll">Очистить всё</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import RiskForm from "@/components/RiskForm";
    import StatesList from "@/components/StatesList";
    import {mapGetters} from "vuex";
export default {
    components:{
        StatesList,
        RiskForm
    },
    data(){
        return {
            type: null,
            types: [ { name: 'Событие', value: 0}, { name: 'Инициализирующее событие', value: 1}],
            isEvent: true
        }
    },
    computed: {
        ...mapGetters('States', ['events'])
    },
    methods: {
        solve(){
            this.check();
        },
        check(){
            let mainEvent = this.$store.getters['Events/mainEvent'];
            if(!mainEvent) {
                alert('Начальное состояние не найдено!');
                return;
            }

        },

        removeAll(){
            this.$store.commit('States/CLEAR_STATE')
        }
    }
}
</script>

<style>
    .container {
        width: 1140px;
        margin: auto;
    }

    .center{
        text-align: center;
    }
</style>
