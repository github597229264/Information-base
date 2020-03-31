/**
 * 自由选择产品属性进行组合(SKU)
 * @type {{
 * initSKU: 初始化得到结果集,
 * getObjKeys: 获得对象的key,
 * combInArray: 从数组中生成指定长度的组合,
 * getCombFlags: 得到从 m 元素中取 n 元素的所有组合,
 * add2SKUResult: 把组合的key放入结果集SKUResult,
 * changeValue: 选中的属性编号转换为对应的属性名,
 * showAttr: 显示产品属性,
 * shoppingCar: 加入购物车,
 * initUserChioce: 初始化用户选择事件
 * }}
 */
var ProAttrGroup={
    //保存最后的组合结果信息
    SKUResult:{},
    //选中的组合
    chioceAttrData:[],
    /*
     * 选出 有效的产品属性组合 中价格最低的一组数据
     */
    minPriceGroup:function(obj){
        var minPrice=999999999999;//最低价格
        var minPriceKey="";//最低价格对应的key对象
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj){
            if (Object.prototype.hasOwnProperty.call(obj, key)){
                if(minPrice >= parseInt(obj[key].prestore)){
                    minPrice=parseInt(obj[key].prestore);
                    minPriceKey=key;
                }else{
                    minPrice=minPrice;
                }
            }
        }
        //设置默认价格
        var minGroup= obj[minPriceKey];
        $('#money').text("￥ "+minGroup.prestore);
        $("#count").text(minGroup.stock);
        $("#price").text(minGroup.currentPrice);
        $('#commission').text(minGroup.commission);
    },
    /*
     * 初始化得到结果集
     */
    initSKU:function(data) {
        var i, j, skuKeys = ProAttrGroup.getObjKeys(data);
        for (i = 0; i < skuKeys.length; i++) {
            var skuKey = skuKeys[i];//一条SKU信息key
            var sku = data[skuKey];	//一条SKU信息value
            var skuKeyAttrs = skuKey.split("-"); //SKU信息key属性值数组
            skuKeyAttrs.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
            });
            //对每个SKU信息key属性值进行拆分组合
            var combArr = ProAttrGroup.combInArray(skuKeyAttrs);
            for (j = 0; j < combArr.length; j++) {
                ProAttrGroup.add2SKUResult(combArr[j], sku);
            }
            //结果集接放入SKUResult
            ProAttrGroup.SKUResult[skuKeyAttrs.join("-")] = {
                stock: sku.stock,
                prestore: [sku.prestore],
                currentPrice: [sku.currentPrice],
                commission: [sku.commission]
            }
        }
    },
    /*
     * 获得对象的key
     */
    getObjKeys:function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj){
            if (Object.prototype.hasOwnProperty.call(obj, key)){
                keys[keys.length] = key;
            }
        }
        return keys;
    },
    /*
     * 从数组中生成指定长度的组合
     * 方法: 先生成[0,1...]形式的数组,
     * 然后根据0,1从原数组取元素，得到组合数组
     */
    combInArray:function(aData) {
        if (!aData || !aData.length) {
            return [];
        }
        var len = aData.length;
        var aResult = [];
        for (var n = 1; n < len; n++) {
            var aaFlags = ProAttrGroup.getCombFlags(len, n);
            while (aaFlags.length) {
                var aFlag = aaFlags.shift();
                var aComb = [];
                for (var i = 0; i < len; i++) {
                    aFlag[i] && aComb.push(aData[i]);
                }
                aResult.push(aComb);
            }
        }
        return aResult;
    },
    /**
     * 得到从 m 元素中取 n 元素的所有组合
     * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
     */
    getCombFlags:function(m, n) {
        if (!n || n < 1) {
            return [];
        }
        var aResult = [];
        var aFlag = [];
        var bNext = true;
        var i, j, iCnt1;
        for (i = 0; i < m; i++) {
            aFlag[i] = i < n ? 1 : 0;
        }
        aResult.push(aFlag.concat());
        while (bNext) {
            iCnt1 = 0;
            for (i = 0; i < m - 1; i++) {
                if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
                    for (j = 0; j < i; j++) {
                        aFlag[j] = j < iCnt1 ? 1 : 0;
                    }
                    aFlag[i] = 0;
                    aFlag[i + 1] = 1;
                    var aTmp = aFlag.concat();
                    aResult.push(aTmp);
                    if (aTmp.slice(-n).join("").indexOf('0') == -1) {
                        bNext = false;
                    }
                    break;
                }
                aFlag[i] == 1 && iCnt1++;
            }
        }
        return aResult;
    },
    /*
     * 把组合的key放入结果集SKUResult
     * 此方法中的属性根据有效的产品属性组合的属性而定
     */
    add2SKUResult:function(combArrItem,sku) {
        var key = combArrItem.join("-");
        if (ProAttrGroup.SKUResult[key]) {//SKU信息key属性·
            ProAttrGroup.SKUResult[key].stock += sku.stock;
            ProAttrGroup.SKUResult[key].prestore.push(sku.prestore);
            ProAttrGroup.SKUResult[key].currentPrice.push(sku.currentPrice);
            ProAttrGroup.SKUResult[key].commission.push(sku.commission);

        } else {
            ProAttrGroup.SKUResult[key] = {
                stock: sku.stock,
                prestore: [sku.prestore],
                currentPrice: [sku.currentPrice],
                commission: [sku.commission]
            };
        }
    },
    /*
     * 选中的属性编号转换为对应的属性名
     * @params dataSoure 展示的产品属性
     * @params chioceVals 选中的产品属性
     */
    changeValue:function(dataSoure, chioceVals) {
        var valString = "";
        for (var ks in dataSoure) {
            for (var s in dataSoure[ks]) {
                $.each(chioceVals, function (index, element) {
                    if (dataSoure[ks][s].valueId == element) {
                        valString += dataSoure[ks][s].propertyValue + " ";
                    }
                });
            }
        }
        return valString;
    },
    /*
     * 显示产品属性
     * @params chioceVals 展示的产品属性
     * TODO 此处需要另外修改
     */
    showAttr:function(dataSoure){
        var html="";
        $.each(dataSoure, function (index1, element1) {
            html+='<div class="color"><span class="color_name">'+element1[0].propertyName+'：</span>';
            $.each(element1, function (index2, element2) {
                html+='<input type="button"  class="sku" attr_id="'+element2.valueId+'" value="'+element2.propertyValue+'"/>&nbsp;&nbsp;';
            });
            html+='<br><br></div><br>';
        });
        //插入到指定元素的前面
        $("#product_shuxing").prepend(html);
    },
    /*
     * 加入购物车
     */
    shoppingCar:function(showData){
        $("#img").bind("click",function(){
            var chioceReture="";
            if(ProAttrGroup.chioceAttrData!=null && ProAttrGroup.chioceAttrData.length<showData.length){
                alert("请选择属性");
                return;
            }else{
                for (var lm in ProAttrGroup.chioceAttrData) {
                    if (lm <= ProAttrGroup.chioceAttrData.length - 1) {
                        chioceReture += ProAttrGroup.chioceAttrData[lm] + " ";
                    }
                }
                alert("选择的套餐是:"+ProAttrGroup.changeValue(showData,ProAttrGroup.chioceAttrData))
                jump('gatherUserInfo.html');
            }
        })
    },
    /*
     * 初始化用户选择事件
     */
    initUserChioce:function(data,showData){
        //展示产品的所有属性组
        ProAttrGroup.showAttr(showData);
        ProAttrGroup.initSKU(data);
        $('.sku').each(function () {
            var self = $(this);
            var attr_id = self.attr('attr_id');
            if (!ProAttrGroup.SKUResult[attr_id]) {
                self.attr('disabled', 'disabled');
            }
        }).click(function () {
            var self = $(this);
            //选中自己，兄弟节点取消选中
            self.toggleClass('bh-sku-selected').siblings().removeClass('bh-sku-selected');
            //已经选择的节点
            var selectedObjs = $('.bh-sku-selected');
            if (selectedObjs.length) {
                //获得组合key价格
                var selectedIds = [];
                selectedObjs.each(function () {
                    selectedIds.push($(this).attr('attr_id'));
                });
                //选择的属性编号按顺序排列
                selectedIds.sort(function (value1, value2) {
                    return parseInt(value1) - parseInt(value2);
                });
                var len = selectedIds.length;

                var prices = ProAttrGroup.SKUResult[selectedIds.join("-")].prestore;
                var count = ProAttrGroup.SKUResult[selectedIds.join("-")].stock;
                var maxPrice = Math.max.apply(Math, prices);
                var minPrice = Math.min.apply(Math, prices);
                var priceVal = maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice;

                var money = ProAttrGroup.SKUResult[selectedIds.join("-")].currentPrice;
                var maxMoney = Math.max.apply(Math, money);
                var minMoney = Math.min.apply(Math, money);
                var moneyVal = maxMoney > minMoney ? minMoney + "-" + maxMoney : maxMoney;

                var commission = ProAttrGroup.SKUResult[selectedIds.join("-")].commission;
                var maxCommission = Math.max.apply(Math, commission);
                var minCommission = Math.min.apply(Math, commission);
                var CommissionVal = maxCommission > minCommission ? minCommission + "-" + maxCommission : maxCommission;

                $('#price').text("￥ "+priceVal);//显示对应组合的价格 TODO
                $('#money').text(moneyVal);//显示对应组合的预存款 TODO
                $('#commission').text(CommissionVal);//显示对应组合的佣金 TODO

                var chioceVal = "";
                for (var lm in selectedIds) {
                    if (lm <= selectedIds.length - 1) {
                        chioceVal += selectedIds[lm] + " ";
                    }
                }
                ProAttrGroup.chioceAttrData=selectedIds;
                //选中的属性编号转换为对应的属性名 TODO
                $("#chioce").text(ProAttrGroup.changeValue(showData, selectedIds));
                $("#count").text(count);//显示对应组合的库存 TODO
                //用已选中的节点验证待测试节点 underTestObjs
                $(".sku").not(selectedObjs).not(self).each(function () {
                    var siblingsSelectedObj = $(this).siblings('.bh-sku-selected');
                    var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                    if (siblingsSelectedObj.length) {
                        var siblingsSelectedObjId = siblingsSelectedObj.attr('attr_id');
                        for (var i = 0; i < len; i++) {
                            (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                        }
                    } else {
                        testAttrIds = selectedIds.concat();
                    }
                    testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
                    //选择的属性编号按顺序排列
                    testAttrIds.sort(function (value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    if (!ProAttrGroup.SKUResult[testAttrIds.join("-")]) {
                        $(this).attr('disabled', 'disabled').removeClass('bh-sku-selected');
                    } else {
                        $(this).removeAttr('disabled');
                    }
                });
            } else {
                //初始化产品默认信息
                var minGroup= ProAttrGroup.minPriceGroup(data);
                //设置属性状态
                $('.sku').each(function () {
                    ProAttrGroup.SKUResult[$(this).attr('attr_id')] ? $(this).removeAttr('disabled') : $(this).attr('disabled', 'disabled').removeClass('bh-sku-selected');
                })
            }
        });
    }
};
