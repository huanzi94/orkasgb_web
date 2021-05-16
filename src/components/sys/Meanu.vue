<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item label="菜单名称">
            <el-input v-model="form.meanuName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="菜单编号">
            <el-input v-model="form.meanuNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否有效">
            <el-select
              v-model="form.vaild"
              placeholder=""
              style="margin-left: 20px"
            >
              <el-option
                v-for="item in options"
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
    <el-row :gutter="10">
      <el-col :span="4">
        <el-form-item label="菜单名称">
          <el-input v-model="form.meanuName"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-form-item label="菜单编号">
          <el-input v-model="form.meanuNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="是否有效">
          <el-select
            v-model="form.vaild"
            placeholder=""
            style="margin-left: 20px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button
          size="small"
          icon="el-icon-folder-add"
          style="text-align: left"
          type="primary"
          @click="addOrEdit(true, null)"
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
        <el-table :data="meanuData" border style="width: 100%">
          <el-table-column
            v-for="(col, index) in cols"
            :id="col"
            :key="index"
            :label="col.label"
            :prop="col.prop"
            fixed
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                content="编辑菜单"
                effect="dark"
                placement="top-start"
              >
                <el-button
                  circle
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                  @click="addOrEdit(false, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                content="删除菜单"
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
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-drawer
      ref="drawer"
      :visible.sync="dialog"
      direction="rtl"
      size="50%"
      show-close="false"
      :with-header="false"
    >
      <div class="demo-drawer__content">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>{{ title }}</span>
            <el-button
            v-if="subForm == null"
              style="float: right; padding: 3px 0"
              type="text"
              @click="addMean"
              >保存</el-button
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="editMean"
              >保存</el-button
            >
          </div>
          <div class="text item">
            <el-form ref="subForm" :model="subForm" label-width="80px">
              <el-form-item label="菜单名称">
                <el-input v-model="subForm.meanuName"></el-input>
              </el-form-item>
              <el-form-item label="菜单地址">
                <el-input v-model="subForm.meanuUrl"></el-input>
              </el-form-item>
              <el-form-item label="菜单描述">
                <el-input v-model="subForm.meanuDesc"></el-input>
              </el-form-item>
              <el-form-item label="菜单等级">
                <el-input v-model="subForm.meanuLev"></el-input>
              </el-form-item>
              <el-form-item label="父级菜单">
                <el-select
                  v-model="subForm.meanuParentNo"
                  placeholder=""
                  style="margin-left: 20px"
                >
                  <el-option label="空" value="" v-show="subForm.meanuLev == 1">
                  </el-option>
                  <el-option
                    v-for="item in meanuParentList"
                    :key="item.value"
                    :label="item.meanuName"
                    :value="item.meanuNo"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="有效">
                <el-select v-model="subForm.vaild" placeholder="">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="菜单图标">
                <el-input v-model="subForm.meanuIcon"></el-input>
              </el-form-item>
              <el-form-item label="菜单组件">
                <el-input v-model="subForm.component"></el-input>
              </el-form-item>
              <el-form-item label="组件路径">
                <el-input v-model="subForm.path"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="subForm.meanuText"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { Message } from "element-ui";

export default {
  data() {
    return {
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
        meanuName: "",
        meanuNo: "",
        vaild: "",
        createTime: [new Date(), new Date()],
      },
      subForm: {
        meanuNo: "",
        meanuName: "",
        meanuDesc: "",
        meanuLev: "",
        meanuParentName: "",
        meanuParentNo: "",
        meanuText: "",
        meanuUrl: "",
        vaild: "",
        meanuIcon: "",
        component: "",
        path: "",
      },
      meanuData: [],
      meanuParentList: [],
      cols: [
        { prop: "meanuNo", label: "菜单编号" },
        { prop: "meanuName", label: "菜单名称" },
        { prop: "meanuDesc", label: "菜单描述" },
        { prop: "meanuLev", label: "菜单等级" },
        { prop: "meanuParentNo", label: "父级菜单编号" },
        { prop: "meanuParentName", label: "父级菜单名称" },
        { prop: "meanuText", label: "菜单备注" },
        { prop: "createTime", label: "创建时间" },
        { prop: "meanuUrl", label: "菜单地址" },
        { prop: "vaild", label: "有效标志" },
        { prop: "meanuIcon", label: "菜单图标" },
        { prop: "component", label: "菜单组件" },
        { prop: "name", label: "组件名称" },
        { prop: "path", label: "组件路径" },
      ],
      options: [
        {
          value: "1",
          label: "有效",
        },
        {
          value: "0",
          label: "无效",
        },
      ],
      table: false,
      dialog: false,
      loading: false,
    };
  },
  mounted() {
    this.getParentMean();
  },
  methods: {
    query() {
      const that = this;
      const param = {
        meanuName: this.form.meanuName,
        meanuNo: this.form.meanuNo,
        vaild: this.form.vaild,
        startTime: null == this.form.createTime ? "" : this.form.createTime[0],
        endTime: null == this.form.createTime ? "" : this.form.createTime[1],
      };
      that
        .$axiosPost("/meanu/getMeanuList", param)
        .then((resp) => {
          if (resp) {
            that.meanuData = resp.data.data;
            Message.success(resp.data.message);
          }
        });
    },
    remove(row) {
      const that = this;
      const param = {
        meanuNo: row.meanuNo,
      };
      that
        .$axiosPost("/meanu/deleteMeanu", param)
        .then((resp) => {
          if (resp) {
            that.$message.success(resp.data.message);
            that.getParentMean();
            that.query();
          }
        });
    },
    add(row) {
      const that = this;
      that
        .$axiosPost("/meanu/addMean", that.subForm)
        .then((resp) => {
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
    addMean() {
      this.dialog = true;
        this.title = "新增菜单";
        this.subForm = {
          meanuName: "",
          meanuDesc: "",
          meanuLev: "",
          meanuText: "",
          meanuUrl: "",
          vaild: "",
        };
    },
    editMean(row) {
      this.dialog = true;
        this.title = "编辑菜单";
        this.subForm = row;
      }
    },
    exportFile() {
      const that = this;
      const param = {
        meanuName: this.form.meanuName,
        meanuNo: this.form.meanuNo,
        vaild: this.form.vaild,
        createTime: this.form.createTime,
      };
      that
        .$axiosPost("/meanu/exportDataExcle", param)
        .then((resp) => {
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
    clean(row) {
      this.form.meanuName = "";
      this.form.meanuNo = "";
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
};
</script>
<style>
</style>
