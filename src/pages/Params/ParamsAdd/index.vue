<template>
    <div>
        <el-button @click.prevent="addDomain">添加分组</el-button>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px">
            <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.index"
                :label="'规格参数:' + index"
                :prop="'domains.' + index + '.value'"
                :rules="{required: true, message: 'value不能为空', trigger: 'blur'}"
            >
                <el-input v-model="domain.value" style="width: 60%;margin-right:10px;"></el-input>
                <el-button @click.prevent="addJieshao(index)">添加规格参数</el-button>
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                <div
                    v-for="(item, index1) in dynamicValidateForm.domains[index].children"
                    :key="index1"
                    :label="'参数 ' + index1"
                    :prop="'children.' + index1 +  '.childValue'"
                    :rules="{required: true, message: 'childValue不能为空', trigger: 'blur'}"
                >
                    <el-input v-model="item.childValue" style="width: 60%;margin-right:10px;"></el-input>
                    <el-button @click.prevent="removeChild(index,item)">删除</el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: "ParamsAdd",
    data() {
        return {
            dynamicValidateForm: {
                domains: [
                    {
                        value: "",
                        children: []
                    }
                ]
            }
        };
    },
    /**
     *[
        {
            "value":"电池信息",
            "children":[
                {
                    "childValue":"电池是否可拆卸"
                },
                {
                    "childValue":"入网型号"
                }
            ]
        },
        {
            "value":"主体",
            "children":[
                {
                    "childValue":"入网型号"
                }
            ]
        }
    ]
     * 
     */
    methods: {
        addDomain() {
            this.dynamicValidateForm.domains.push({
                value: "",
                children: [
                    {
                        value: "",
                        childValue: ""
                    }
                ]
            });
        },
        addJieshao(index) {
            this.dynamicValidateForm.domains[index].children.push({
                childValue: "",
                value: ""
            });
            console.log(this.dynamicValidateForm);
        },
        /**
         * 删除大节点
         */
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        /**
         * 删除小节点
         */
        removeChild(index, item) {
            var num = this.dynamicValidateForm.domains[index].children.indexOf(
                item
            );
            if (num !== -1) {
                this.dynamicValidateForm.domains[index].children.splice(num, 1);
            }
        },
        /**
         * 提交数据
         */
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit(
                        "onParamsAdd",
                        JSON.stringify(this.dynamicValidateForm.domains)
                    );
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /**
         * 重置数据
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>
<style scoped>
</style>