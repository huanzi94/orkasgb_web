<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item label="操作员名称">
            <el-input v-model="form.meanuName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="操作员编号">
            <el-input v-model="form.meanuNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否有效">
            <el-select
              v-model="form.vaild"
              placeholder=""
              style="margin-left: 20px"
              clearable="true"
            >
              <el-option
                v-for="item in vaildOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="form.createTime"
              :picker-options="pickerOptions"
              align="right"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="query"
            >查询
          </el-button>
          <el-button icon="el-icon-search" type="warning" @click="clean"
            >清除
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="4">
        <el-button
          size="small"
          icon="el-icon-folder-add"
          style="text-align: left"
          type="primary"
          @click="lodingAddDilog"
          >新增
        </el-button>
        <el-button
          size="small"
          icon="el-icon-download"
          style="text-align: left"
          type="primary"
          @click="exportFile"
          >导出
        </el-button>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col>
        <el-table :data="operatorData" border style="width: 100%">
          <el-table-column
            v-for="(col, index) in cols"
            :id="col"
            :key="index"
            :label="col.label"
            :prop="col.prop"
            fixed
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                content="编辑操作员"
                effect="dark"
                placement="top-start"
              >
                <el-button
                  circle
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                  @click="lodingEditDilog(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                content="删除操作员"
                effect="dark"
                placement="top-start"
              >
                <el-button
                  circle
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                  @click="remove(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                content="授权"
                effect="dark"
                placement="top-start"
              >
                <el-button
                  circle
                  icon="el-icon-s-promotion"
                  size="small"
                  type="warning"
                  @click="handleAuthorizeDialogOpen(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑或者新增操作员 -->
    <el-drawer
      ref="drawer"
      :before-close="handleClose"
      :title="title"
      :visible.sync="dialog"
      custom-class="demo-drawer"
      direction="rtl"
      size="50%"
      show-close="false"
      :with-header="false"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ title }}</span>
          <el-button
            v-if="subForm == null"
            style="float: right; padding: 3px 0"
            type="text"
            @click="addOpertor"
            >保存</el-button
          >
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="updateOpertor"
            >保存</el-button
          >
        </div>
        <div class="text item">
          <el-form ref="subForm" :model="subForm" label-width="100px">
            <el-form-item label="操作员名称">
              <el-input v-model="subForm.operatorName"></el-input>
            </el-form-item>
            <el-form-item label="登陆账号">
              <el-input v-model="subForm.operatorLoginId"></el-input>
            </el-form-item>
            <el-form-item label="登陆密码">
              <el-input v-model="subForm.operatorPwd"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="subForm.operatorTel"></el-input>
            </el-form-item>
            <el-form-item label="头像">
              <el-input v-model="subForm.operatorImg"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select
                v-model="subForm.operatorSex"
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-select
                v-model="subForm.departmentNo"
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.value"
                  :label="item.departmentName"
                  :value="item.departmentNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属角色">
              <el-select
                v-model="subForm.roleNo"
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.roleName"
                  :value="item.roleNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="有效">
              <el-select
                v-model="subForm.vaild"
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="item in vaildOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <div class="block">
                <el-date-picker
                  v-model="subForm.operatorSTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="结束时间">
              <div class="block">
                <el-date-picker
                  v-model="subForm.operatorETime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="subForm.operatorText"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-drawer>

    <!-- 授权弹出框 -->
    <el-dialog
      title="权限菜单"
      :visible.sync="dialogVisible"
      width="50%"
      lazy
      :before-close="handleAuthorizeDialogClose"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-divider></el-divider>
      <el-tree
        :data="meanuTreeData"
        show-checkbox
        default-expand-all
        :load="loadNode"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        :filter-node-method="filterNode"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorize">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from "element-ui";

export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      dialogVisible: false,
      filterText: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value1: "",
      value2: "",
      title: "",
      form: {
        operatorName: "",
        operatorLoginId: "",
        vaild: "",
        createTime: [new Date(), new Date()],
      },
      subForm: {
        operatorNo: "",
        operatorName: "",
        operatorLoginId: "",
        operatorPwd: "",
        operatorSex: "",
        operatorTel: "",
        operatorImg: "",
        operatorText: "",
        operatorSTime: "",
        operatorETime: "",
        departmentNo: "",
        roleNo: "",
      },
      operatorData: [],
      departmentList: [],
      roleList: [],
      cols: [
        { prop: "operatorNo", label: "操作员编号" },
        { prop: "operatorName", label: "操作员名称" },
        { prop: "operatorLoginId", label: "登陆账号" },
        { prop: "operatorSex", label: "性别" },
        { prop: "operatorTel", label: "联系方式" },
        { prop: "operatorImg", label: "头像" },
        { prop: "operatorText", label: "备注" },
        { prop: "vaild", label: "是否有效" },
        { prop: "operatorSTime", label: "开始时间" },
        { prop: "operatorETime", label: "结束时间" },
        { prop: "departmentNo", label: "部门编号" },
        { prop: "departmentName", label: "部门名称" },
        { prop: "roleNo", label: "角色编号" },
        { prop: "roleName", label: "角色名称" },
      ],
      vaildOptions: [
        {
          value: "1",
          label: "有效",
        },
        {
          value: "0",
          label: "无效",
        },
      ],
      sexOptions: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "0",
          label: "女",
        },
      ],
      table: false,
      dialog: false,
      loading: false,
      meanuTreeData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getRoleList();
      this.getDepartment();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    query() {
      const that = this;
      const param = {
        operatorName: this.form.operatorName,
        operatorLoginId: this.form.operatorLoginId,
        vaild: this.form.vaild,
        startTime: null == this.form.createTime ? "" : this.form.createTime[0],
        endTime: null == this.form.createTime ? "" : this.form.createTime[1],
      };
      that.$axiosPost("/operator/getOperatorList", param).then((resp) => {
        if (resp) {
          that.operatorData = resp.data.data;
          Message.success(resp.data.message);
        }
      });
    },
    remove(row) {
      const that = this;
      const param = {
        operatorNo: row.operatorNo,
      };
      that.$axiosPost("/operator/deleteOperator", param).then((resp) => {
        if (resp) {
          that.$message.success(resp.data.message);
          that.getParentMean();
          that.query();
        }
      });
    },
    addOpertor(row) {
      const that = this;
      const param = that.subForm;
      that.$axiosPost("/operator/addOperator", param).then((resp) => {
        const data = resp.data;
        if (data) {
          if (data.status == "fail") {
            that.loading = false;
            that.$message.error(data.message);
            return;
          }
          that.dialog = false;
          that.getParentMean();
          that.query();
        }
      });
    },
    updateOpertor(row) {
      const that = this;
      const param = that.subForm;
      that.$axiosPost("/operator/updateOperator", param).then((resp) => {
        const data = resp.data;
        if (data) {
          if (data.status == "fail") {
            that.loading = false;
            that.$message.error(data.message);
            return;
          }
          that.dialog = false;
          that.getParentMean();
          that.query();
        }
      });
    },
    lodingAddDilog() {
      this.dialog = true;
      this.title = "新增操作员";
      this.subForm = {
        operatorName: "",
        meanuDesc: "",
        meanuLev: "",
        meanuText: "",
        meanuUrl: "",
        vaild: "",
      };
    },
    lodingEditDilog(row) {
      this.dialog = true;
      this.title = "编辑操作员";
      this.subForm = row;
    },
    exportFile() {
      const that = this;
      const param = {
        operatorLoginId: this.form.operatorLoginId,
        operatorName: this.form.operatorName,
        vaild: this.form.vaild,
        createTime: this.form.createTime,
      };
      that.$axiosPost("/operator/exportDataExcle", param).then((resp) => {
        if (resp.data) {
          const blod = new Blob([resp.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          if ("download" in document.createElement("a")) {
            const link = document.createElement("a");
            link.style.display = "none";
            link.download = resp.headers.filename;
            link.href = URL.createObjectURL(blod);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          }
        }
      });
    },
    authorize() {
      const that = this;
      var tData = this.$refs.tree.getCheckedNodes();
      var jsonArry = JSON.stringify(tData);
      const param = { treeData: jsonArry };
      that.$axiosPost("/right/addRight", param).then((resp) => {
        const data = resp.data;
        this.dialogVisible = false;
      });
    },
    clean(row) {
      this.form.operatorLoginId = "";
      this.form.operatorName = "";
      this.form.createTime = [new Date(), new Date()];
    },
    handleClose() {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要退出编辑吗？下次可继续编辑。")
        .then((_) => {
          this.loading = false;
          this.dialog = false;
        })
        .catch((_) => {});
    },
    handleAuthorizeDialogOpen(row) {
      this.dialogVisible = true;
      const that = this;
      const param = {};
      that.$axiosPost("/meanu/getMenuByOperator", param).then((resp) => {
        const data = resp.data;
        if (data) {
          that.meanuTreeData = data.data;
        }
      });
    },
    handleAuthorizeDialogClose(row) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getDepartment() {
      const that = this;
      const param = {};
      that.$axiosPost("/department/getDepartment", param).then((resp) => {
        const data = resp.data;
        if (data) {
          that.departmentList = data.data;
        }
      });
    },
    getRoleList() {
      const that = this;
      const param = {};
      that.$axiosPost("/role/getRoleList", param).then((resp) => {
        const data = resp.data;
        if (data) {
          that.roleList = data.data;
        }
      });
    },
    getParentMean() {
      const that = this;
      const param = {};
      that
        .$axiosPost("/meanu/getMenuByOperator", param)
        .then((resp) => {
          const data = resp.data;
          if (data) {
            that.meanuParentList = data.data;
          }
        });
    },
  },
};
</script>
<style>
</style>
