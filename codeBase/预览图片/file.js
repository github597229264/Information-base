//js����ͼƬԤ��������ie[6-9]�������Chrome17+��Opera11+��Maxthon3
function PreviewImage(fileObj,imgPreviewId,divPreviewId){
    var allowExtention=".jpg,.bmp,.gif,.png";//�����ϴ��ļ��ĺ�׺��document.getElementById("hfAllowPicSuffix").value;
    var extention=fileObj.value.substring(fileObj.value.lastIndexOf(".")+1).toLowerCase();
    var browserVersion= window.navigator.userAgent.toUpperCase();
    if(allowExtention.indexOf(extention)>-1){
        if(fileObj.files){//HTML5ʵ��Ԥ��������chrome�����7+��
            if(window.FileReader){
                var reader = new FileReader();
                reader.onload = function(e){
                    document.getElementById(imgPreviewId).setAttribute("src",e.target.result);
                }
                reader.readAsDataURL(fileObj.files[0]);
            }else if(browserVersion.indexOf("SAFARI")>-1){
                alert("��֧��Safari6.0�����������ͼƬԤ��!");
            }
        }else if (browserVersion.indexOf("MSIE")>-1){
            if(browserVersion.indexOf("MSIE 6")>-1){//ie6
                document.getElementById(imgPreviewId).setAttribute("src",fileObj.value);
            }else{//ie[7-9]
                fileObj.select();
//                if(browserVersion.indexOf("MSIE 9")>-1)
                fileObj.blur();//������document.selection.createRange().text��ie9��ܾ�����
                var newPreview =document.getElementById(divPreviewId+"New");
                if(newPreview==null){
                    newPreview =document.createElement("div");
                    newPreview.setAttribute("id",divPreviewId+"New");
                    newPreview.style.width = "200px";
                    newPreview.style.height = "132px";
                }
                var url = document.selection.createRange().text;
                newPreview.style.filter='progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale"",src="' + url + '")';
                var tempDivPreview=document.getElementById(divPreviewId);
                tempDivPreview.parentNode.insertBefore(newPreview,tempDivPreview);
                tempDivPreview.style.display="none";
            }
        }else if(browserVersion.indexOf("FIREFOX")>-1){//firefox
            var firefoxVersion= parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
            if(firefoxVersion<7){//firefox7���°汾
                document.getElementById(imgPreviewId).setAttribute("src",fileObj.files[0].getAsDataURL());
            }else{//firefox7.0+
                document.getElementById(imgPreviewId).setAttribute("src",window.URL.createObjectURL(fileObj.files[0]));
            }
        }else{
            document.getElementById(imgPreviewId).setAttribute("src",fileObj.value);
        }
    }else{
        alert("��֧��"+allowExtention+"Ϊ��׺�����ļ�!");
        fileObj.value="";//���ѡ���ļ�
        if(browserVersion.indexOf("MSIE")>-1){
            fileObj.select();
            document.selection.clear();
        }
        fileObj.outerHTML=fileObj.outerHTML;
    }
}



��ҳ���룺
<input type="file" onchange="PreviewImage(this,'frontagePictureImg','divPreview1')" size="20" class="allIdCard frontageIdCard" id="frontageIdCard" name="frontageIdCard"/>
<div id="divPreview1">
    <img id="frontagePictureImg" src="miniqq/pc/images/front.gif" style="" alt=""/>
</div>