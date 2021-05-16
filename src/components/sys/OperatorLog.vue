<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="4"
        >
          <el-form-item label="操作员">
            <el-input v-model="form.operator"></el-input>
          </el-form-item
          >
        </el-col>

        <el-col :span="8"
        >
          <el-form-item label="关键词或短语" label-width="100px">
            <el-input v-model="form.results"></el-input>
          </el-form-item
          >
        </el-col>
        <el-col :span="8"
        >
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="form.operationTime"
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
          </el-form-item
          >
        </el-col>
        <el-col :span="4"
        >
          <el-button icon="el-icon-search" type="primary" @click="query"
          >查询
          </el-button
          >
          <el-button icon="el-icon-search" type="warning" @click="clean"
          >清除
          </el-button
          >
        </el-col>
      </el-row>
    <el-row>
      <el-col :span="4">
        <el-button
          size="small"
          icon="el-icon-download"
          style="text-align: left"
          type="primary"
          @click="exportFile"
        >导出
        </el-button
        >
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col>
        <el-table :data="logData" border style="width: 100%">
          <el-table-column
            v-for="(col, index) in cols"
            :id="col"
            :key="index"
            :label="col.label"
            :prop="col.prop"
            stripe="true    "
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
</el-form>
    <el-drawer
      ref="drawer"
      :before-close="handleClose"
      :title="title"
      :visible.sync="dialog"
      custom-class="demo-drawer"
      direction="rtl"
      size="50%"
    >
      <div class="demo-drawer__content">
        <el-row>
          <el-col :span="24"
          >
            <div class="grid-content bg-purple" style="text-align: center">
              <el-card class="box-card">
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
                    <el-form-item label="备注">
                      <el-input v-model="subForm.meanuText"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="handleClose">取 消</el-button>
                      <el-button
                        :loading="loading"
                        type="primary"
                        @click="add"
                      >{{ loading ? "提交中 ..." : "确 定" }}
                      </el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import {Message} from "element-ui";

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
        operator: "",
        results: "",
        operationTime: [new Date(), new Date()],
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
        meanuIcon: ""
      },
      logData: [],
      meanuParentList: [],
      cols: [
        {prop: "operator", label: "操作员"},
        {prop: "className", label: "操作类"},
        {prop: "method", label: "操作方法"},
        {prop: "arguments", label: "参数"},
        {prop: "operationTime", label: "操作时间"},
        {prop: "results", label: "操作结果"}
      ],
      table: false,
      dialog: false,
      loading: false,
    };
  },
  methods: {
    query() {
      const that = this;
      const param = {
        operator: this.form.operator,
        results: this.form.results,
        operationTime: this.form.operationTime,
      };
      that.$axiosPost("/log/getLogInfo", param).then((resp) => {
        if (resp) {
          that.logData = resp.data.data.content;
          Message.success(resp.data.message);
        }
      });
    },
    remove(row) {
      const that = this;
      const param = {
        meanuNo: row.meanuNo,
      };
      that.$axiosPost("/mean/deleteMeanu", param).then((resp) => {
        if (resp) {
          that.$message.success(resp.data.message);
          that.getParentMean();
          that.query();
        }
      });
    },
    addOrEdit(isAdd, row) {
      this.dialog = true;
      if (isAdd) {
        this.title = "新增菜单";
        this.subForm = {
          meanuName: "",
          meanuDesc: "",
          meanuLev: "",
          meanuText: "",
          meanuUrl: "",
          vaild: "",
        };
      } else {
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
        operationTime: this.form.operationTime,
      };
      that.$axiosPost("/mean/exportDataExcle", param).then((resp) => {
        if (resp.data) {
          const blod = new Blob([resp.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
          if ('download' in document.createElement('a')) {
            const link = document.createElement('a');
            link.style.display = 'none';
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
      this.form.operationTime = [new Date(), new Date()];
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
        .catch((_) => {
        });
    }
  },
};
</script>
<style>
</style>
