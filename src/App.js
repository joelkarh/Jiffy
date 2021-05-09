// imports
import React, { Component} from 'react';
//import our 'loader' (its a variabel) so i can use it 
import loader from './images/loader.svg'
import Gif from './video';
import clearbutton from './images/close-icon.svg';
//properties


const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};



const Header = ({clearSearch, hasResults}) =>
  (<div className = "header grid ">
    {hasResults ? <button onClick={clearSearch}> <img alt ='clearence button' src={clearbutton}/> </button> :<h1 className="title" >Jiffy</h1> }
    </div>)
;
/* 
When the search input has more than 2 characters, tell user they can hit enter to search
When there are results, tell the user they can hit enter to search more
If there are some gifs currently loading, show a loading spinner
 */
const Userhint = ({loading, hintText}) => (
<div className="user-hint ">
{loading ? <img className="block mx-auto" src={loader} alt="laoding icon" /> : hintText}
</div>
);


//the component
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm : '',
      hinText: '' ,
      // we have empty array 
      gifs:[]

    }
  }

//We want the a fucntion that searches the giphy apiKey
//fetch and puts the searchTerm  into the query 
//then we can do something with  the results
// we can also write async in our components
searchGiphy = async searchTerm =>{
  this.setState({loading :true});
  try{
    // here we use await keywordto waitour repsonse to come back 
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=WJyeEPvwK1RHVNQXQSFm369kaPtSRxxl&q= // {/*api key$ }
    ${searchTerm}&limit=25&offset=0&rating=g&lang=en`);
    //here convert we data to json 
    const {data} = await response.json();

    if(!data.length){
      throw  `Nothing found for ${searchTerm}`;
    }
    // here we grab a random result from our images 
    const randomGif = randomChoice(data);
    console.log(randomGif);

    this.setState((prevState, props) => ({
      ...prevState,
      //get the first result and put it in the state
      gif: randomGif,
      // here we use our spread to take the previous gifs
      //spread them out, and then add our random gif
      gifs: [...prevState.gifs, randomGif],
      loading: false,
      hintText: `Hit enter to see more ${searchTerm}`,
    }))
  } catch (error) {
    this.setState((prevState,props)=>({
      ...prevState,
      hintText: error,
      loading: false,
    }))
  }
}


  // only show us the text inside the input
  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) =>({
      ...prevState,
      searchTerm: value,
      // When the search input has more than 2 characters, tell user they can hit enter to search
      hintText: value.length > 2 ? `Hit enter to search ${value}`: ''
    }))
}

// here we reset our state  by clearing everythin gout and making it default again .
clearSearch = ()=> {
  this.setState((prevState, props)=>({
    ...prevState,
    searchTerm :'',
    hintText:'',
    gifs : []

  }))
  this.textInput.focus();
}

    // handles the pressing of a button and shows the value
  handleKeypress = event =>{
    const {value} = event.target
    const theKey = event.key;
    if (theKey === 'Enter' && value.length >2 ){
      //here we call our searchGiphy fucntion 
      this.searchGiphy(value);
    }
  }   
  render() {

    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length

    return (

    <div className="page">
      <Header clearSearch={this.clearSearch} hasResults={hasResults} />
      <div className="search grid ">
        {/* its only going to render our video when we got a gif in our state*/ }
        {/*here we loop over array from  our state and we create multipels videos*/}

        {this.state.gifs.map((gif, index)  =>
        <Gif key={index}{... gif}/> )}
    
      {/* gif images */}
      <input type="text" className="input grid-item" placeholder="type something" 
      onChange={this.handleChange} 
      onKeyPress={this.handleKeypress} 
      value = {searchTerm}
      ref ={(input) => {this.textInput= input}}
      />
      </div>
      <Userhint {...this.state}/>
    </div>
  );
}
}

export default App;
