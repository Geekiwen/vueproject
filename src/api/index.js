import axios from "../utils/http"
import base from "./base"

const api = {
    getLogin(params){
        return axios.post(base.baseUrl + base.login ,params);
    },
    /**
     * 获取查询商品 接口
     */
    getSelectTbItemAllByPage(params){
        return axios.get(base.egoBaseUrl + base.selectTbItemAllByPage,{
            params:params
        })
    },
    /**
     * 商品类目 接口
     */
    getSelectItemCategoryByParentId(params){
        return axios.get(base.egoBaseUrl + base.selectItemCategoryByParentId,{
            params:params
        })
    },
    /**
     * 添加产品 接口
     */
    getInsertTbItem(params){
        return axios.get(base.egoBaseUrl + base.insertTbItem,{
            params:params
        })
    },
    /**
     * 删除产品 接口
     */
    getDeleteItemById(params){
        return axios.get(base.egoBaseUrl + base.deleteItemById,{
            params:params
        })
    },
    /**
     * 预更新接口
     */
    getPreUpdateItem(params){
        return axios.post(base.egoBaseUrl + base.preUpdateItem,params);
    },
    /**
     * 更新茶品 接口
     */
    getUpdateProduct(params){
        return axios.get(base.egoBaseUrl + base.updateProduct,{
            params:params
        })
    },
    /**
     * 规格参数 查询
     */
    getSelectItemParamAll(){
        return axios.get(base.egoBaseUrl + base.selectItemParamAll);
    },
    /**
     * 规格参数 添加 POST 
     */
    getInsertItemParam(params){
        return axios.post(base.egoBaseUrl + base.insertItemParam,params)
    },
    /**
     * 规格参数 删除
     */
    getDeleteItemParamById(params){
        return axios.get(base.egoBaseUrl + base.deleteItemParamById,{
            params:params
        })
    },
    /**
     * 规格参数获取(id)
     */
    getSelectItemParamByItemCatId(params){
        return axios.get(base.egoBaseUrl + base.selectItemParamByItemCatId + "/"+params.id);
    },
    /**
     * 内容分类管理 查询
     */
    getSelectContentCategoryByParentId(params){
        return axios.post(base.contentBaseUrl + base.selectContentCategoryByParentId,params);
    },
    /**
     * 内容分类管理  添加
     */
    getInsertContentCategory(params){
        return axios.post(base.contentBaseUrl + base.insertContentCategory,params);
    },
    /**
     * 内容分类管理 修改
     */
    getUpdateContentCategory(params){
        return axios.post(base.contentBaseUrl + base.updateContentCategory,params);
    },
    /**
     * 删除接口
     */
    getDeleteContentCategoryById(params){
        return axios.post(base.contentBaseUrl + base.deleteContentCategoryById,params);
    },
    /**
     * 内容管理 查询
     */
    getSelectTbContentAllByCategoryId(params){
        return axios.post(base.contentBaseUrl + base.selectTbContentAllByCategoryId,params);
    },
    /**
     * 内容管理 添加
     */
    getInsertTbContent(params){
        return axios.post(base.contentBaseUrl + base.insertTbContent,params);
    },
    /**
     * 内容管理 删除
     */
    getDeleteContentByIds(params){
        return axios.post(base.contentBaseUrl + base.deleteContentByIds,params);
    }
}

export default api;