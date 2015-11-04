var Zoom = require('./index');

Zoom.init('1');
Zoom.login({
	email: 'lvduit08@gmail.com',
	password: 'just_for_test'
}, function(result) {
	console.log(result);
}, function(err) {
	console.error(err);
});


Zoom.listMeeting({
	page_size: 10,
	page_number: 1
}, function(results) {
	console.log(results);
});
