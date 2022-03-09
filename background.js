background = {

	/**
	 * Data from the server
	 */
	data: {},

	/**
	 * Initialization script
	 */
	init: function () {
    this.bind();

    // Get data from the server
    let params = new URLSearchParams( {
      action: 'askargs',
      format: 'json',
      formatversion: 2,
      api_version: 2,
      conditions: 'Type::Organization|Green_hosting::t',
      printouts: 'Site|Green_hosting'
    } );
		fetch( "https://www.appropedia.org/w/api.php?" + params.toString() )
		.then( response => response.json() )
		.then( json => {
		  let results = json.query.results;
		  for ( let page in results ) {
        let site = results[ page ].printouts.Site[0];
        let url = new URL( site );
        let domain = url.hostname.replace( 'www.', '' );
        let green = results[ page ].printouts.Green_hosting[0];
        if ( green === 't' ) {
          background.data[ domain ] = 'green';
        } else {
          background.data[ domain ] = 'red';
        }
      }
		} );
  },

	/**
	 * Bind events
	 */
	bind: function () {
		chrome.tabs.onUpdated.addListener( this.onUpdated );
		chrome.tabs.onActivated.addListener( this.onActivated );
	},

  /**
	 * Fires when a page is loaded or reloaded
	 */
  onUpdated: function( tabId, changeInfo, tab ) {
      let color = background.getColor( tab.url );
      background.updateIcon( tabId, color );
  },

  /**
	 * Fires when a tab is selected
	 */
  onActivated: function( activeInfo ) {
    chrome.tabs.query( { active: true, currentWindow: true }, tabs => {
      let tab = tabs[0];
      let color = background.getColor( tab.url );
      background.updateIcon( tab.id, color );
    } );
  },

  /**
   * Update the icon of the current tab
   */
  updateIcon: function ( tabId, color ) {
    let path = 'images/' + color + '19.png';
  	chrome.action.setIcon( { 'tabId': tabId, 'path': path } );
  },

	/**
	 * Get the color of the given URL
	 */
	getColor: function ( url ) {
	  let color = 'grey';
	  if ( url ) {
      url = new URL( url );
      let domain = url.hostname.replace( 'www.', '' );
  	  if ( background.data[ domain ] ) {
  	    color = background.data[ domain ];
  	  }
	  }
	  return color;
	}
};

background.init();