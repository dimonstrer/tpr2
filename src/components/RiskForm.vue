<template>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="onSubmit">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="Родительское событие" prop="parentNode">
                    <el-select v-model="form.parentNode"  filterable>
                        <el-option
                                key="-1"
                                value="-1"
                                label="Base"
                                :disabled="isBaseDisabled"
                        >
                        </el-option>
                        <el-option
                                v-for="item in mainEvents"
                                :key="item.index"
                                :value="item.index"
                                :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="7">
                <el-form-item label="Наименование события" prop="name">
                    <el-input placeholder="Введите наименование события" v-model="form.name"></el-input>
                </el-form-item>
            </el-col>

            <div v-if="isEvent">
                <el-col :span="7">
                    <el-form-item label="Стоимость" prop="cost">
                        <el-input placeholder="Введите стоимость" v-model.number="form.cost"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="4">
                    <el-form-item label="Условие" prop="condition">
                        <el-select v-model="form.condition">
                            <el-option
                                    key="1"
                                    value="AND"
                                    label="И"
                            ></el-option>
                            <el-option
                                    key="2"
                                    value="OR"
                                    label="ИЛИ"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </div>

            <el-col :span="9" v-else>
                <el-form-item label="Вероятность" prop="probability">
                    <el-input placeholder="Введите вероятность" v-model.number="form.probability"></el-input>
                </el-form-item>
            </el-col>


        </el-row>


        <el-form-item class="center">
            <el-button type="success" round native-type="submit">Добавить</el-button>
            <el-button round @click="clear">Очистить</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import { mapGetters } from 'vuex';
    class Event {
        index;
        name;
        parentName;
        parentNode;
        probability;
        cost;
        condition;
        childNodes = [];
        isEvent;
        combinations = [];

        constructor(parentNode, name, parentName, probability, cost, currentIndex, condition, isEvent) {
            this.parentNode = parentNode;
            this.name = name;
            this.parentName = parentName;
            this.probability = probability;
            this.cost = cost;
            this.index = currentIndex;
            this.condition = condition;
            this.isEvent = isEvent;
        }
    }

    export default{
        props: {
            isEvent: Boolean
        },

        data(){
            return {
                form: {
                    parentNode: null,
                    name: null,
                    probability: null,
                    cost: null,
                    condition: null
                },
                currentIndex: 0,
                baseRules: {
                    parentNode: [
                        {required: true, message: 'Поле обязательно для заполнения'}
                    ],
                    name: [
                        {required: true, message: 'Поле обязательно для заполнения'}
                    ],
                },
                initEvent: {
                    probability: [
                        {required: true, message: 'Поле обязательно для заполнения'},
                        {type: 'number', message: 'Поле должно быть числом'}
                    ],
                },
                event: {
                    cost: [
                        { required: true, message: 'Поле обязательно для заполнения' },
                        { type: 'number', message: 'Поле должно быть числом' }
                    ],
                    condition: [
                        { required: true, message: 'Поле обязательно для заполнения' }
                    ]
                },
            }
        },

        computed: {
            isBaseDisabled() {
                return this.events.filter(x=>x.parentNode == -1).length != 0;
            },
            $form() {
                return this.$refs['form'];
            },
            rules(){
                return this.isEvent ? {...this.baseRules, ...this.event} : {...this.baseRules, ...this.initEvent};
            },
            ...mapGetters('States', ['events', 'mainEvents'])
        },

        methods: {
            onSubmit() {
                const { $form } = this;
                let { parentNode, name, probability, cost, condition } = this.form;

                if(this.isEvent){
                    probability = null;
                }else {
                    cost = null;
                    condition = null
                }

                let parent = this.$store.getters['States/eventById'](parentNode);
                let parentName = parent?.name ?? '-';

                $form.validate(async valid => {
                    if (valid) {
                        let payload = new Event(parentNode, name, parentName, probability, cost, this.currentIndex++, condition, this.isEvent);
                        this.$store.commit('States/ADD_EVENT', payload);
                    }
                });
            },
            clear(){
                this.$form.resetFields();
            }
        }
    }
</script>

<style>
</style>
