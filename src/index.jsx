// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import CreateList from './components/list';
import CreateHeader from './components/header';
import './assets/css/app.css';

console.log('This line is begin called before app rendering')


// Render the app into the root div
const render = () => {
    console.log('Called')
    ReactDOM.render(
    <div id= "app">
        <CreateHeader/>
        <div class="center-panel">
            <p class='section'>QUESTIONS</p>
                <ul><CreateList /></ul>
        </div>
    </div>
   , document.getElementById('root'));  // render empty list
}

render()
