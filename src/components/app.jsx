// Import dependencies
import React from 'react'

// Create main App component
export default class App extends React.Component{

  render() {
    return <div>
      <h1>Hello, {this.props.name}!</h1>
      <p>You are logged as ID: {this.props.id}</p>
      <br></br>
      <p>Expiration of the token: {this.props.exp}</p>
      <br></br>
      <img src={this.props.img} alt="400px" width="400px"/>
      <p>Access groups: {this.props.groups}</p>
    </div>
  }
}