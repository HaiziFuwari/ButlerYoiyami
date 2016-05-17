// DB関連オブジェクト
var indexedDB		= window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction	= window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
var IDBKeyRange		= window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
var IDBCursor		= window.IDBCursor || window.webkitIDBCursor;

var db				= null;

// グローバル変数
var dbName			= 'yoiyamiWeb_db';
var userName		= '',
	appVersion		= '0.0.0',
	flags			= new Array();

// flag配列
flags['op']				= false; // アプリを起動した
flags['butlerTalk']		= true;	// 執事の案内

// IDB作成
function createDatabase() {
	// IDBを開く
	var openRequest = indexedDB.open(dbName, 7);
	// IDB接続エラー
	openRequest.onerror = function(e) {
		console.log('Database error: ' + e.target.errorCode);
	};
	// IDB接続成功
	openRequest.onsuccess = function(event) {
		console.log('Database created');
		db = openRequest.result;
	};
	// IDBアップデート
	openRequest.onupgradeneeded = function(evt) {
		db		= evt.target.result;

		evt.target.transaction.onerror		= function(e){
			console.log("Oppss... we got into problems and errors. e:" + e);
		};

		// IDBがあるかどうか
		console.log(openDatabase());

		/*
		var settingStore = evt.currentTarget.result.createObjectStore('setting', {keyPath: 'id'}, {unique: true});
		settingStore.createIndex('nameIndex', 'name', {unique: true});
		settingStore.createIndex('butlerIndex', 'butler', {unique: true});
		settingStore.createIndex('flagIndex', 'flag', {unique: false});
		*/
	};
}

// IDB削除
function deleteDatabase() {
	var deleteDbRequest = indexedDB.deleteDatabase(dbName);
	// IDB削除成功
	deleteDbRequest.onsuccess = function (event) {
		// database deleted successfully
	};
	// IDB削除失敗
	deleteDbRequest.onerror = function (e) {
		console.log('Database error: ' + e.target.errorCode);
	};
}

// IDBを開く
function openDatabase() {
	var openRequest = indexedDB.open(dbName);
	// IDBが開けなかった
	openRequest.onerror = function(e) {
		console.log('Database error: ' + e.target.errorCode);
	};
	// IDB接続成功
	openRequest.onsuccess = function(event) {
		console.log('OK');
		db = openRequest.result;
		return {
			name: '',
			butler: '',
			flag: {op:false, talk:true},
		};
	};
}
// keyを使用して特定のレコードを取得
function fetchSetting() {
	try {
		var result = document.getElementById('result');
		result.innerHTML = '';
		if(localDatabase != null && db != null) {
			var store		= db.transaction('setting').objectStore('setting');
			store.get('E3').onsuccess = function(event) {
				var setting		= event.target.result;
				if(setting == null) {
					result.value = 'setting not found';
				}
				else {
					var jsonStr = JSON.stringify(setting);
					result.innerHTML = jsonStr;
				}
			};
		}
	}
	catch(e){
		console.log(e);
	}
}
// インデックスを使用して特定のレコードを取得
function fetchSettingByButler() {
	try {
		var result = document.getElementById('result');
		result.innerHTML = '';

		if (localDatabase != null && db != null) {
			var range = IDBKeyRange.only('yoiyami');

			var store = db.transaction('setting').objectStore('setting');

			var index = store.index('butlerIndex');

			index.get(range).onsuccess = function(evt) {
				var setting = evt.target.result;
				var jsonStr = JSON.stringify(setting);
				result.innerHTML = jsonStr;
			};
		}
	}
	catch(e) {
		console.log(e);
	}
}

// レコードを作成
function addSetting() {
	try {
		var result = document.getElementById('result');
		result.innerHTML = '';

		var transaction = db.transaction('setting', 'readwrite');
		var store = transaction.objectStore('setting');

		if (localDatabase != null && db != null) {
			var request = store.add({
				'id': '168.192.12.11', // ここにユーザーのID
				'name': 'しおり', // ここにユーザー名
				'butler': 'yoiyami',
				'flag': new Array(),
			});
			request.onsuccess = function(e) {
				result.innerHTML = 'Setting record was added successfully.';
			};

			request.onerror = function(e) {
				console.log(e.value);
				result.innerHTML = 'Setting record was not added.';
			};
		}
	}
	catch(e){
		console.log(e);
	}
}

// レコードを更新
function updateSetting() {
	try {
		var result = document.getElementById('result');
		result.innerHTML = '';

		var transaction = localDatabase.db.transaction('setting', 'readwrite');
		var store = transaction.objectStore('setting');
		var jsonStr;
		var setting;

		if (localDatabase != null && localDatabase.db != null) {

			store.get('E3').onsuccess = function(event) {
				setting = event.target.result;
				// save old value
				jsonStr = 'OLD: ' + JSON.stringify(setting);
				result.innerHTML = jsonStr;

				// update record
				setting.email = 'john.adams@anotherdomain.com';

				var request = store.put(setting);

				request.onsuccess = function(e) {
					console.log('Added setting');
				};

				request.onerror = function(e) {
					console.log(e.value);
				};


				// fetch record again
				store.get('E3').onsuccess = function(event) {
					setting = event.target.result;
					jsonStr = 'NEW: ' + JSON.stringify(setting);
					result.innerHTML = result.innerHTML	+ jsonStr;
				}; // fetch setting again
			}; // fetch setting first time
		}
	}
	catch(e){
		console.log(e);
	}
}

// ストアをクリアする
function clearAllEmployees() {
	try {
		var result = document.getElementById("result");
		result.innerHTML = "";

		if (localDatabase != null && localDatabase.db != null) {
			var store = localDatabase.db.transaction("employees", "readwrite").objectStore("employees");

			store.clear().onsuccess = function(event) {
				result.innerHTML = "'Employees' object store cleared";
			};
		}
	}
	catch(e){
		console.log(e);
	}
}