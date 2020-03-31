var Cookie = {
    /**
     * 添加cookie
     * @param objName cookie的key
     * @param objValue cookie的值
     * @param objHours 有效时间(小时)
     */
    setCookieHour: function (objName, objValue, objHours) {
        var str = objName + "=" + escape(objValue);//cookie值进行编码
        if (objHours > 0) {                               //为时不设定过期时间，浏览器关闭时cookie自动消失
            var date = new Date();
            var ms = objHours * 3600 * 1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString();
        }
        document.cookies = str;
    },
    /**
     * 保存cookie
     * @param name cookie的名称
     * @param value cookie的值
     * @param days 有效时间(日)
     */
    setCookieDay: function (name, value,days) {
       if(Number(days) == true || Number(days) > 0){
           var exp = new Date();
           exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
           document.cookies = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
       }
    },
    /**
     * 保存cookie 
     * @param name cookie的名称
     * @param value cookie的值
     * @param days 有效时间(毫秒)
     */
    setCookieMs: function (name, value,ms) {
       if(Number(ms) == true || Number(ms) > 0){
           var exp = new Date();
           exp.setTime(exp.getTime() + ms);
           document.cookies = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
       }
    },
    /**
     * 获取制定cookie 的值
     * @param name 指定cookie的key
     * @returns 转码后cookie对应的值
     */
    getCookieEmpty: function (name) {
        var cookieArray = document.cookies.split(";"); //得到分割的cookie名值对
        var cookie = new Object();
        for (var i = 0; i < cookieArray.length; i++) {
            var arr = cookieArray[i].split("=");       //将名和值分开
            if (arr[0] == name)
                return unescape(arr[1]); //如果是指定的cookie，则返回它转码后的值
        }
        return "";
    },
    /**
     * 获取指定名称的cookie的值
     * @param objName
     * @returns 转码后cookie对应的值
     */
    getCookie: function (objName) {
        var arrStr = document.cookies.split(";");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == objName) return unescape(temp[1]);
        }
    },
	/**
     * 删除指定cookie
     * @param name 指定cookie的key
     */
    delCookie: function (name) {
        document.cookies = name + "=;expires=" + (new Date(0)).toGMTString();
    }
};