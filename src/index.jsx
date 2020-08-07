// Import dependencies
import React from 'react'
import ReactDOM from 'react-dom'
import CreateList from './components/list'
import './assets/css/app.css';

console.log('This line is begin called before app rendering')

// Render the app into the root div
const render = () => {
    console.log('Called')
    ReactDOM.render(<div><h1>Questions</h1><ul><CreateList /></ul></div>, document.getElementById('root'));  // render empty list
}

render()