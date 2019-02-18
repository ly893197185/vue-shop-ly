<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="sj.query"
            :clearable="true"
            @clear="hq"
            @keyup.enter.native="hq"
          >
            <el-button slot="append" icon="el-icon-search" @click="hq"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table :data="userslist" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="create_time" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column label="状态" width="70">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
          <!--再次获得每个用户的信息，用户的信息已经传递到这个位置-->
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="haha">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(haha.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(haha.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="sj.pagenum"
        :page-sizes="[3,5,10,20]"
        :page-size="sj.pagesize"
        layout="total, sizes,prev, pager, next, jumper"
        :total="sj.total"
      ></el-pagination>

      <!--添加用户弹框功能-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" :model="addForm" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUsers">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改用户dialog-->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
        <el-form :rules="editFormRules" :model="editForm" ref="editFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUsers">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.hq()
  },
  methods: {
    // 修改操作
    async editUsers() {
      const { data: res } = await this.$http.put(
        'users/' + this.editForm.id,
        this.editForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //  修改数据后关闭弹框
      this.editDialogVisible = false
      this.$message.success(res.meta.msg)
      // 重新刷新数据
      this.hq()
    },
    // 修改弹框显示
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 接受被修改的数据
      this.editForm = res.data
    },
    // 删除功能按钮
    delUser(id) {
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除请求
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功提示和更行数据
          this.$message.success(res.meta.msg)
          this.hq()
        })
        .catch(() => {})
    },
    // 给按钮添加功能
    addUsers() {
      // 进行表单的验证
      this.$refs.addFormRef.validate(async valid => {
        // 如果验证成功
        if (valid) {
          const { data: res } = await this.$http.post('/users', this.addForm)

          // 如果添加不成功
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 添加成功后
          // 关闭弹框
          this.addDialogVisible = false
          // 提示成功信息
          this.$message.success(res.meta.msg)
          this.hq()
        }
      })
    },
    // 重置form表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 数据分页相关
    // 每页数据变化处理
    handleSizeChange(val) {
      // val 变化后的每页信息条数
      this.sj.pagesize = val
      // 变化后  重新获得数据
      this.hq()
    },
    // 当前页码变化处理
    handleCurrentChange(val) {
      // 变化后的页码
      this.sj.pagenum = val
      // 变化后  重新获得数据
      this.hq()
    },
    // 获取首屏数据
    async hq() {
      const { data: res } = await this.$http.get('users', { params: this.sj })
      // 如果获取失败的话
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 记录总条数变量
      this.sj.total = res.data.total
      // 把获得的数据，赋值给userslist成员
      this.userslist = res.data.users
    }
  },
  data() {
    var checkMoble = (rule, value, callback) => {
      // 正则验证手机号
      if (!/^1[3578]\d{9}$/.test(value)) {
        // 验证失败
        return callback(new Error('手机号码格式不正确'))
      }
      // 验证通过
      callback() // 继续执行
    }
    return {
      editDialogVisible: false,
      // 添加用户相关1
      // dialog弹框是否显示 ture 显示 false 不显示
      addDialogVisible: false,
      // form表单数据部分
      editForm: {
        username: '',
        password: '',
        mobile: ''
      },
      editFormRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMoble, trigger: 'blur' }
        ]
      },
      // form表单数据部分
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // form 表单数据验证
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMoble, trigger: 'blur' }
        ]
      },
      // 用来接受用户信息
      userslist: [],
      // 获取用户信息的需要的参数
      sj: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
