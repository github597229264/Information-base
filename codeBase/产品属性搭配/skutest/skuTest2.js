/**
 * 产品属性关键价格 SKU 2015/4/24.
 */
    
//TODO 展示的产品属性
var showData = [
    [
        {"attrName":"颜色","key": '00', "value": '白色'},
        {"attrName":"颜色","key": '01', "value": '金色'}
    ],
    [
        {"attrName":"内存","key": '10', "value": '16G'},
        {"attrName":"内存","key": '11', "value": '32G'}
    ],
    [
        {"attrName":"运营商","key": '20', "value": '移动'},
        {"attrName":"运营商","key": '21', "value": '电信'},
        {"attrName":"运营商","key": '22', "value": '联通'}
    ],
    [
        {"attrName":"网络制式","key": '30', "value": '4G'},
        {"attrName":"网络制式","key": '31', "value": '3G'}
    ],
    [
        {"attrName":"投送方式","key": '40', "value": '一次投送'},
        {"attrName":"投送方式","key": '41', "value": '分月投送'}
    ]
];
//TODO 有效的产品属性组合
var data = {
    "00;10;21;30;40": {
        money: 200,
        price: 366.00,
        count: 45
    },
    "00;11;21;31;40": {
        money: 300,
        price: 306.00,
        count: 45
    },
    "01;11;20;30;41": {
        money: 300,
        price: 496,
        count: 66
    },
    "01;11;20;30;40": {
        money: 300,
        price: 496,
        count: 66
    }
};

//保存最后的组合结果信息
var SKUResult = {};
//选中的组合
var chioceAttrData=[];
/*
 * 初始化得到结果集
 */
function initSKU() {
    var i, j, skuKeys = getObjKeys(data);
    for (i = 0; i < skuKeys.length; i++) {
        var skuKey = skuKeys[i];//一条SKU信息key
        var sku = data[skuKey];	//一条SKU信息value
        var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
        skuKeyAttrs.sort(function (value1, value2) {
            return parseInt(value1) - parseInt(value2);
        });
        //对每个SKU信息key属性值进行拆分组合
        var combArr = combInArray(skuKeyAttrs);
        for (j = 0; j < combArr.length; j++) {
            add2SKUResult(combArr[j], sku);
        }
        //结果集接放入SKUResult
        SKUResult[skuKeyAttrs.join(";")] = {
            count: sku.count,
            prices: [sku.price],
            money: [sku.money]
        }
    }
}
/*
 * 获得对象的key
 */
function getObjKeys(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key))
            keys[keys.length] = key;
    return keys;
}
/*
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */
function combInArray(aData) {
    if (!aData || !aData.length) {
        return [];
    }
    var len = aData.length;
    var aResult = [];
    for (var n = 1; n < len; n++) {
        var aaFlags = getCombFlags(len, n);
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
}
/**
 * 得到从 m 元素中取 n 元素的所有组合
 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
 */
function getCombFlags(m, n) {
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
}
/*
 * 把组合的key放入结果集SKUResult
 */
function add2SKUResult(combArrItem, sku) {
    var key = combArrItem.join(";");
    if (SKUResult[key]) {//SKU信息key属性·
        SKUResult[key].count += sku.count;
        SKUResult[key].prices.push(sku.price);
        SKUResult[key].money.push(sku.money);
    } else {
        SKUResult[key] = {
            count: sku.count,
            prices: [sku.price],
            money: [sku.money]
        };
    }
}
//初始化用户选择事件
$(function () {
    //展示产品的所有属性组
    showAttr(showData);
    initSKU();
    $('.sku').each(function () {
        var self = $(this);
        var attr_id = self.attr('attr_id');
        if (!SKUResult[attr_id]) {
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
            var prices = SKUResult[selectedIds.join(';')].prices;
            var count = SKUResult[selectedIds.join(';')].count;
            var maxPrice = Math.max.apply(Math, prices);
            var minPrice = Math.min.apply(Math, prices);
            var priceVal = maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice;

            var money = SKUResult[selectedIds.join(';')].money;
            var maxMoney = Math.max.apply(Math, money);
            var minMoney = Math.min.apply(Math, money);
            var moneyVal = maxMoney > minMoney ? minMoney + "-" + maxMoney : maxMoney;

            $('#price').text(" ￥ " + priceVal);//TODO
            $('#money').text(" ￥ " + moneyVal);//TODO
            var chioceVal = "";
            for (var lm in selectedIds) {
                if (lm <= selectedIds.length - 1) {
                    chioceVal += selectedIds[lm] + " ";
                }
            }
            chioceAttrData=selectedIds;
            //TODO 选中的属性编号转换为对应的属性名
            $("#chioce").text(changeValue(showData, selectedIds));
            $("#count").text(count);//TODO
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
                if (!SKUResult[testAttrIds.join(';')]) {
                    $(this).attr('disabled', 'disabled').removeClass('bh-sku-selected');
                } else {
                    $(this).removeAttr('disabled');
                }
            });
        } else {
            //设置默认价格
            $('#price').text(" ￥ ");
            $("#chioce").text("请选择属性");
            $("#count").text("");
            $("#money").text("预存款");
            //设置属性状态
            $('.sku').each(function () {
                SKUResult[$(this).attr('attr_id')] ? $(this).removeAttr('disabled') : $(this).attr('disabled', 'disabled').removeClass('bh-sku-selected');
            })
        }
    });
});
/*
 * 选中的属性编号转换为对应的属性名
 * @params dataSoure 展示的产品属性
 * @params chioceVals 选中的产品属性
 */
function changeValue(dataSoure, chioceVals) {
    var valString = "";
    for (var ks in dataSoure) {
        for (var s in dataSoure[ks]) {
            $.each(chioceVals, function (index, element) {
                if (dataSoure[ks][s].key == element) {
                    valString += dataSoure[ks][s].value + " ";
                }
            });
        }
    }
    return valString;
}
/*
 * 显示产品属性
 * @params chioceVals 展示的产品属性
 */
function showAttr(dataSoure){
    var html="";
    $.each(dataSoure, function (index1, element1) {
        html+='<div><span>'+element1[0].attrName+'：</span>';
        $.each(element1, function (index2, element2) {
            html+='<input type="button" class="sku" attr_id="'+element2.key+'" value="'+element2.value+'"/>&nbsp;&nbsp;';
        });
        html+='<br><br></div><br>';
    });
    $("#init_time").before(html);
}
$(function(){
    /*
     * 加入购物车
     */
    $("#shoppingCar").bind("click",function(){
        var chioceReture="";
        if(chioceAttrData!=null && chioceAttrData.length<showData.length){
            alert("请选择属性");
        }else{
            for (var lm in chioceAttrData) {
                if (lm <= chioceAttrData.length - 1) {
                    chioceReture += chioceAttrData[lm] + " ";
                }
            }
            alert("选择的套餐是:"+changeValue(showData,chioceAttrData))
        }
    })
});
