<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span style>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="t">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="g?'65px':'200px'">
        <div
          style="heigth:25px;color:white;text-align:center;line-height:25px;background-color:rgb(74,80,100);
        font-size:12px;letter-spacing:0.1;cursor:pointer;user-select:none;"
          @click="g=!g"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :style="g?'width:65px;':'width:200px;'"
          :collapse="g"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <el-submenu :index="item.id + ''" v-for="(item,k) in list" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-'+listicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="item.id+''+item2.id"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.geiList()
  },
  data() {
    return {
      g: false,
      list: [], // 接受左侧功能按钮数据
      listicon: ['user', 'tijikongjian', 'shangpin', 'danju', 'baobiao'] // 左侧权限图标
    }
  },
  methods: {
    // 获得左侧数据信息
    async geiList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的数据赋值给list
      this.list = res.data
    },
    // 退出功能实现
    t() {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: rgb(55, 61, 65);
    padding: 0;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #logo-box {
      font-size: 22px;
      color: #fff;
      display: flex;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
