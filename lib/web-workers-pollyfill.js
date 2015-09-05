(function(name, window, document, factory) {

    if (typeof define === 'function') { // RequireJS
        define(function() { return factory(window, document); });
    } else if (typeof module !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory(window, document);
    } else { // Browser
        this[name] = factory(window, document);
    }

})('Worker', window, document, function(window, document, undefined) {

	if (window.Worker && !window.forceIframeWorker) { return window.Worker; }

	var nativeWorker = window.Worker,

		_noop = function() {},

		// memoize our container to place the iframe
		_getContainer = (function() {
			var container;
			return function() {
				return container || (container = document.getElementsByTagName('head')[0] || document.body);
			};
		}()),

		// mini extend
		_extend = function(base, obj) {
			for (var key in obj) {
				base[key] = obj[key];
			}
			return base;
		},

		_injectScript = function(doc, scriptSrc, callback) {
			var script = doc.createElement('script');
			script.src = scriptSrc;
			script.onload = script.onreadystatechange = function() {
				if (script.readyState && script.readyState !== 'loaded' && script.readyState !== 'complete') { return; }

				doc.body.removeChild(script);

				script.onload = script.onreadystatechange = null;
				script = null;

				if (callback) { callback(); }
			};
			doc.body.appendChild(script);
		},

		_createiframe = function() {
			var iframe = document.createElement('iframe');
			_extend(iframe.style, {
				// visually hidden styles from bootstrap
				visibility: 'hidden',
				width:      '1px',
				height:     '1px',
				position:   'absolute',
			    border:     '0',
			    clip:       'rect(0 0 0 0)',
			    margin:     '-1px',
			    overflow:   'hidden',
			    padding:    '0'
			});
			return iframe;
		};

	var Worker = function(script) {
		var self = this;
			// prepare and inject iframe
			iframe = self._iframe = _createiframe();

		iframe.onload = iframe.onreadystatechange = function() {
			if (this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete') { return; }

			iframe.onload = iframe.onreadystatechange = null;

			var w = this.contentWindow,
				doc = this.contentWindow.document;

			// Some interfaces within the Worker scope.

			w.Worker = Worker; // yes, worker could spawn another worker!
			w.onmessage = _noop; // placeholder function

			var postMessage = w.postMessage = w.workerPostMessage = function(data) {
				self.onmessage.call(self, {
					currentTarget: self,
					timeStamp: (new Date()).getTime(),
					srcElement: self,
					target: self,
					data: data
				});
			};

			// IE doesn't allow overwriting postMessage
			// if (w.postMessage !== postMessage) {}

			w.close = function() {
				self.terminate();
			};

			w.importScripts = function() {
				var idx = 0,
					length = arguments.length,
					arg;
				for (; idx < length; idx++) {
					arg = arguments[idx];
					_injectScript(doc, Worker.baseURI + arg);
				}
			};

			// inject worker script into iframe
			_injectScript(doc, Worker.baseURI + script, function() {
				self._queue.push = function(callback) {
					if (!self._isUnloaded) {
						callback();
					}
				};
				if (!self._isUnloaded) {
					while (self._queue.length) {
						(self._queue.shift())();
					}
				}
			});
		};

		iframe.src = Worker.iframeURI;
		_getContainer().appendChild(iframe);

		self._queue = [];
		self._isUnloaded = false;
	};

	_extend(Worker, {
		notNative: true,
		nativeWorker: nativeWorker,
		iframeURI: './worker.iframe.html',
		baseURI: ''
	});

	Worker.prototype = {
		addEventListener: _noop,
		removeEventListener: _noop,
		onmessage: _noop,

		postMessage: function(obj) {
			var worker = this;
			setTimeout(function() {
				worker._queue.push(function() {
					// IE8 throws an error if we call iframe.contentWindow.onmessage() directly
					var win = worker._iframe.contentWindow,
						onmessage = win.onmessage;
					onmessage.call(win, { data: obj });
				});
			}, 0);
		},

		terminate: function() {
			if (!this._isUnloaded) {
				_getContainer().removeChild(this._iframe);
			}
			this._iframe = null;
			this._isUnloaded = true;
		}
	};

	return Worker;

});