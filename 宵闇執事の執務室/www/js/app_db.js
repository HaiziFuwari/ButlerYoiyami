// DB関連オブジェクト
var indexedDB		= window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction	= window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
var IDBKeyRange		= window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
var IDBCursor		= window.IDBCursor || window.webkitIDBCursor;

// アプリ設定
var dbName		= 'yoiyami_db';
var dbVersion	= 1;
var db			= null;

// ユーザー設定

/**
	openメソッドはonsuccess, onerror, onupgradeneededを返す
*/
// DBへの接続を開始する
var request		= indexedDB.open(dbName, dbVersion);
// 接続に成功
request.onsuccess	= function(ev) {
}
// 接続に失敗
request.onerror		= function(e) {
	console.log('Database error: ' + e.target.errorCode);
}
// DBバージョンアップ
request.onupgradeneeded		= function(ev) {

}

// DBから値を呼び出す

// DBの値を更新する