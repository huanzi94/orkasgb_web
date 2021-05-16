<template>
  <div>
    <div class="background">
      <img src="../../assets/loginBg.png" width="100%" height="100%" alt="" />
    </div>
  <div class="front">
    <el-container>
      <el-header style="height: 200px"></el-header>
      <el-main class="mainBg">
        <div class="grid-content bg-purple">
          <el-card class="box-card" style="width: 500px">
            <div slot="header" class="clearfix">
          <span>后台管理系统</span>
        </div>
            <div class="text item">
              <el-form
                ref="form"
                :model="form"
                :rules="loginRules"
                label-width="80px"
              >
                <el-form-item label="账号" prop="account">
                  <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="记住密码">
                  <el-switch v-model="form.rememberMe"></el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">登录 </el-button>
                  <el-button @click="onReset">清除</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        password: "",
        account: "",
        rememberMe: false,
      },
      loginRules: {
        account: [
          {
            required: true,
            message: "Please enter the account",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please enter the password",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "Please enter the verification code",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    onSubmit(ent) {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            operatorLoginId: this.form.account,
            operatorPwd: this.form.password,
            rememberMe: this.form.rememberMe,
          };
          that
            .$axiosPost("/login/loginValidate", param)
            .then((resp) => {
              if (resp.data) {
                // 根据store中setToken方法将token保存至localStorage/sessionStorage中，获取token的value值
                that.$store.commit("setToken", resp.headers.orkasgb_satoken);
                window.sessionStorage.setItem('orkasgb_satoken', resp.headers.orkasgb_satoken);
                window.sessionStorage.setItem('userInfor', JSON.stringify(resp.data.data));
                let path = that.$route.query.redirect;
                that.$router.replace(path == '/' || path == undefined ? '/home' : path);
              }
            });
        } else {
          that.$message.error("Required information is empty");
          return;
        }
      });
    },
    onReset(ent) {
      this.form.account = "";
      this.form.password = "";
      this.form.rememberMe = false;
    },
  },
};
</script>
<style>
.background{
    width:100%;  
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    position: absolute;
}
.clearfix{
  font:30px arial,sans-serif;
}
.mainBg{
 text-align: center; margin: 0 auto; position: relative;
 opacity:0.8;
}
</style>
