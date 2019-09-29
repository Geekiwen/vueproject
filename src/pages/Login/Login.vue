<template>
    <div class="login">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>登陆|注册</span>
            </div>
            <div>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立即登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>

import { mapActions } from "vuex"
import Storage from "../../utils/Storage"

export default {
    name: "Login",
    data() {
        return {
            form: {}
        };
    },
    methods:{
        /**
         * 登陆事件
         */
        ...mapActions(["seUserInfoActions"]),

        onSubmit(){
            this.$api.getLogin({
                username:this.form.username,
                password:this.form.password
            })
            .then(res => {
                if(res.data.code === 200){
                    // vuex写入数据
                    this.seUserInfoActions({
                        username:res.data.username,
                        token:res.data.token
                    })
                    // 本地存储写入数据
                    Storage.setItem("username",res.data.username);
                    Storage.setItem("token",res.data.token);
                    // 回到首页
                    this.$router.replace("/");
                }else{
                    alert(res.data.msg);
                }
            })
            .catch(error =>{
                console.log(error);
            })
        }
    }
};
</script>
<style scoped>
.login {
    width: 100%;
}
.box-card {
    width: 600px;
    margin: 0 auto;
    margin-top: 100px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
</style>