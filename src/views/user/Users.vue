<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--输入框-->
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                              @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!--用户列表区域-->
            <el-table
                    :data="userList"
                    style="width: 100%"
                    border stripe>
                <el-table-column
                        label="#"
                        type="index">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template v-slot="scope">
                        <el-switch
                                v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="180px">
                    <template v-slot="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除-->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!--分配角色-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

            <!--添加用户对话框-->
            <el-dialog
                    title="添加用户"
                    :visible.sync="addDialogVisible"
                    width="50%"
                    @close="addDialogClose()">
                <!--内容主题区-->
                <!-- 表单验证区域-->
                <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="70px"
                         class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addFrom.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addFrom.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addFrom.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addFrom.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

            <!--修改用户对话框-->
            <el-dialog
                    title="修改用户"
                    :visible.sync="editDialogVisible"
                    width="50%">
                <!--内容主题区-->
                <!-- 表单验证区域-->
                <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px"
                         class="demo-ruleForm">
                    <el-form-item label="用户名">
                        <el-input v-model="editFrom.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editFrom.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editFrom.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            //验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                //验证邮箱的正则表达式
                const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/
                if (regEmail.test(value)) {
                    //合法邮箱
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }

            //验证手机号的规则
            var checkPhone = (rule, value, cb) => {
                //验证邮箱的正则表达式
                const regPhone = /^1[3-9]\d{9}$/
                if (regPhone.test(value)) {
                    //合法手机号
                    return cb()
                    console.log(value)
                }

                cb(new Error('请输入正确的手机号码'))
            }
            return {

                //获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    //页数
                    pagenum: 1,
                    //当前每页显示多少条数据
                    pagesize: 2
                },
                userList: [],
                total: 0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible: false,
                //添加用户表单数据
                addFrom: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //添加表单的验证规则
                addFromRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 5, max: 13, message: '长度在5  到 13 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                //控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                //修改用户表单数据
                editFrom: {},
                //修改表单验证规则
                editFromRules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
                this.userList = res.data.users;
                this.total = res.data.total;
                console.log(res)
            },
            //监听handleSizeChange变化
            handleSizeChange(newSize) {
                console.log(newSize)
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            //监听页码值的变化
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList()
            },
            //监听switch的改变
            async userStateChanged(userInfo) {
                console.log(userInfo.mg_state)
                const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新状态失败')
                }
                this.$message.success("更新用户状态成功")
            },
            //监听添加用户对话框的关闭事件
            addDialogClose() {
                this.$refs.addFromRef.resetFields()
            },
            //点击按钮添加用户
            addUser() {
                /*第一种方法*/
                /* this.$refs.addFromRef.validate(async valid => {
                     console.log(valid)
                     if (!valid)
                         return
                         //发起网络请求
                         const {data: res} = await this.$http.post('users', this.addFrom)

                         if (res.meta.status !== 201) {
                             this.$message.error("添加用户失败")
                         }
                         this.$message.success("添加用户成功")
                         //隐藏添加用户对话框
                         this.addDialogVisible = false
                         //刷新数据
                         this.getUserList()
                 })*/

                /*第二种方法*/
                this.$refs.addFromRef.validate(valid => {
                    if (!valid) return
                    //发起网络请求
                    this.$http.post('users', this.addFrom).then(res => {
                        console.log(res)
                        if (res.status !== 200) {
                            this.$message.error("添加用户失败")
                        }
                        this.$message.success("添加用户成功")
                        //隐藏添加用户对话框
                        this.addDialogVisible = false
                        //刷新数据
                        this.getUserList()
                    })
                })
            },
            //展示编辑用户对话框
            showEditDialog(id) {
                this.updateDialogVisible = true
                this.$http.get('users/' + id).then(res => {
                    if (res.status !== 200) {
                        return this.$message.error("查询失败")
                    }
                    this.editFrom = res.data.data
                    this.editDialogVisible = true
                })
            },
            //监听修改用户的对话框关闭事件
            editDialogClose() {
                this.$refs.editFromRef.resetFields()
            },
            //点击修改用户
            editUser() {
                this.$refs.editFromRef.validate(valid => {
                    if (!valid) return
                    this.$http.put('users/' + this.editFrom.id, {
                        email: this.editFrom.email,
                        mobile: this.editFrom.mobile
                    }).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("更新用户信息失败")
                        }
                        //关闭对话框
                        this.editDialogVisible = false;
                        //刷新数据列表
                        this.getUserList()
                        //提示
                        this.$message.success("用户修改成功")
                    })
                })
            },

            //点击删除用户
            removeUserById(id){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    this.$http.delete('users/'+id).then(res => {
                        if(res.status !== 200){
                            return this.$message.error("删除用户失败")
                        }

                        this.$message.success("删除用户成功")

                        //刷新用户列表
                        this.getUserList()
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>