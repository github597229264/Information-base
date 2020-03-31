$(function(){
    $("#dateTime1").val(getCurrDate());
    $("#dateTime2").val(getCurrDate());
    getdata( 0 );
    // 点击搜索
    $('#search').click(function(){
        var pageindex = $('#mpage > a.z-crt').attr('data-index');
        getdata( pageindex );
    });

    // 监听下标按钮
    $("#mpage").on('click','a',function(){
        var _this = $(this),
            pageindex = _this.attr('data-index');
        getdata( pageindex );
    });
    /*
     * 日期
     */
      $('#formDateTime1').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: false,
        pickTime: false,
        weekStart: 1,
        todayBtn: 0,
        autoclose: 1,
        startView: 3,
        minView: 2,
        forceParse: 0
      });
    /*
     * 日期
     */
    $('#formDateTime2').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: false,
        pickTime: false,
        weekStart: 1,
        todayBtn: 0,
        autoclose: 1,
        startView: 3,
        minView: 2,
        forceParse: 0
    });
    // 导出数据
    $("#export").click(function(){
        var params = {
            searchContent : $('#orderNum').val(),
            timeDesc : true,
            status :  $("#status").val()
        }
        window.open( window.core._EXPORT_URL_ + '?' + $.param( params ) ) ;
    });
    $("#dateTime1,#dateTime2").bind("change",function(){
        var dateTime1=parseInt($("#dateTime1").val().replace(/-+/g,''));
        var dateTime2=parseInt($("#dateTime2").val().replace(/-+/g,''));
        if(dateTime1>dateTime2){
            alert("开始时间不能大于结束时间");
        }
    });
    /**
     * 获取订单数据
     * @param pageindex
     */
    function getdata( pageindex ){
        var dateTime1=parseInt($("#dateTime1").val().replace(/-+/g,''));
        var dateTime2=parseInt($("#dateTime2").val().replace(/-+/g,''));
        if(dateTime1>dateTime2){
            alert("开始时间不能大于结束时间");
            return;
        }
        var params = {
            searchContent :  $('#orderNum').val(),
            timeDesc :  true,
            date:$("#dateTime1").val(),
            startDate:$("#dateTime1").val(),
            endDate:$("#dateTime2").val(),
            status :  $("#status").val(),
            currentPage : pageindex || 0,
            pageSize : core.ORDER_PAGESIZE
        };
        // 获取数据列
        $.ajax({
            url :  window.core._SEARCH_URL_ ,
            data : params,
            headers : core.auth,
            success : function( result ){
                var tbody = $('#mtbody').empty();
                var mpage = $("#mpage").empty();
                var totalPages = result['totalPages'],
                    currentPage = pageindex || 0,
                    data = result['data'];
                if ( data ) {
                    for(var i = 0; i < data.length; i++ ){
                        var customer_name = $('<td>').text( data[i]['customer_name']),
                            product_name = $('<td>').text(data[i]['product_name']),
                            order_code = $('<td>').text( data[i]['order_code']),
                            pay_code = $('<td>').text(data[i]['pay_code'] || ''),
                            service_code = $('<td>').text(data[i]['service_code'] || ''),
                            source_channel_name = $('<td>').text(data[i]['source_channel_name'] || '未知来源'),
                            created_time = $('<td>').text(data[i]['created_time'] || '');
                        var tr = $('<tr>').attr('data-id', data[i]['id'])
                        tr.append(customer_name).append(product_name).append(order_code).append(pay_code).append(service_code).append(source_channel_name).append(created_time).appendTo(tbody);
                    }

                    var arrs = getPageIndex( 4, parseInt(currentPage), totalPages);

                    for(var i = arrs[0]; i <= arrs[1]; i++){
                        var a = $('<a href="javascript:;">');
                        if ( currentPage == (i - 1)  ) {
                            a.addClass('z-crt');
                        }
                        a.text(i).attr('data-index',i-1);
                        a.appendTo(mpage);
                    }
                    $("#mpage").append('<a style="cursor: default;border-width: 0;">共&nbsp;&nbsp;'+result.totalPages+'&nbsp;&nbsp;页&nbsp;&nbsp;&nbsp;总计&nbsp;&nbsp;'+result.totalSize+'&nbsp;&nbsp;条数据</a>');
                }else{
                    //表格空数据处理
                    tableEmpty("没有相关数据");
                }
            },
            error: function (xhr, textStatus) {
                var message = "";
                if (textStatus == 'timeout') {
                    message = "请求超时,请检查网络连接是否正常!";
                } else if (textStatus == 'error') {
                    message = "请求错误,请检查网络连接是否正常!";
                } else {
                    var xhrObj = JSON.parse(xhr.responseText);
                    message = xhrObj.message;
                }
                //表格空数据处理
                tableEmpty(message);
            }
        });
    }

    // 显示下标个数，当前页码，总页数
    function getPageIndex( pageCode, currentPage, totalPage ){
        var  startpage = currentPage- (pageCode%2 == 0 ? pageCode/2-1 : pageCode/2);
        var endpage= currentPage+ pageCode/2;
        if( startpage< 1 ){
            startpage= 1;
            if(totalPage >= pageCode)endpage= pageCode;
            else endpage = totalPage;
        }
        if(endpage> totalPage){
            endpage= totalPage;
            if((endpage- pageCode)> 0)startpage= endpage- pageCode+ 1;
            else startpage= 1;
        }
        return [startpage,endpage];
    }
});
/*
 * 获取当前日期--yyyy-MM-dd
 */
function getCurrDate(){
    var currentdate=new Date();
    currentdate.getYear();
    return currentdate.getFullYear()+"-"+appendZero(currentdate.getMonth()+1)+"-"+appendZero(currentdate.getDate());
}

/*
 * 单数自动补0
 */
function appendZero(s){
    return ("00"+ s).substr((s+"").length);
}
/**
 * 表格空数据处理
 * @param emptyMsg  提示文字
 */
function tableEmpty(emptyMsg){
    var emptyTr = $('<tr>').attr('class', "emptyData");
    var emptyTd= $('<td>').attr("colspan","7").attr("rowspan",core.ORDER_PAGESIZE).text(emptyMsg);
    emptyTr.append(emptyTd);
    $('#mtbody').append(emptyTr);
}