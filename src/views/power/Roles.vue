<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card>
            <!--添加角色按钮区域-->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="rolesList" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 ===0 ?'bdtop':'','vcenter']"
                                v-for="(item1,i1) in scope.row.children"
                                :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级、三级权限-->
                            <el-col :span="19">
                                <!--通过for循环嵌套渲染二级权限-->
                                <el-row :class="[i2 ===0 ?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning"
                                                closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--分配权限对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightsDialogVisible"
                width="50%" @close="setRightsDialogClose">
            <!--树形控件-->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                //所有角色列表
                rolesList: [],
                //控制分配权限对话框显示与隐藏
                setRightsDialogVisible: false,
                //所有权限数据
                rightsList: [],
                //树形空间的绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                //默认选定数据
                defKeys: [],
                //当前即将分配权限的角色id
                roleId:''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            getRolesList() {
                this.$http.get('roles').then(res => {
                    if (res.status !== 200) {
                        return this.$message.error("获取角色列表数据失败")
                    }
                    this.rolesList = res.data.data

                    console.log(this.rolesList);
                })
            },
            //根据id删除对应权限
            removeRightById(role, rigthId) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`roles/${role.id}/rights/${rigthId}`).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("删除权限失败")
                        }

                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                        //刷新权限
                        this.getRolesList()

                        role.children = res.data
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //展示分配权限对话框
            showSetRightDialog(role) {
                //获取所有权限数据
                this.$http.get(`rights/tree`).then(res => {
                    if (res.status !== 200) {
                        return this.$message.error("获取权限数据失败")
                    }
                    //把获取到的权限数据保存到data中
                    this.rightsList = res.data.data
                    console.log(this.rightsList);
                })
                this.roleId = role.id;
                //递归获取三级节点id
                this.getLeafKeys(role,this.defKeys)
                this.setRightsDialogVisible = true
            },
            //通过递归形式，获取角色下所有三级权限的id并保存到defKeys数组中
            getLeafKeys(node,arr){
                //如果node节点不包括children属性，则是第三节点
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item,arr)
                })
            },
            //监听分配权限对话框的关闭事件
            setRightsDialogClose(){
                this.defKeys = []
            },
            //点击角色分配权限
            allotRights(){
                const  keys =[... this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedNodes()]
                const  idStr = keys.join(',')
                this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res => {
                    if(res.status !== 200){
                        return this.$message.error("分配权限失败")
                    }

                    this.$message.success("分配权限成功")
                    this.getRolesList();
                    this.setRightsDialogVisible = false
                })
            }
        }
    }
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>