var MakeCode={
    /*
     * 第 1 种
     * 生成唯一随机数
     * 实例 {f62f3414-4a4d-2c8e-8e9f-6af53b80778f}
     */
    makeCodeOne:function(){
        var   guid   =   "";
        for (var   i   =   1;   i   <=   32;   i++){
            var   n   =   Math.floor(Math.random()   *   16.0).toString(16);
            guid   +=   n;
            if   ((i   ==   8)   ||   (i   ==   12)   ||   (i   ==   16)   ||   (i   ==   20))
                guid   +=   "-";
        }
        return guid;
    },
    /*
     *  第 2 种
     * 生成唯一随机数
     * @param n [number] 生成的随机数的位数
     * 实例 141708080375719oqbej0
     */
    makeCodeTwo:function(n){
        var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
        var  tmp="";
        var timestamp = new Date().getTime();
        for(var  i=0;i<n;i++)  {
            tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
        }
        return  tmp+timestamp;
    }
};
