<template>
    <div class="product-list">
        <div>
            <el-button type="primary" @click="addProduct">添加商品</el-button>
        </div>
        <!-- 产品列表 start-->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" prop="id" label="商品ID"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="title" label="商品标题"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="image" label="商品图片"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="sellPoint" label="商品卖点"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="price" label="商品价格"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="cid" label="商品类目"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="num" label="商品库存"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="barcode" label="条形码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="status" label="状态"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="created" label="创建日期"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="updated" label="更新日期"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        @click="handleEdit(scope.$index, scope.row)"
                        circle
                    ></el-button>
                    <el-button
                        size="mini"
                        icon="el-icon-delete"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                        circle
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 产品列表 end-->
        <!-- 分页视图 start-->
        <ProdctPagination @onsend="getPagination" />
        <!-- 分页视图 end -->
        <!-- 添加产品对话框 start -->
        <el-dialog
            title="添加产品"
            :visible.sync="dialogAddProductVisible"
            width="80%"
            :before-close="handleClose"
        >
            <!--商品类目选择对话框 start-->
            <el-dialog
                width="60%"
                title="商品类目选择"
                :visible.sync="dialogProductCategoryVisible"
                append-to-body
            >
                <!-- 类目tree -->
                <el-tree
                    :load="loadTreeNodes"
                    :props="defaultProps"
                    lazy
                    highlight-current
                    @node-click="handleNodeClick"
                ></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addParamsHandler">确 定</el-button>
                </span>
            </el-dialog>
            <!--商品类目选择对话框 end-->
            <el-form ref="form" :model="product" label-width="80px">
                <el-form-item label="商品类目">
                    <el-button
                        style="float:left"
                        type="primary"
                        @click="productCategoryHandler"
                    >选择类目</el-button>
                    <span style="float:left;margin-left:10px;">{{ currentCategory && currentCategory.name }}</span>
                </el-form-item>
                <el-form-item label="商品标题">
                    <el-input v-model="product.title"></el-input>
                </el-form-item>
                <el-form-item label="商品卖点">
                    <el-input type="textarea" v-model="product.sellPoint"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="product.price"></el-input>
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input v-model="product.num"></el-input>
                </el-form-item>
                <el-form-item label="条形码"></el-form-item>
                <el-form-item label="商品图片">
                    <el-button @click="uploadHandler" style="float:left" type="primary">上传图片</el-button>
                    <!-- 上传图片的对话框 -->
                    <el-dialog
                        title="上传图片"
                        :visible.sync="dialogUploadImgVisible"
                        width="40%"
                        :before-close="handleClose"
                        append-to-body
                    >
                        <ProductUpload @onUpload="getUploadHandler" />
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogUploadImgVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogUploadImgVisible = false">确 定</el-button>
                        </span>
                    </el-dialog>
                    <img class="upload-img" v-if="uploadData.data" :src="uploadData.data" alt />
                </el-form-item>
                <el-form-item label="商品描述">
                    <ProductUEditor :productDesc="productDesc" @onProductDesc="getProductDesc" />
                </el-form-item>
            </el-form>
            <!-- 规格参数添加视图 start-->
            <div v-if="paramData && paramData.length>0">
                <div class="groupBox" v-for="(item,index) in paramData" :key="index">
                    <div>
                        <h3>{{item.value}}</h3>
                    </div>
                    <div>
                        <div v-for="(element,index) in item.children" :key="index">
                        <span>{{ element.childValue }}</span>
                            <el-input type="text" v-model="element.value"></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 规格参数添加视图 end-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddProductVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitProductHandler">提交</el-button>
            </span>
        </el-dialog>
        <!-- 添加产品对话框 end -->
    </div>
</template>
<script>
import ProdctPagination from "../ProductPagination";
import ProductUEditor from "../ProductUEditor";
import ProductUpload from "../ProductUpload";

export default {
    name: "ProductList",
    data() {
        return {
            tableData: [],
            dialogAddProductVisible: false, // 添加产品对话框管理
            product: {}, // 添加产品表单对象
            dialogProductCategoryVisible: false, //  商品类目选择对话框管理
            currentCategory: {}, // 类目最终数据
            dialogUploadImgVisible: false, // 上传图片对话框管理
            productDesc: "",
            paramsObj:{},
            paramData:[],
            updateFlagid: 0, // 修改商品的id
            uploadData: {},
            defaultProps: {
                children: "children",
                label: "name"
            }
        };
    },
    components: {
        ProdctPagination,
        ProductUEditor,
        ProductUpload
    },
    mounted() {
        this.http();
    },
    methods: {
        /* 查询数据的网路请求 */
        http() {
            this.$api
                .getSelectTbItemAllByPage({
                    page: 1
                })
                .then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.data.result;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        /* 产品编辑事件 */
        handleEdit(index, row) {
            // 预更新
            this.dialogAddProductVisible = true;
            this.$api.getPreUpdateItem({ itemId: row.id }).then(res => {
                console.log(res.data);
                this.product = res.data.data.item;
                this.productDesc = res.data.data.itemDesc;
                this.uploadData.data = res.data.data.item.image;
                this.currentCategory.name = res.data.data.itemCat;
                this.updateFlagid = res.data.data.item.id;
                this.paramData = JSON.parse(decodeURIComponent(res.data.data.itemParamItem));
            });
        },
        /* 产品删除事件 */
        handleDelete(index, row) {
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$api
                        .getDeleteItemById({ itemId: row.id })
                        .then(res => {
                            if (res.data.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.http();
                            } else {
                                this.$message({
                                    type: "error",
                                    message: "删除失败"
                                });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        /* 分页数据重新赋值 */
        getPagination(tableData) {
            this.tableData = tableData;
        },
        /* 添加产品 */
        addProduct() {
            this.dialogAddProductVisible = true;
        },
        /* 关闭对话框 */
        handleClose() {
            this.dialogAddProductVisible = false;
        },
        /* 商品类目点击事件 */
        productCategoryHandler() {
            this.dialogProductCategoryVisible = true;
            /* 获取类目列表 */
        },
        /**
         * 
         */
        addParamsHandler(){
            this.dialogProductCategoryVisible = false;
            // 获取规格参数数据
            this.$api.getSelectItemParamByItemCatId({id:this.paramsObj.id})
            .then(res => {
                if(res.data.status === 200){
                    this.paramData = JSON.parse(res.data.data.paramData)
                }else{
                    alert(res.data.msg)
                }
            })
            .catch(error =>{
                console.log(error);
            })
        },
        /* tree结构点击事件 */
        handleNodeClick(data) {
            this.paramsObj = data;
        },
        /* tree懒加载事件 */
        loadTreeNodes(node, resolve) {
            this.currentCategory = node.data;
            // 重新请求数据
            if (node.level === 0) {
                // 第一次调用
                this.$api.getSelectItemCategoryByParentId().then(res => {
                    if (res.status === 200) {
                        return resolve(res.data.data);
                    } else {
                        alert("请求失败");
                    }
                });
            }
            if (node.level >= 1) {
                // 点击之后触发
                this.$api
                    .getSelectItemCategoryByParentId({ id: node.data.id })
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
        /* 上传图片对话框事件 */
        uploadHandler() {
            this.dialogUploadImgVisible = true;
        },
        /* 获取上传图片的数据 */
        getUploadHandler(data) {
            this.uploadData = data;
        },
        /* 提交商品 */
        submitProductHandler() {
            this.dialogAddProductVisible = false;
            /* 添加和更新 */
            if (!this.updateFlagid) {
                // 添加
                this.$api
                    .getInsertTbItem({
                        title: this.product.title,
                        sellPoint: this.product.sellPoint,
                        price: this.product.price,
                        num: this.product.num,
                        cid: this.currentCategory.id,
                        desc: this.productDesc,
                        image: this.uploadData.data,
                        // 前后台交互，数据一定时字符串或者json格式，而不能是数组或者对象类型
                        itemParams:encodeURIComponent(JSON.stringify(this.paramData))
                    })
                    .then(res => {
                        if (res.data.status === 200) {
                            // 刷新页面
                            this.http();
                        } else {
                            alert(res.data.msg);
                        }
                    });
            } else {
                // 更新
                this.$api
                    .getUpdateProduct({
                        id: this.updateFlagid,
                        title: this.product.title,
                        sellPoint: this.product.sellPoint,
                        price: this.product.price,
                        num: this.product.num,
                        cid: this.currentCategory.id,
                        desc: this.productDesc,
                        image: this.uploadData.data,
                        itemParams:encodeURIComponent(JSON.stringify(this.paramData))
                    })
                    .then(res => {
                        if (res.data.status === 200) {
                            this.http();
                        } else {
                            alert(res.data.msg);
                        }
                    });
            }
        },
        /* 获取描述信息 */
        getProductDesc(data) {
            this.productDesc = data;
        }
    }
};
</script>
<style scoped>
.product-list {
    width: 1200px;
    margin: 0 auto;
    margin-top: 10px;
}
.upload-img {
    width: 200px;
    float: left;
    margin-left: 10px;
}
</style>