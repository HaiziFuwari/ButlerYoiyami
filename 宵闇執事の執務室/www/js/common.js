// storyを読み込む
function importFile(fileName) {
	$(window).load('./story/' + fileName + '.html', function(str) {
		$('.jsc-insertStory').html('');
		window.scrollTo(0,50);
		var result = str.split('%name%').join(userName);
		// 自動改行
		result = result.replace(/\r?\n/g, "<br>");
		$('.jsc-insertStory').html('<h2>Story</h2><div class="bg_black">' + result + '</div>');
	});
}

// partsファイルを読み込む
function fileLoad(elem, fileName) {
	elem.load('./parts/' + fileName + '.html', function() {
		if(fileName == 'include_footer') {
			// タップアイコンを点滅させる
			$flashObj = $('.jsc-flashing');
			flashing($flashObj);
		}
	});
}

/**
	メニューの場所が認識されていないっぽいのでタップアイコンを追加してみる
	点滅動作
*/
function flashing($obj) {
	var flashCount = 0;
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

// 共通ファイルの読み込み
fileLoad($('footer'), 'include_footer');
fileLoad($('header'), 'include_header');