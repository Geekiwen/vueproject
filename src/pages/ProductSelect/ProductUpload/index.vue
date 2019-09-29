<template>
    <div>
        <el-upload
            ref="upload"
            class="upload-demo"
            action="/ego_api/file/upload"
            :limit="1"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
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
    </div>
</template>
<script>
export default {
    name: "ProductUpload",
    data() {
        return {
            fileList: []
        };
    },
    methods: {
        handlePreview() {},
        handleRemove() {},
        uploadHandler(response, file, fileList) {
            this.$emit("onUpload",response)
        },
        submitUpload(){
            this.$refs.upload.submit();
        }
    }
};
</script>
<style scoped>
</style>