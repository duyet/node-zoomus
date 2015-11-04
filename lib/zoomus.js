module.exports = {
	_access_token: '',

	endpoint: 'https://api.zoom.us/v1',

	user_id: '',
	api_key: config.zoomUs.api_key,
	api_secret: config.zoomUs.api_secret,
	data_type: 'JSON',

	/**
	init:function(apiKey,endpoint,type){
		this._apikey = apiKey;
		this.key_type=type;
		this.endpoint = endpoint
	},
	**/
	init: function(user_id, endpoint) {
		if (user_id) this.user_id = user_id;
		if (endpoint) this.endpoint = endpoint;
	},

	getUserId: function() {
		return this.user_id;
	},

	isLogin: function() {
		return this.api_key && this.api_secret;
	},

	login: function(params, success, error) {
		var self = this;
		var method = "user.signin";

		if (!_.isFunction(error)) {
			error = commonError;
		}

		this.api(method, params, function(resp) {
			if (resp.status) {
				self._access_token = resp.result.access_token;

				Zoom.set("access_token", self._access_token);
				success(resp.result);
			} else {
				if (resp.error && resp.error !== undefined) {
					error(resp.error);
				} else {
					error(resp);
				}
			}
		});
	},

	logout: function() {
		var self = this;

		if (this.isLogin()) {
			this.api("user.console.logout", {}, function(resp) {
				self._access_token = "";
				Zoom.set("access_token", "");
			});
		}
	},

	api: function(apiMethod, params, callback) {
		console.log('JS API: ' + apiMethod);

		params.api_key = this.api_key;
		params.api_secret = this.api_secret;
		params.data_type = this.data_type;

		this._postCORS(this.endpoint + apiMethod, params, callback);
	},

	listMeeting: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}
		if (this.isLogin()) {
			this.api("meeting.list", params, function(resp) {
				if (resp.status) {
					success(resp.result);
				} else {
					console.log("console.login failed,code=" + resp.errorCode + " message=" + resp.errorMessage);
					error(resp);
				}
			});
		} else {
			error({
				'status': false,
				'errorCode': 201,
				'errorMessage': 'Please login first'
			});
			console.log("Please login first");
		}
	},

	getMeeting: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}
		this.api("/meeting/get", params, function(resp) {
			if (resp.status) {
				success(resp.result);
			} else {
				error(resp);
			}
		});
	},
	createMeeting: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}

		this.api('/meeting/create', params, function(resp) {
			if (_.has(resp, 'status')) {
				success(resp);
			} else {
				error(resp);
			}
		});

	},

	createUser: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}

		this.api('/user/custcreate', params, function(resp) {
			console.info("ZOOM: Create user response: ", resp);

			if (!resp || resp.error) {
				return error(resp);
			}

			success(resp);
		});
	},

	deleteMeeting: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}

		this.api("meeting.delete", params, function(resp) {
			if (resp.status) {
				success(resp.result);
			} else {
				error(resp);
			}
		});
	},
	updateMeeting: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}
		this.api("meeting.update", params, function(resp) {
			if (resp.status) {
				success(resp.result);
			} else {
				console.log("console.login failed,code=" + resp.errorCode + " message=" + resp.errorMessage);
				error(resp);
			}
		});

	},
	endMeeting: function(params, success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}
		this.api("meeting.end", params, function(resp) {
			if (resp.status) {
				success(resp.result);
			} else {
				console.log("console.login failed,code=" + resp.errorCode + " message=" + resp.errorMessage);
				error(resp);
			}
		});

	},

	getPMI: function(success, error) {
		if (!_.isFunction(error)) {
			error = commonError;
		}
		this.api("meeting.pmi", {}, function(resp) {
			if (resp.status) {
				success(resp.result);
			} else {
				console.log("console.login failed,code=" + resp.errorCode + " message=" + resp.errorMessage);
				error(resp);
			}
		});

	},

	_postCORS: function(url, data, callback) {
		try {
			console.log(data);
			request.post({
				url: url,
				form: data

			}, function(err, httpResponse, body) {
				if (err) console.log(err);

				var resp = {};
				if (body) resp = JSON.parse(body);

				callback(resp);
			});
		} catch (e) {
			console.log("Something went wrong when send REST request", e);
		}
	}, 

	get: function(key, next) {
			var that = this;

			Zoomus.find({
				user_id: that.user_id,
				key: key
			}, function(err, docs) {
				if (err || !docs) {
					console.log(err);
					return next('');
				}

				return next(docs.value || '');
			});
		},

		set: function(key, val) {
			var that = this;

			Zoomus.findOneAndUpdate({
				user_id: that.user_id,
				key: key
			}, {
				value: val
			}, {
				upsert: true
			}, function(err, data) {
				console.log("Zoomus update", err, data);
			});
		}
};