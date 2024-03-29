import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import BackgroundManager from '../../background/background-manager';
import { nl2br } from '../../helpers/helpers';


const toImageUrl = url => `/img/${url}`;

class PlaygroundItem extends React.Component {

  // si les effets du background sont actifs ou non
  effectsOn = false;

  constructor( props ) {
    super( props );
    this.invertFilterTo = this.invertFilterTo.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);

    // dans le cas où on arrive sur la page par l'url, on prépare le bg
    this.setBackgroundEffects(true);

    this.unlisten = this.props.history.listen( (location, action ) => {
      if( !/playground/.test(location.pathname) ) {
        this.setBackgroundEffects(false);
      }
      this.unlisten();
    });
  }

  componentWillUnmount() {
    
  }

  /**
   * Applique un filtre inversion sur le canvas du background 
   * Possible d'optimiser en gérant ça en open GL plutot ?
   * @param {number?} val la valeur qui sera appliquée au filtre inversion 
   */
  invertFilterTo( val = 0 ) {
    document.querySelector(".background-canvas").style.filter = `invert(${val}%)`;
    setTimeout(()=>{
      document.querySelector("header").style.filter = `invert(${val}%)`;
    }, 200)
  }

  /**
   * Active ou non les effets sur le fond du site 
   * @param {boolean} active 
   */
  setBackgroundEffects( active = true ) {
    if( active && !this.effectsOn ) {
      this.invertFilterTo(100);
      BackgroundManager.getInstance().playSequence( "playground-underline" );
      BackgroundManager.getInstance().playSequence( "arrow-left" );
      this.effectsOn = true;
    } else if( !active && this.effectsOn ) {
      BackgroundManager.getInstance().stopSequence( "playground-underline" );
      BackgroundManager.getInstance().stopSequence( "arrow-left" );
      this.invertFilterTo(0);
      this.effectsOn = false;
    }
  }

  render() {
    if( this.props.item == null ) {

      return (<div></div>);

    } else {

      let shortenedImages = this.props.item.images.slice();
      shortenedImages.shift();

      return (
        <div className="playground-item">

          <Link to="/playground" className="go-back" onClick={() => { this.setBackgroundEffects(false); }}>back to the playground</Link>

          { this.props.item.link && 
            <a href={this.props.item.link} target="_blank" className="playground-link">try it</a>
          }

          <div className="right-part">
            <h2 className="title">{this.props.item.title}</h2>
            <img src={toImageUrl(this.props.item.images[0].url)} alt={this.props.item.images[0].alt} />
            <p dangerouslySetInnerHTML={ { __html: nl2br(this.props.item.description) } }></p>
            <div className="images">
            {
              shortenedImages.map( (image, idx) => (
                <img src={toImageUrl(image.url)} alt={image.alt} key={idx} />
              ))
            }
            </div>
          </div>
        </div>
      )

    }
  }
}


export default withRouter(PlaygroundItem);