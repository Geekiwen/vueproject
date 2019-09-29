<template>
    <div>
        <el-button
            class="addBtn"
            @click="addDialogVisible = true"
            type="primary"
            v-if="addBtnShow"
        >添加{{ addContent }}</el-button>
        <el-table stripe :data="Contents" style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" width="40"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="title" label="标题"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="subTitle" label="子标题"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="content" label="描述"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="url" label="连接"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="pic" label="图片"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="created" label="创建日期"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="updated" label="更新日期"></el-table-column>
            <el-table-column prop="updateProduct" label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                        icon="el-icon-delete"
                        circle
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加弹出框 -->
        <el-dialog
            title="添加内容"
            :visible.sync="addDialogVisible"
            width="60%"
            :before-close="handleClose"
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="子标题">
                    <el-input v-model="form.subTitle" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.content" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="URL">
                    <el-input v-model="form.url" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="图片上传">
                    <el-button @click="uploadDialogVisible = true">上传图片</el-button>
                    <el-dialog
                        append-to-body
                        title="上传图片"
                        :visible.sync="uploadDialogVisible"
                        width="30%"
                        :before-close="handleClose"
                    >
                        <el-upload
                            ref="upload"
                            class="upload-demo"
                            action="/product_api/file/upload"
                            :limit="1"
                            :auto-upload="false"
                            :on-success="uploadHandler"
                        >
                            <el-button slot="trigger" size="small" type="primary" round>添加图片</el-button>
                            <el-button
                                style="margin-left: 10px;"
                                size="small"
                                type="success"
                                round
                                @click="submitUpload"
                            >
                                上传
                                <i class="el-icon-upload el-icon--right"></i>
                            </el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="uploadDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="uploadDialogVisible = false">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-form-item>
                <el-form-item label="内容">
                    <vue-ueditor-wrap v-model="formDesc" :config="myConfig"></vue-ueditor-wrap>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisibleHandler">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "Content",
    inject:  ['reload'],
    data() {
        return {
            Contents: [],
            addDialogVisible: false,
            addBtnShow: false,
            addContent: "",
            form: {},
            formDesc: "",
            uploadDialogVisible: false,
            myConfig: {
                autoHeightEnabled: false,
                initialFrameHeight: 240,
                initialFrameWidth: "100%",
                UEDITOR_HOME_URL: "/UEditor/"
            }
        };
    },
    props: {
        currentId: {
            type: Object,
            required: true
        }
    },
    watch: {
        currentId(value, oldValue) {
            this.addBtnShow = !value.isParent;
            this.addContent = value.name;
            this.$api
                .getSelectTbContentAllByCategoryId({ categoryId: value.id })
                .then(res => {
                    if (res.data.status === 200) {
                        this.Contents = res.data.data.result;
                    } else {
                        this.Contents = [];
                        alert(res.data.msg);
                    }
                });
        }
    },
    methods: {
        handleDelete(index, row) {
            this.$api.getDeleteContentByIds({
                ids:row.id
            }).then(res => {
                if(res.data.status === 200){
                    alert("删除成功")
                    this.reload();
                }else{
                    alert("删除失败")
                }
            })
        },
        handleClose() {
            this.addDialogVisible = false;
        },
        /**
         * 添加事件
         */
        addDialogVisibleHandler(){
            this.$api.getInsertTbContent({
                categoryId:this.currentId.id,
                title:this.form.title,
                subTitle:this.form.subTitle,
                url:this.form.url,
                pic:this.form.pic,
                content:this.form.content,
                titleDesc:this.form.titleDesc
            }).then(res => {
                if(res.data.status === 200){
                    this.addDialogVisible = false;
                    this.reload();
                }
            })
        },
        /**
         * 上传功能
         */
        submitUpload(){
            this.$refs.upload.submit();
        },
        uploadHandler(){

        }
    }
};
</script>
<style scoped>
</style>