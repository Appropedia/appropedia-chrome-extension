/**
 * Main content script object
 */
contentScript = {

	/**
	 * Color of the current URL
	 */
	green: false,

	/**
	 * Initialization script
	 */
	init: function () {
		contentScript.bind();
		contentScript.background.updateIcon();
	},

	/**
	 * Bind events
	 */
	bind: function () {
		chrome.runtime.onMessage.addListener( contentScript.background.onMessage );
	},

	/**
	 * Sub-object to communicate with the background
	 */
	background: {

		/**
		 * Event handler
		 */
		onMessage: function ( message, sender, sendResponse ) {
			contentScript.background[ message.method ]( message, sender, sendResponse );
		},

		/**
		 * Send the current URL when the background requests it
		 */
		sendURL: function ( message, sender, sendResponse ) {
			sendResponse( document.URL );
		},

		/**
		 * Send the current domain when the background requests it
		 */
		sendDomain: function ( message, sender, sendResponse ) {
			sendResponse( document.domain );
		},

		/**
		 * Ask the background to update the icon
		 */
		updateIcon: function ( callback ) {
			chrome.runtime.sendMessage({ 'method': 'updateIcon', 'domain': document.domain }, callback );
		}
	}
};

contentScript.init();