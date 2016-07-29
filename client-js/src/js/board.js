class Board {

  constructor( ds, username, isDesktop ) {
    this.ds = ds;
    this.username = username;
    this.boardElement = $( '.board' );
    this.cards = {};

    this.isDesktop = isDesktop;
    if( this.isDesktop ) {
      this.enableDragAdding();
    } else {
      this.enableClickAdding();
    }

    $( '.eraser' ).click( this.clearBoard.bind( this ) );

    this.cardList = this.ds.record.getList( 'boards/example-board' );
    this.cardList.on( 'entry-added', this.onCardAdded.bind( this ) );
    this.cardList.on( 'entry-removed', this.onCardRemoved.bind( this ) );
    this.cardList.whenReady( this.onCardsLoaded.bind( this ) );
  }

  onCardAdded( cardID ) {
    var record = this.ds.record.getRecord( cardID );
    record.whenReady( ( record ) => {
      this.cards[ cardID ] = new Card( record, this.isDesktop  );
      this.boardElement.append( this.cards[ cardID ].getElement());
    } );
  }

  onCardRemoved( cardID ) {
    this.cards[ cardID ].destroy();
  }

  clearBoard() {
    //This only does a soft clear
    this.cardList.setEntries( [] );
  }

  onCardsLoaded() {
    var entries = this.cardList.getEntries();
    for( var i=0; i < entries.length; i++ ) {
      this.onCardAdded( entries[ i ] );
    }
  }

  addItem( properties ) {
    var newCardID = `cards/${this.ds.getUid()}`;
    var newCard = this.ds.record.getRecord( newCardID );
    newCard.whenReady( ( record ) => {
      console.log( properties );
      record.set( properties );
      this.cardList.addEntry( newCardID );
    } );
  }

  enableDragAdding() {
    $( '.small-card' ).draggable( {
      helper: 'clone',
      stop: ( event, ui ) => {
        this.addItem( {
          position: {
            left: ui.offset.left,
            top: ui.offset.top,
          },
          content: '',
          type: ui.helper.attr( 'data-type' ),
          owner: this.username
        } );
      }
    } );
  }

  enableClickAdding() {
    function addCard( type, e) {
      this.addItem( {
        position: this.getRandomPosition(),
        content: '',
        type: type,
        owner: this.username
      } );
      $( window ).scrollTop( this.boardElement.height() + 100 );
    }
    $( '.small-card[data-type="mad"]' ).click( addCard.bind( this, 'mad' ));
    $( '.small-card[data-type="sad"]' ).click( addCard.bind( this, 'sad' ));
    $( '.small-card[data-type="happy"]' ).click( addCard.bind( this, 'happy' ));
  }

  getRandomPosition() {
    return {
      top: this.getRandomInt( 0, 800 ),
      left: this.getRandomInt( 300, 1000 )
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

window.Board = Board;