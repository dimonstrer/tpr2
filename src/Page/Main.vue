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
        ...mapGetters('States', ['events','mainEvent'])
    },
    methods: {
        solve(){
            let isOkay = this.check();
            if(!isOkay){
                return;
            }

            this.findCombinations(this.mainEvent);
        },

        findCombinations(node){
            if(node.childNodes.length>0){
                if(node.condition == 'OR'){
                    for(let i=0; i<node.childNodes.length; i++){
                        this.findCombinations(node.childNodes[i]);
                        node.childNodes[i].combinations.map(x=>node.combinations.push(x));
                    }
                }
                if(node.condition == 'AND'){
                    for(let i=0; i<1; i++){
                        this.findCombinations(node.childNodes[0]);
                        let combination = node.childNodes[0].combinations;
                        for(let j=1; j<node.childNodes.length; j++){
                            let currentCombination = [];
                            this.findCombinations(node.childNodes[j]);
                            node.childNodes[j].combinations.map(x => {
                                combination.map(y=> currentCombination.push([...y, ...x]));
                            });
                            combination = currentCombination;
                        }
                        node.combinations = combination;
                    }
                }
            }else{
                node.combinations.push([node.index]);
            }
        },

        check(){
            if(!this.mainEvent) {
                alert('Начальное состояние не найдено');
                return false;
            }
            let isEveryEventHasFinalEvents = this.checkNode(this.mainEvent);
            if(!isEveryEventHasFinalEvents){
                alert('Не все события имеют инициализирующие события');
                return false;
            }
            return true;
        },

        checkNode(node){
            if(node.childNodes.length==0){
                return !node.isEvent;
            }else{
                for(let j=0; j<node.childNodes.length; j++){
                    let res = this.checkNode(node.childNodes[j]);
                    if(!res){
                        return false;
                    }
                }
                return true;
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
