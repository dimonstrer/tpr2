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
                <el-col :span="3">
                    <el-button type="info" @click="load" width="100%">Загрузить</el-button>
                    <input type="file" hidden ref="file" @change="loadData"/>
                </el-col>
            </el-row>

            <RiskForm :is-event="isEvent"></RiskForm>
            <StatesList></StatesList>
            <div class="center" style="margin-top: 8px">
                <el-button type="primary" round @click="solve" >Решить</el-button>
                <el-button type="danger" round @click="removeAll">Очистить всё</el-button>
            </div>
            <div v-if="isSolved">
                <p>Функция алгебры логики:</p>
                <p>{{fal}}</p>
                <p>Вероятностная функция:</p>
                <p>{{probFunction}}</p>
                <div>
                    <h3 class="center" style="margin-bottom: 8px">Результаты:</h3>
                    <ResultList></ResultList>
                    <div class="center">
                        <el-button type="info"  @click="save">Сохранить</el-button>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import RiskForm from "@/components/RiskForm";
    import StatesList from "@/components/StatesList";
    import {mapGetters} from "vuex";
    import ResultList from "@/components/ResultList";
export default {
    components:{
        ResultList,
        StatesList,
        RiskForm
    },
    data(){
        return {
            type: null,
            types: [ { name: 'Событие', value: 0}, { name: 'Инициализирующее событие', value: 1}],
            isEvent: true,
            fal: '',
            probFunction: '',
            isSolved: false
        }
    },
    computed: {
        ...mapGetters('States', ['events','mainEvent', 'initEvents', 'mainEvents']),
        file(){
            return this.$refs['file'];
        }
    },
    methods: {
        solve(){
            let isOkay = this.check();
            if(!isOkay){
                return;
            }

            this.$store.commit('States/CLEAR_COMBINATIONS');
            this.findCombinations(this.mainEvent);
            this.calcProbabilities();
            this.printResults();
        },

        findCombinations(node){
            node.combinations = [];
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
            this.$store.commit('States/CLEAR_STATE');
            this.fal = '';
            this.probFunction = '';
            this.isSolved = false;
        },

        printResults(){
            this.printLogicFunction();
            this.printProbFunction();
            this.isSolved = true;
        },

        printLogicFunction(){
            let xDefArray = this.initEvents.map(x=> `x${x.index}`);
            let xResArray = this.mainEvent.combinations.map(x=>{
                let str ='';
                for(let i=0; i<x.length; i++){
                    if(i !=0){
                        str += '∩';
                    }
                    str+=`x${x[i]}`;
                }
                return str;
            });
            let resStr= '';
            for(let i=0; i<xResArray.length; i++){
                resStr += `(${xResArray[i]})`;
                if(i!=xResArray.length-1){
                    resStr += '∪'
                }
            }
            this.fal = `f(${xDefArray}) = ${resStr}`;
        },

        printProbFunction(){
            let xDefArray = this.initEvents.map(x=> `x${x.index}`);
            let xResArray = this.mainEvent.combinations.map(x=>{
                let str ='1-';
                for(let i=0; i<x.length; i++){
                    if(i !=0){
                        str += '*';
                    }
                    str+=`x${x[i]}`;
                }
                return str;
            });
            let resStr= '';
            for(let i=0; i<xResArray.length; i++){
                resStr += `(${xResArray[i]})`;
                if(i!=xResArray.length-1){
                    resStr += '*'
                }
            }
            this.probFunction = `P(f(${xDefArray}) = 1) = 1 - (${resStr})`
        },

        calcProbabilities(){
            for(let i=0; i<this.mainEvents.length; i++){
                this.calcProbability(this.mainEvents[i]);
            }
        },

        calcProbability(node){
            let prob = 1;
            for(let i=0; i<node.combinations.length; i++){
                let combProb = 1;
                for(let j=0; j<node.combinations[i].length; j++){
                    combProb *= this.initEvents.find(x => x.index == node.combinations[i][j]).probability.toFixed(2);
                }
                combProb = 1 - combProb;
                prob*=combProb;
            }
            prob = 1-prob;
            node.finalProbability = prob.toFixed(2);
            node.risk = node.cost * node.finalProbability;
        },

        save(){
            let jsonData = JSON.stringify(this.events);
            this.download(jsonData, 'ЛВМ_Данные.json', 'text/plain');
        },

        download(content, fileName, contentType) {
            let a = document.createElement("a");
            let file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        },

        load(){
            this.file.click();
        },

        loadData(){
            let file = this.file.files[0];
            let reader = new FileReader();

            reader.readAsText(file);
            let program = this;

            reader.onload = function() {
                let data = JSON.parse(reader.result);
                program.$store.commit('States/LOAD_EVENTS', data);
                program.solve();
            };
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
