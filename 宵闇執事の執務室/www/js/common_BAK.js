// DB関連オブジェクト
var indexedDB		= window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction	= window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
var IDBKeyRange		= window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
var IDBCursor		= window.IDBCursor || window.webkitIDBCursor;
// DBを開く
var request			= indexedDB.open('yoiyamiWeb_db', 25);
//indexedDB.deleteDatabase('yoiyamiWeb_db');
var userName	= '',
	userTalk	= true,
	userOp		= false;

var db;
/**
	DB接続とテーブルの初期化
*/
request.onupgradeneeded		= function(ev) {
	db		= ev.target.result;

	ev.target.transaction.onerror		= function(e){
		console.log("Oppss... we got into problems and errors. e:" + e);
	};
	// DB初期化
	if(db.objectStoreNames.contains('user')) {
		db.deleteObjectStore('user');
	}
	// DBを改めて作成
	var user	= db.createObjectStore('user', {keyPath:'id'});

	// indexを用意
	var uName	= user.createIndex('u_Name', 'name', {unique: false});
	var uTalk	= user.createIndex('u_Talk', 'talk', {unique: false});
	var opFlag	= user.createIndex('u_Flag', 'op', {unique: false});

	// 初期データを設定
	user.put({
		id: 1,
		name: '',
		talk: true,
		op: false
	});
}
/**
	データの読み込みが完了したらはじめて初期動作を起動
*/
request.onsuccess = function(ev) {
	console.log('Request on Success');
	db		= (ev.target) ? ev.target.result : ev.result;
	displayData();
};





function updateDB(sName, setValue1, setValue2, setValue3) {
	var store		= db.transaction([sName], "readwrite").objectStore(sName);
	store.openCursor().onsuccess	= function(ev) {
		var cursor		= ev.target.result;
		if(cursor) {
			var upD		= cursor.value;
			switch(sName) {
				case 'user':
					upD.name	= setValue1;
					upD.talk	= setValue2;
					upD.op		= setValue3;
				break;
			}
			var updateResult	= cursor.update(upD);
			updateResult.onsuccess	= function() {
				// reload用
				userName	= setValue1;
				userTalk	= setValue2;
				userOp		= setValue3;
			}
			console.log('Update Now');
			cursor.continue();
		} else {
			/*
			store.put({
				id: 1,
				name: setValue1,
				talk: setValue2,
				op: setValue3
			});
			*/
			console.log('Finish');
			pageChange(undefined, true);
		}
	}
	// ここ、上書きのスクリプト例
	/*
	var store		= db.transaction(['story'], "readwrite").objectStore('story');
	store.openCursor().onsuccess	= function(ev) {
		var cursor		= ev.target.result;
		if(cursor) {
			var upD		= cursor.value;
			upD.title	= 'aa';
			var test		= cursor.update(upD);
			test.onsuccess	= function() {
				//console.log(test.result);
			}
			console.log(cursor.value.title);
			cursor.continue();
		} else {
			console.log('Finish');
		}
	}
	*/
}

function checkDB(returnName) {
	var store		= db.transaction(['user'], 'readonly').objectStore('user');
	store.openCursor().onsuccess	= function(ev) {
		var cursor		= ev.target.result;
		if(cursor) {
			//console.log(cursor.value);
			// get user table
			//console.log(cursor.value.name);
			return cursor.value.name;
		}
	}
}
/**
	settingのフォームが存在する場合
*/
function settingForm() {
	var userName	= checkDB('name');
	if(userName != undefined) {
		console.log(userName);
	}
	/*
		userName	= res['name'];
		userTalk	= res['talk'];
		userOp		= res['op'];
		*/

	// 初期値を設定
	$('#jsi-speach').prop('checked', userTalk);
	// 執事の案内のON/OFFでメッセージ切り替え
	$('#jsi-speach').on('change', function(e) {
		if($(this).is(':checked')) {
			$('.jsc-nowFlag').text('案内をしてもらう');
			$(this).prop('checked', true);
		} else {
			$('.jsc-nowFlag').text('案内の必要はない');
			$(this).prop('checked', false);
		}
	});
}

/**
	ページ遷移
*/
function pageChange(pageName, flag) {
	if(pageName == 'exit') {
		window.close();
		navigator.app.exitApp();
	} else {
		var url				= window.location.href;
		var pageFileName	= url.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
		//console.log(pageFileName);
		var rootURL			= url.split(pageFileName)[0];
		//console.log('OK');
		if(pageFileName == 'index' && userOp) {
			location.replace(rootURL + 'main.html');
		} else if(pageFileName != 'index' && !userOp) {
			location.replace(rootURL + 'index.html');
		} else if(pageFileName != 'index' && pageName != undefined) {
			location.replace(rootURL + pageName + '.html');
		} else if(pageFileName == 'setting' && flag == true) {
			$('.jsc-compStr').html('<p class="compStr">設定を保存しました</p>');
		} else {
			return false;
		}
	}
}

/**
	スピーチ文用グローバル変数
	var DELAY_SPEED: 文字が流れる速さ
	var FADE_SPEED: 表示のアニメーション時間
	var str: 文字を格納する配列
*/
var DELAY_SPEED		= 80;
var FADE_SPEED		= 200;
var str				= [];
/**
	str_typography
		liタグの中を1文字ずつ表示する
		num: 読み込むliタグの行
*/
function str_typography(num) {
	str	 = [];
	$('.jsc-talk > li:eq(' + num + ')').each(function(i) {
		str[i]	  = $(this).html();
		$(this).html('');
		$(this).css('opacity', '1');
		var no	  = i;
		var self	= this;
		var interval	= setInterval(function() { //50ミリ秒毎にチェック
			if(no == 0 || $('.jsc-talk > li').eq(no - 1).children('span:last').css('opacity') == 1) {
				//最初の行または前の行が全文字表示された時
				clearInterval(interval); //チェックを停止
				for (var j = 0; j < str[no].length; j++) {
					var stepNum	 = j;
					if(str[no].substr(j, 1) == '<') {
						$(self).append('<br>');
						stepNum	 = j + 3;
					} else {
						$(self).append('<span>' + str[no].substr(j, 1) + '</span>'); //1文字ずつ<span>を付けて
					}
					$(self).children().delay(DELAY_SPEED * j).animate({opacity:'1'}, FADE_SPEED);//時間差でフェードインさせる
					j	   = stepNum;
				}
			}
		}, 50);
	});
	if(num == $('.jsc-talk li').length) {
		$('#jsi-nextSpeach').css('display','none');
	} else {
		num++;
		return num;
	}
}
/**
	メニューの場所が認識されていないっぽいのでタップアイコンを追加してみる
	点滅動作
*/
function flashing($obj) {
	var flashCount	  = 0;
	setInterval(function() {
		if(flashCount < 3) {
			$obj.fadeOut(800).fadeIn(800);
		} else {
			$obj.fadeOut(800);
			clearInterval();
		}
		flashCount++;
	}, 1000);
}


// storyを読み込む
function importFile(fileName) {
	$(window).load('./story/' + fileName + '.html', function(str) {
		$('.jsc-insertStory').html('');
		window.scrollTo(0,50);
		var result		= str.split('%name%').join(userName);
		// 自動改行
		result			= result.replace(/\r?\n/g, "<br>");
		$('.jsc-insertStory').html('<h2>Story</h2><div class="bg_black">' + result + '</div>');
	});
}
// partsファイルを読み込む
function fileLoad(elem, fileName) {
	elem.load('./parts/' + fileName + '.html', function() {
		if(fileName == 'include_footer') {
			// タップアイコンを点滅させる
			$flashObj		= $('.jsc-flashing');
			flashing($flashObj);
		}
	});
}
// トークコンテンツとファイル読み込み
function talkFileLoad(fileName) {
	if(userTalk) {
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
				talk();
			});
		});
	}
}
// 執事トーク
function talk() {
	// 文字を流す
	var num			 = 0; // 現在の表示完了行
	if($('.jsc-talk').size()) {
		setTimeout(function() {
			num	 = str_typography(0);
		}, 500);
		// 次の文章を読み込む
		$('.jsc-speach_set').on('click', function() {
			// もし全ての文章を表示し終えていたら執事を消す
			if(num == $('.jsc-talk li').length) {
				$('.jsc-speach_set').css('display', 'none');
				$('.jsc-scroll_wrap').addClass('isAuto');
			} else {
				$('.jsc-talk li:eq(' + (num - 1) + ')').css('display', 'none');
				num		= str_typography(num);
			}
		});
	}
}

/** footer global navigation */
function gMenuBtn() {
	// グローバルメニューの開閉
	var $body = $('body');
	$body.toggleClass('isOpen');
	$('#js-overlay').on('click', function () {
		$body.removeClass('isOpen');
	});
}

/**
	初期動作
*/
function displayData() {
	// 共通ファイルの読み込み
	fileLoad($('footer'), 'include_footer');
	fileLoad($('header'), 'include_header');

	//console.log(db);
	var store		= db.transaction(['user'], 'readonly').objectStore('user');
	store.openCursor().onsuccess	= function(ev) {
		var cursor		= ev.target.result;
		if(cursor) {
			//console.log(cursor.value);
			// get user table
			userName	= cursor.value.name;
			userTalk	= cursor.value.talk;
			userOp		= cursor.value.op;

			// default data set for input
			if($('input').size()) {
				$("#uName").val(userName);
			}

			// page condition
			pageChange();
		}
	}
	store.openCursor().onerror		= function(e) {
		console.log('XXX0' + e);
	}
	// フォームが存在する場合
	if($('input').size()) {
		settingForm();
	}
}