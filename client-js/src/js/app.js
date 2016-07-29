$( 'form' ).on( 'submit', function( event ){
  event.preventDefault();

  const authData = {
    username: $( 'form input[type="text"]' ).val(),
    password: $( 'form input[type="password"]' ).val()
  };

  const ds = deepstream( 'localhost:6020' );
  ds.login( authData, function( success, loginData ) {
    if( success ) {
      $( '.login' ).hide();
      var isDesktop = $( window ).width() > 800;
      new Board( ds, authData.username, isDesktop );
    } else {
      $( '.login' ).addClass( 'login-error' );
    }
  });
});