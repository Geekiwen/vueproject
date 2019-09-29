<template>
    <div>
        <el-pagination
            background
            layout="prev, pager, next"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="1000"
        ></el-pagination>
    </div>
</template>
<script>
export default {
    name: "Pagination",
    data() {
        return {
            currentPage: 1,
            tableData:[]
        };
    },
    methods: {
        handleCurrentChange(currentPage) {
            this.$api.getSelectTbItemAllByPage({ page: currentPage }).then(res => {
                if(res.data.status === 200){
                    this.tableData = res.data.data.result;
                    this.$emit("onsend", this.tableData);
                }else{
                    alert(res.data.msg);
                    this.currentPage = 1;
                }
            });
        }
    }
};
</script>