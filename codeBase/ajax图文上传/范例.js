/**
 * 产品管理模块
 * @author 黄星辉
 */
ws.product = {
    /*
     * 添加产品基本信息(图文信息)--ajaxFileupload上传
     * @param imgList 图片数组(文件域id数组)如:['fileId1','fileId12']
     * @param data 产品对象 如:{"param1":"paramValue1","param2":"paramValue2"}
     * @param callback 回调函数
     * @author 黄星辉
     */
    addProductBasicInfo : function(imgList,data,callback) {
         window.parent.openLoading();
        $.ajaxFileUpload({
            type : "POST",//当要提交自定义参数时，这个参数要设置成post
            url : __WS_ADDR__ + '/product/addMobileInfo',//上传处理程序地址。
            secureuri:false,//是否启用安全提交，默认为false。
            fileElementId : imgList,// 需要上传的文件域的ID，即<input type="file">的ID。上传多个文件是['文件域id1','文件域id2'],
            dataType:"json",//服务器返回的数据类型。可以为xml,script,json,html。如果不填写，jQuery会自动判断
            data : data,//自定义参数。这个东西比较有用，当有数据是与上传的图片相关的时候，这个东西就要用到了
            headers : ws.getAuthHeader(),
            success : function(ret) //提交成功后自动执行的处理函数，参数data就是服务器返回的数据。
            {   
                window.parent.closeLoading();
                if (callback && callback.success) {
                    callback.success(ret);
                }
            },
            error : function(xhr, ajaxOptions, thrownError) //提交失败自动执行的处理函数。
            {
                window.parent.closeLoading();
                if (callback && callback.error) {
                    callback.error(xhr, ajaxOptions, thrownError);
                }
            },
            beforeSend : function() {
                window.parent.openLoading();
            },
            complete : function() {
                window.parent.closeLoading();
            }
        });
    }
};