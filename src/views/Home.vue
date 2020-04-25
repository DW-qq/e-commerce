<template>
    <div>
        <el-button type="info" @click="loginOut">退出</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        methods: {
            loginOut() {
                //清空token
                window.sessionStorage.clear();
                //跳转登入界面
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped>

</style>