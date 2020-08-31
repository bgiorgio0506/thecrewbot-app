// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import CreateList from './components/list';
import CreateHeader from './components/header';
import getLang from './js/langLib';
import './assets/css/app.css';

const langObj  = getLang()

console.log('This line is begin called before app rendering')


// Render the app into the root div
const render = () => {
    console.log('Called')
    ReactDOM.render(
    <div id= "app">
        <CreateHeader/>
        <div class="center-panel">
    <p class='section'>{langObj.labels[0]}</p>
                <ul><CreateList /></ul>
        </div>
    </div>
   , document.getElementById('root'));  // render empty list
}

render()
