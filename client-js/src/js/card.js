var template =
  '<div class="card large-card">' +
    '<div class="card-header">' +
    '</div>' +
    '<div class="card-inner">' +
      '<textarea class="card-copy"></textarea>' +
    '</div>' +
  '</div>';

class Card {

  constructor( record, isDesktop ) {
    this.element = $( template );
    this.textArea = this.element.find( '.card-copy' );

    this.record = record;

    this.createCard();
    this.addContent();
    isDesktop && this.addPositioning();
  }

  createCard() {
    this.element
      .attr( 'data-type', this.record.get( 'type' ) );
  }

  addContent() {
    this.record.subscribe( 'content', ( value ) => {
      this.textArea.val( value );
    }, true );

    this.textArea.keyup( () => {
      this.record.set( 'content', this.textArea.val() );
    } );
  }

  createCard() {
    this.element
      .attr( 'data-type', this.record.get( 'type' ) );
  }

  addContent() {
    this.record.subscribe( 'content', ( value ) => {
      this.textArea.val( value );
    }, true );

    this.textArea.keyup( () => {
      this.record.set( 'content', this.textArea.val() );
    } );
  }

  addPositioning() {
    this.element
      .css( 'position', 'absolute' )
      .draggable( {
        handle: ".card-header",
        zIndex: 999,
        // Prevent jQuery draggable from updating the DOM's position and
        // leave it to the record instead.
        helper: function(){ return $( '<i></i>' ); },
        drag: ( event, ui ) => {
          this.record.set( 'position', {
            top: ui.position.top,
            left: ui.position.left
          } );
        }
      } );

    this.record.subscribe( 'position', ( position ) => {
      if( position ) {
        this.element.css( {
          left: position.left,
          top: position.top
        } );
      }
    }, true );
  }

  getElement() {
    return this.element;
  }

  destroy() {
    this.element.remove();
  }
}

window.Card = Card;