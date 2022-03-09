/**
 * Main popup object
 */
popup = {

	/**
	 * The server data of the active tab
	 */
	data: {},

	/**
	 * Initialization script
	 */
	init: function () {
    chrome.tabs.query( { 'active': true, 'currentWindow': true }, tabs => {
			var tab = tabs[0];
      var url = new URL( tab.url );
      var domain = url.hostname;
      domain = domain.replace( 'www.', '' );
 	  	popup.build( domain );
		} );
	},

	/**
	 * Build the popup for the given domain
	 */
	build: function ( domain ) {
    $.get( 'https://www.appropedia.org/w/rest.php/semantic/v0/' + domain, function ( data ) {
      var json = JSON.stringify( data, null, 2 );
      var html = $( '<pre>' ).text( json );
      $( 'body' ).html( html );
    } );
	}
};

$( popup.init );