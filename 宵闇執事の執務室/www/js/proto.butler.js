// 執事
function Butler() {
	Butler.prototype.talk		= function(talkFileName, userName, type) {
		console.log('話す');
		talkFileLoad(talkFileName, userName, type);
	};
	Butler.prototype.chara		= function(butlerName) {
		console.log('画像設定');
		$('body').addClass(butlerName);
	}
	Butler.prototype.face		= function() {
		console.log('顔の動き');
	}
}
// 宵闇執事
var yoiyami = new Butler();