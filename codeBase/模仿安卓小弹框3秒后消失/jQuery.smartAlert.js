/**
 * 
 * Example
 * 	Code
 * 		<code>
 * 			$.smartAlert("自定义小弹框提示",5000); 
 * 		</code>
 * 	Result
 * 		this
 * @description jQuery smartAlert 自定义小弹框提示
 * @author 黄星辉
 * @date 2017年4月7日
 * @param {jQuery} {smartAlert:function(alertMsg,showTime)}
 * @param  alertMsg 提示内容  (默认 '自定义小弹框提示')
 * @param  showTime 弹框显示时间/ms (默认3000)
 * @return this
 */
;
(function($) {
	$.extend({
		/**
		 * 自定义小弹框提示--（指定提示内容、指定时间后关闭）
		 * @param {Object} alertMsg 提示内容  (默认 "自定义小弹框提示")
		 * @param {Object} showTime 弹框显示时间/ms (默认3000)
		 */
		smartAlert: function(alertMsg, showTime) {
			alertMsg = alertMsg || "自定义小弹框提示";
			showTime = showTime || 3000;
			var alertHtml = "<div id='jquery_smartAlert' style='width: 100%;'><div style='border-radius: 0.4rem;box-shadow: 0 0 0.2rem rgba(0,0,0,.5);position: absolute;left: 50%;bottom: 2rem;line-height: 1rem;-webkit-transform: translate(-50%, -20%);transform: translate(-50%, -20%); padding: 0.5rem 0.7rem;background-color: rgba(0,0,0,0.8);color: #fff;font-size: 0.8rem;'>" + alertMsg + "</div></div>";
			$("body").append(alertHtml);
			var timer = setTimeout(function() {
				var smartAlertTag = $("#jquery_smartAlert");
				if(smartAlertTag) {
					smartAlertTag.fadeOut("normal", "swing", function() {
						smartAlertTag.remove();
					});
				}
				clearTimeout(timer);
			}, showTime);
			return this;
		}
	});
})(jQuery);