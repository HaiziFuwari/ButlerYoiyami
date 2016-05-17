/**
* File Version 0.0.0
* local storage
*/

// global variable
var version		= '0.0.0';
var keyVersion	= 'fVersion',
	keyName		= 'uName',
	keyBirth	= 'uBirth',
	keyTalk		= 'bTalk',
	keyFlag		= 'appFlag',
	fList		= {
		op: 0/*,
		b: 'b',
		c: 'c'*/
	};
	//localStorage.setItem('obj', JSON.stringify(obj));

// user setting import
function setLS(uName, uBirth, bTalk, targetFlag, targetFlagValue) {
	// set user name
	if(uName != '') localStorage.setItem(keyName, uName);
	// set user birthday
	if(uBirth != '') localStorage.setItem(keyBirth, uBirth);
	// set butler talk flag
	if(bTalk != '') localStorage.setItem(keyTalk, bTalk);
	// set application flag
	if(targetFlag != '') {
		fList[targetFlag]	= targetFlagValue;
		localStorage.setItem(keyFlag, JSON.stringify(fList));
	}
}
// user setting update
// user setting delete
// default action
$(function() {
	if(!window.localStorage) {
		alert('ローカルストレージに対応していない機種のためご利用いただけません。\n申し訳ありませんが、WEBサイトをご利用ください。');
	} else {
		var deviceFileVer	= localStorage.getItem(version);
		if(deviceFileVer != version) {
			// ここに変更時の処理
			console.log('バージョンアップ処理');
			localStorage.setItem(keyVersion, version);
		}
	}
});