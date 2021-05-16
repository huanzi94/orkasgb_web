<template>
  <div>
    <el-header style="background-color: #545c64" class="homeHeader">
      <el-row :gutter="20">
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <span style="color: white"
              ><strong>数字化智能管理系统</strong></span
            >
          </div></el-col
        >
        <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <span style="color: white"
              >登录用户：{{ userInfor.operatorName }}</span
            >
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-image :src="url" fit="true"></el-image>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a @click="goPersonalCenter">个人中心</a></el-dropdown-item
                >
                <el-dropdown-item
                  ><a @click="loginOut">注销登录</a></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div></el-col
        >
      </el-row>
    </el-header>
    <el-container>
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        router
        unique-opened
      >
        <el-header style="height: 30px; text-align: right"
          ><el-button
            type="text"
            icon="el-icon-menu"
            @click="
              isCollapse == true ? (isCollapse = false) : (isCollapse = true)
            "
          ></el-button
        ></el-header>
        <el-submenu
          :index="item.path"
          v-for="(item, index) in routers"
          :key="index"
        >
          <template slot="title">
            <i :class="item.iconCls"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            :index="children.path"
            v-for="(children, cIndex) in item.children"
            :key="cIndex"
          >
            <template slot="title">
              <i :class="children.iconCls"></i>
              <span>{{ children.name }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-main>
        <el-breadcrumb separator=" ">
          <el-breadcrumb-item :to="{ path: '/index' }">
            <el-button type="text">首页</el-button>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ path: mean.path }"
            v-for="(mean, index) in smallLsit"
            :key="index"
          >
            <el-button type="text">{{ mean.name }}</el-button>
            <span class="el-icon-circle-close" @click="removeTab(index)"></span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  computed: {
    routers() {
      return this.$store.state.routes;
    },
  },
  data() {
    return {
      isCollapse: true,
      smallLsit: [],
      userInfor: JSON.parse(window.sessionStorage.getItem("userInfor")),
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    };
  },
  mounted() {
    this.$router.push("index");
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  methods: {
    removeTab(index) {
      this.smallLsit.splice(index, 1);
      let tabs = this.smallLsit;
      let nextTab = tabs[index + 1] || tabs[index - 1];
      this.getBreadcrumb();
      if (nextTab) {
        this.$router.replace(nextTab.path);
        return;
      } else {
        this.$router.replace("/index");
        return;
      }
    },

    deleteBreadcrumb(index) {
      this.smallLsit.splice(index, 1);
      let length = this.smallLsit.length;
      if (length == 0 || index == 0) {
        this.$router.push("/index");
        return;
      }
      if (index + 1 <= length) {
        this.$router.replace(this.smallLsit[index + 1].path);
        return;
      }
      if (index - 1 <= length) {
        this.$router.replace(this.smallLsit[index - 1].path);
        return;
      }
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) =>
          item.path != "/index" && item.path != "/home"
      );
      matched.forEach((element) => {
        let ru = { path: element.path, name: element.name };
        if (this.smallLsit.length == 0) {
          this.smallLsit.push(ru);
        } else {
          var isHasRu = false;
          this.smallLsit.forEach((sml) => {
            if (sml.path == ru.path) {
              isHasRu = true;
            }
          });
          if (!isHasRu) {
            this.smallLsit.push(ru);
          }
        }
      });
    },
    created() {
      this.getBreadcrumb();
    },
    loginOut() {
      const that = this;
      that.$axiosPost("/login/loginOut").then((resp) => {
        that.$store.commit("initRouters", []);
        that.$router.replace("/");
        window.sessionStorage.removeItem("userInfor");
        window.sessionStorage.removeItem("orkasgb_satoken");
      });
    },
    goPersonalCenter() {
      const that = this;
      that.$router.replace("personalCenter");
    },
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-dropdown-link img {
  width: 50px;
  height: 50px;
  border-radius: 24px;
}
.homeHeader {
  justify-content: space-between;
}
</style>
