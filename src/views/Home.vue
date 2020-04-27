<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginOut">退出</el-button>
        </el-header>
        <!--页面主体区域-->
        <el-container>
            <!--侧边栏区域-->
            <el-aside :width="isShow?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409EFF"
                        :unique-opened="true"
                        :collapse="isShow"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="activePath"
                       >
                    <!--一级菜单-->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!--一级菜单的模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="iconsObj[item.id]"></i>
                            <!--文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index=" '/' +subItem.path"
                                      v-for="subItem in item.children"
                                      :key="subItem.id"
                                      @click="saveNavState('/' +subItem.path)">
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-menu"></i>
                                <!--文本-->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>
                <!--路由占位符-->
                <router-view></router-view>
            </el-main>

        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                //左侧菜单数据
                menuList: [],
                iconsObj: {
                    '125': 'el-icon-user-solid',
                    '103': 'el-icon-s-help',
                    '101': 'el-icon-s-cooperation',
                    '102': 'el-icon-s-order',
                    '145': 'el-icon-s-data'
                },
                //是否折叠
                isShow: false,
                //点击列表颜色变成高亮
                activePath: ''
            }
        },
        created() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            loginOut() {
                //清空token
                window.sessionStorage.clear();
                //跳转登入界面
                this.$router.push('/login')
            },

            //获取所有的菜单
            async getMenuList() {
                const {data: res} = await this.$http.get('menus')
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.menuList = res.data
                console.log(this.menuList)
            },
            //菜单的折叠与展开
            toggleCollapse() {
                this.isShow = !this.isShow
            },
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
            }
        }
    }
</script>


<style scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;

        color: white;
        font-size: 20px;
    }

    .el-aside {
        background-color: #333744;
    }

    .el-aside .el-menu {
        border-right: none;
    }

    .el-main {
        background-color: #eaedf1;
    }

    .toggle-button {
        background-color: #4A5064;
        color: white;
        line-height: 24px;
        font-size: 10px;
        letter-spacing: 0.2em;
        text-align: center;
        cursor: pointer;
    }
</style>