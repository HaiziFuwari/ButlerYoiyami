/**
	スピーチ文用グローバル変数
	var DELAY_SPEED: 文字が流れる速さ
	var FADE_SPEED: 表示のアニメーション時間
	var str: 文字を格納する配列
*/
var DELAY_SPEED = 80;
var FADE_SPEED = 200;
var str = [];

/**
	執事の顔を動かす
*/
var faceInterval;
var mouseFlag = 0; // close
function face(animName, type) {
	var faceElem = $('.butler > .face');
	// 口の開閉フラグ
	if(animName == 'start') {
		faceInterval = setInterval(function() {
			if(mouseFlag == 0) {
				mouseFlag = 1;
			} else {
				mouseFlag = 0;
			}
			// 瞬き
			var i		= Math.random();
			if(i < 0.97) {
				num	= 0; // openEyes
			} else {
				num	= 1; // closeEyes
			}
			faceElem.removeClass(function(index, className) {
				return(className.match(/\btype\S+/g) || []).join(' ');
			});
			if(mouseFlag == 0) {
				if(type == 'smile') {
					faceElem.addClass('type3');
				} else {
					// close mouse
					switch(num) {
						case 1:
							// close eyes
							faceElem.addClass('type1');
						break;
						case 0:
							// open eyes
							faceElem.addClass('type4');
						break;
					}
				}
			} else {
				if(type == 'smile') {
					faceElem.addClass('type6');
				} else {
					// open mouse
					switch(num) {
						case 1:
							// close eyes
							faceElem.addClass('type2');
						break;
						case 0:
							// open eyes
							faceElem.addClass('type5');
						break;
					}
				}
			}
		}, 180);
		setTimeout(function() {
			clearInterval(faceInterval);
		}, 3000);
	}
}

/**
	str_typography
		liタグの中を1文字ずつ表示する
		num: 読み込むliタグの行
*/
function str_typography(num, type) {
	str = [];
	$('.jsc-talk > li:eq(' + num + ')').each(function(i) {
		str[i] = $(this).html();
		$(this).html('');
		$(this).css('opacity', '1');
		var no = i;
		var self = this;
		var interval = setInterval(function() { //50ミリ秒毎にチェック
			if(no == 0 || $('.jsc-talk > li').eq(no - 1).children('span:last').css('opacity') == 1) {
				//最初の行または前の行が全文字表示された時
				clearInterval(interval); //チェックを停止
				for (var j = 0; j < str[no].length; j++) {
					var stepNum	 = j;
					if(str[no].substr(j, 1) == '<') {
						$(self).append('<br>');
						stepNum = j + 3;
					} else {
						$(self).append('<span>' + str[no].substr(j, 1) + '</span>'); //1文字ずつ<span>を付けて
					}
					//時間差でフェードインさせる
					$(self).children().delay(DELAY_SPEED * j).animate({opacity:'1'}, FADE_SPEED);
					j = stepNum;
				}
			}
			face('start', type);
		}, 50);
	});
	if(num == $('.jsc-talk li').length) {
		$('#jsi-nextSpeach').css('display','none');
	} else {
		num++;
		return num;
	}
}
function talk(type) {
	// 文字を流す
	var num			 = 0; // 現在の表示完了行
	if($('.jsc-talk').size()) {
		setTimeout(function() {
			num = str_typography(0, type);
		}, 500);
		// 次の文章を読み込む
		$('.jsc-speach_set').on('click', function() {
			// もし全ての文章を表示し終えていたら執事を消す
			if(num == $('.jsc-talk li').length) {
				$('.jsc-speach_set').css('display', 'none');
				$('.jsc-scroll_wrap').addClass('isAuto');
			} else {
				$('.jsc-talk li:eq(' + (num - 1) + ')').css('display', 'none');
				num = str_typography(num, type);
			}
		});
	}
}
// トークコンテンツとファイル読み込み
function talkFileLoad(fileName, userName, type) {
	// トークを読み込む
	$(window).load('./parts/talk.html', function(data) {
		$('main').append(data);
		$(window).load('./talk/' + fileName + '.html', function(talkData) {
			var result		= talkData.split('%name%').join(userName);
			$('.jsc-talk').html(result);
			if(fileName == 'index') {
				$('.jsc-speach_set').addClass('isBlack index');
				// indexの場合はフッターのメニューボタンもなし
				$('.jsc-footerGNav').addClass('noVisible');
				$('.js-globalMenuBtn').addClass('noVisible');
			}
			talk(type);
		});
	});
}