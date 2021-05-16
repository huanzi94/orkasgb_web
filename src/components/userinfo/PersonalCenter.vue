<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人资料" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="修改密码" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
  
  <style>
</style>