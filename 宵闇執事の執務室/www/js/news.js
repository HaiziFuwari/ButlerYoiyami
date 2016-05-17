$(function() {
	var news		= $(window).load('./parts/news.html', function(data) {
		$('.jsc-newsList').html(data);
	});
});