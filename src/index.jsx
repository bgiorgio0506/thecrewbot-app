// Import dependencies
import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer, remote} from 'electron'
import App from './components/app'
import Error from './components/error'
import './assets/css/app.css'

console.log('This line is begin called before app rendering')
// Render the app into the root div
const render = ()=>{
    ReactDOM.render(<div>Test.</div>, document.getElementById('root'));
}

render()