<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!--表单区域-->
            <el-form ref="loginFormRef" :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_info">
                <el-form-item  prop="username">
                    <el-input v-model="loginFrom.username" prefix-icon="el-icon-s-custom" ></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input v-model="loginFrom.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!--按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">登入</el-button>
                    <el-button type="info" @click="resetLoginForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                //登入表单数据绑定
                loginFrom:{
                    username:'admin',
                    password:'123456'
                },
                //这是表单验证规则
                loginFromRules:{
                    //验证用户名是否合法
                    username:[
                        { required: true, message: '请输用户', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    //验证密码是否合法
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            //点击重置按钮，重置登入表单
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            login(){
                this.$refs.loginFormRef.validate(async (valid) => {
                    if(!valid){
                        return;
                    }else {
                        //发送网络请求
                        // this.$http.post('login', this.loginForm): 返回值为promise
                        // 返回值为promise，可加await简化操作 相应的也要加async
                        //{data: res} : 解构data属性重命名为res
                        const {data: res} = await this.$http.post("login",this.loginFrom);
                        console.log(res);
                        if(res.meta.status !== 200){return this.$message.error('登入失败')}
                             this.$message.success('登入成功')
                            //1.将登入成功之后的token，保存到客户端的sessionStorage中
                            //1.1项目中出了登录之外的其他API接口，必须在登入之后才能访问
                            //1.2token只应在当前网站打开期间生效，所以讲token保存在sessionStorage中
                            window.sessionStorage.setItem("token",res.data.token)
                            //2.通过编程式导航跳转到后台主页，路由地址是/home
                            this.$router.push("/home")
                        }
                })
            }
        }
    }
</script>

<style scoped>
    .login_container{
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box{
        width: 500px;
        height: 350px;
        background-color: white;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 8px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: white;
    }
    .avatar_box img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_info{
        position: absolute;
        bottom: 30px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>