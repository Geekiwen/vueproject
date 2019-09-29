<template>
    <div>
        <el-tree
            :props="defaultProps"
            :load="loadTreeNodes"
            lazy
            highlight-current
            :render-content="renderContent"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
        ></el-tree>
        <!-- 添加 -->
        <el-dialog
            title="添加名称"
            :visible.sync="categoryVisible"
            width="30%"
            :before-close="handleClose"
        >
            <span>
                <el-input v-model="categoryName" placeholder="请添加分类名称"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="categoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureHandler">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog
            title="修改名称"
            :visible.sync="updateCategoryVisible"
            width="30%"
            :before-close="handleClose"
        >
            <span>
                <el-input v-model="updateCategoryName" placeholder="请输入新的名称"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateCategoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureUpdateHandler">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "Category",
    inject:  ['reload'],
    data() {
        return {
            defaultProps: {
                children: "children",
                label: "name"
            },
            categoryVisible: false,
            categoryName: "",
            updateCategoryVisible:false,
            updateCategoryName:"",
            addCategoryObj:{},
            updateCategoryObj:{},
            node:null,
            resolve:null
        };
    },
    methods: {
        loadTreeNodes(node, resolve) {
            this.node = node;
            this.resolve = resolve;
            if (node.level === 0) {
                // 第一次调用
                this.$api
                    .getSelectContentCategoryByParentId()
                    .then(res => {
                        if (res.status === 200) {
                            return resolve(res.data.data);
                        }
                    })
                    .catch(error => {
                        resolve([]);
                    });
            }
            if (node.level >= 1) {
                // 点击之后触发
                this.$api
                    .getSelectContentCategoryByParentId({ id: node.data.id })
                    .then(res => {
                        if (res.status === 200) {
                            return resolve(res.data.data);
                        }
                    })
                    .catch(error => {
                        resolve([]);
                    });
            }
        },
        handleNodeClick(data) {
            this.$emit("onContentId",data)
        },
        renderContent(h, { node, data, store }) {
            return (
                <span class="custom-tree-node">
                    <span>{node.label}</span>
                    <span>
                        <el-button
                            size="mini"
                            type="text"
                            on-click={() => this.append(node, data)}
                        >
                            添加
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            on-click={() => this.remove(node, data)}
                        >
                            删除
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            on-click={() => this.update(node, data)}
                        >
                            修改
                        </el-button>
                    </span>
                </span>
            );
        },
        append(node, data) {
            this.addCategoryObj = data;
            this.categoryVisible = true;
        },
        update(node, data) {
            this.updateCategoryObj = data;
            this.updateCategoryVisible = true;
        },
        remove(node, data) {
             this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$api
                        .getDeleteContentCategoryById({
                            categoryId:data.id
                        })
                        .then(res => {
                            if (res.data.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功"
                                });
                                this.reload();
                                // this.loadTreeNodes(this.node,this.resolve);
                            } else {
                                this.$message({
                                    type: "error",
                                    message: "删除失败"
                                });
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        handleClose() {
            this.categoryVisible = false;
            this.updateCategoryVisible = false;
        },
        /* 添加 */
        sureHandler() {
            this.$api.getInsertContentCategory({
                parentId:this.addCategoryObj.id,
                name:this.categoryName
            }).then(res => {
                console.log(res.data);
                if(res.data.status === 200){
                    alert("添加成功")
                    this.reload();
                    // this.loadTreeNodes(this.node,this.resolve);
                    this.categoryVisible = false;
                }else{
                    alert("添加失败")
                }
            }).catch(error =>{
                console.log(error);
            })
        },
        /* 修改 */
        sureUpdateHandler(){
            this.$api.getUpdateContentCategory({
                name:this.updateCategoryName,
                id:this.updateCategoryObj.id
            }).then(res => {
                if(res.data.status === 200){
                    this.reload();
                    // this.loadTreeNodes(this.node,this.resolve);
                    this.updateCategoryVisible = false;
                }else{
                    alert("修改失败")
                }
            })
        }
    }
};
</script>