<template>
    <div>
        <!--面包屑导航区域-->
        <breadcrumb>
            <el-breadcrumb-item slot="home">首页</el-breadcrumb-item>
            <el-breadcrumb-item slot="Two">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item slot="three">权限列表</el-breadcrumb-item>
        </breadcrumb>
        <!--卡片视图-->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
                        <el-tag type="warning" v-else>三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import Breadcrumb from "../../components/common/Breadcrumb";
    export default {
        name: "Rights",
        components:{
            Breadcrumb
        },
        data(){
            return{
                //权限列表
                rightsList:[]
            }
        },
        created() {
            //获取权限数据
            this.getRightsList()
        },
        methods:{
            getRightsList(){
                this.$http.get('rights/list').then(res =>{
                    if(res.status !== 200){
                        return this.$message.error("获取权限失败")
                    }
                    this.rightsList = res.data.data
                })
            }
        }
    }
</script>

<style scoped>

</style>