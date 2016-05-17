/*
	//1.indexedDB関連オブジェクトの取得
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
	var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
	var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

	//2.indexedDBを開く
	var idbReq = indexedDB.open("tablename", 1); //indexedDB.open("＜DBの名前＞", ＜バージョン＞)

	//3.DBの新規作成時、またはバージョン変更時に実行するコード
	idbReq.onupgradeneeded = function (event) {
		var db = event.target.result;
		//db.createObjectStore("＜オブジェクト・ストアの名前＞",{ keyPath: ＜キーの名前＞, autoIncrement: ＜インクリメントの利用の有無:true or false＞});
		var twitterStore = db.createObjectStore("twitter", { keyPath: "id_str" });
		var pocketStore = db.createObjectStore("pocket", { keyPath: "item_id" });

		//データの追加
		twitterStore.add({ id_str: "1", text: "test" })
		pocketStore.add({ item_id: "1", url:"http://test.com"})
	}

	//4-1.DBオープン失敗時の処理
	idbReq.onerror = function (event) {
		console.log("error");
	};

	//4-2.DBオープン成功時の処理
	var db;
	idbReq.onsuccess = function (event) {
		db = idbReq.result;

		//"twitter", "pocket"2つのオブジェクトストアを読み書き権限付きで使用することを宣言
		var transaction = db.transaction(["twitter", "pocket"], "readwrite");

		//各オブジェクトストアの取り出し
		var twitterStore = transaction.objectStore("twitter");
		var pocketStore = transaction.objectStore("pocket");

		//twitterオブジェクトストアから全データの取り出し
		twitterStore.openCursor().onsuccess = function (event) {
			var cursor = event.target.result;
			if (cursor) {
				console.log("id_str:" + cursor.key + " Text: " + cursor.value.text);
				cursor.continue();
			}
		};
		//pocketオブジェクトストアからの全データの取り出し
		pocketStore.openCursor().onsuccess = function (event) {
			var cursor = event.target.result;
			if (cursor) {
				console.log("item_id:" + cursor.key + " url: " + cursor.value.url);
				cursor.continue();
			}
		};
	}
*/

var indexedDB		= window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction	= window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
var IDBKeyRange		= window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
var IDBCursor		= window.IDBCursor || window.webkitIDBCursor;
/*
var idbReq			= indexedDB.open('yoiyamiWeb_db', 1);
idbReq.onupgradeneeded	= function(event) {
	var db			= event.target.result;
	var uName		= db.createObjectStore('uName', {keyPath: 'name'});
	var sFlag		= db.createObjectStore('sFlag', {keyPath: 'speach'});
	var fOpen		= db.createObjectStore('fOpen', {keyPath: 'firstApp'});
}

idbReq.onerror		= function (event) {
	console.log("error");
};

var db;
idbReq.onsuccess	= function (event) {
	db					= idbReq.result;

	// オブジェクトストアを読み書き権限付きで使用することを宣言
	var transaction		= db.transaction(['uName', 'sFlag', 'fOpen'], 'readwrite');

	// 各オブジェクトストアの取り出し
	var uNameStore		= transaction.objectStore('uName');
	var sFlagStore		= transaction.objectStore('sFlag');
	var fOpenStore		= transaction.objectStore('fOpen');
}

function updateDB(labelName, keyName, setValue) {
	/*
	var key = document.getElementById("setkey").value;
	var value = document.getElementById("setvalue").value;
	var value2 = document.getElementById("setvalue2").value;
	// （5）トランザクションを利用してオブジェクトの保存
	var trans = db.transaction("Name", IDBTransaction.READ_WRITE);
	var store = trans.objectStore("Name");
	var data = { BookmarkKey: key, Comment: value, URL: value2 };
	var request = store.put(data);

	// トランザクションを利用してオブジェクトの保存
	var trans		= db.transaction(labelName, IDBTransaction.READ_WRITE),
		store		= trans.onjectStore(labelName),
		data		= {keyName: setValue},
		request		= store.put(data);
}
*/
var module			= {
	db: null,
	renderer: function(name) {
		// 値の評価や埋め込みを行う
	}
};
/*

// TODOをすべて取得するメソッドを定義してみる
module.getAll = function(renderer) {
	if (renderer) document.getElementById('todo-list').innerHTML = '';
	// このへんは同じ
	var db = module.db;
	var tx = db.transaction(["todo"],"readwrite");
	var store = tx.objectStore("todo");
	// keyPathに対して検索をかける範囲を取得
	var range = IDBKeyRange.lowerBound(0);
	// その範囲を走査するカーソルリクエストを生成
	var cursorRequest = store.openCursor(range);
	// カーソルリクエストが成功したら...
	cursorRequest.onsuccess = function(e) {
		var result = e.target.result;
		// 注）走査すべきObjectがこれ以上無い場合
		//	 result == null となります！
		if (!!result == false) return;
		// ここにvalueがくる！
		console.log(result.value);
		if (renderer) renderer(result.value);
		// カーソルを一個ずらす
		result.continue();
	}
	// カーソルリクエストが失敗したら...
	cursorRequest.onerror = function(err) {
		console.log("XXX3", err);
	}
};
*/
// 追加・アップデートする
module.setting		= function(setCase, setValue, setSFlag) {
	var db = module.db;
	console.log(setCase);

	switch(setCase) {
		case 'setting':
			var store = db.transaction(['uName'],'readwrite').objectStore('uName');
			var req = store.clear();
			req.onsuccess	= function() {
				console.log('削除成功');
				// 値を挿入
				store.put({name: setValue, sFlag: setSFlag});
			};
			req.onerror		= function() {
				console.log('削除失敗');
			};
			return true;
		break;
		case 'flags':
			var store = db.transaction(['opFlag'],'readwrite').objectStore('opFlag');
			var req = store.clear();
			req.onsuccess	= function() {
				console.log('削除成功');
				// 値を挿入
				store.put({
					flag: setValue
				});
			};
			req.onerror		= function() {
				console.log('削除失敗');
			};
		break;
	}
};

// 初期化のメソッドを定義
module.init	 = function(num) {
	// ここで返るrequestは、「DBをopenするリクエスト」という意味
	var req = indexedDB.open('yoiyamiWeb_db', num);
	// indexedDB.deleteDatabase('yoiyamiWeb_db'); // DBをAllClearする※open直後しか効かない
	// onupgradeneededは、indexedDB.openの第二引数のversionが
	// 既存のものよりも大きいときだけ呼ばれる
	// なので、StoreしたいObjectのSchemeを変えるときなどに使えばよろしい
	req.onupgradeneeded		= function(ev) {
		var db		= ev.target.result;
		ev.target.transaction.onerror	= function(err) {
			console.log("XXX0", err);
		};
		// Scheme変えるわけだし、既に存在してるなら削除しとく
		// これをしないと、Table already existsに似たエラーを吐く
		if(db.objectStoreNames.contains('uName')) {
			db.deleteObjectStore('uName');
		}
		if(db.objectStoreNames.contains('opFlag')) {
			db.deleteObjectStore('opFlag');
		}
		if(db.objectStoreNames.contains('story')) {
			db.deleteObjectStore('story');
		}
		// 改めてつくる
		var uName	= db.createObjectStore('uName', {keyPath:'name'});
		var opFlag	= db.createObjectStore('opFlag', {keyPath:'flag'});
		var story	= db.createObjectStore('story', {keyPath:['title','timeStamp','link']});

		// インデックスを生成
		var uSpeach	= uName.createIndex('u_speach', 'speach', {unique: false});

		// 仮のデータを挿入
		uName.put({name: '', speach: true});
		console.log("XXX1", uName);
	};
	// 「DBをopenするリクエスト」が成功に終われば、
	// 得られた結果はDBなので、保持しておく
	// あとはこの単一オブジェクトを使えばよろしい
	req.onsuccess = function(ev) {
		module.db = (ev.target) ? ev.target.result : ev.result;
	};
};

$(function(){
	module.init(4);
});