import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import meme from '../abis/meme.json'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https'}) // (the default in Node.js)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {value: '',filepath: " ",accountname:" ",contract:null};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentWillMount(){  
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({accountname:accounts[0]})
    console.log(this.state.accountname)
    const networkID = await web3.eth.net.getId()
    console.log(networkID)
    const networkData = meme.networks[networkID]
    if(networkData){
      const abi = meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi,address)
      this.setState({contract})
      console.log(contract)
      const has =  await contract.methods.get().call()
      console.log(has)
      this.setState({filepath:has})
    }
    else{
      window.alert("smart contract not deployed")
    }
  }

  

  



  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {

    //alert('A name was submitted: ' + this.state.value);
    console.log(this.state.value)
    event.preventDefault();
    for await (const file of ipfs.add(this.state.value)) {
      console.log(file); // or process the file
      console.log(file.path)
      this.setState({filepath:file.path})
      const memehash = file.path
      this.state.contract.methods.set(memehash).send({from:this.state.accountname}).then((r) =>{
      this.setState({filepath:memehash})
      })
      // this.state.filepath = file.path
    }
    console.log(this.state.filepath)
    fetch("https://ipfs.infura.io/ipfs/" + String(this.state.filepath))
      .then(
        (result) => {
          console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error)
        }
      )
  }



  sendfile = (event) => {
    event.preventDefault()
    
   

  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.state.accountname}
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                  </label>
                  <input type="submit" value="Submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
