// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router,Route} from 'react-router-dom'
import getLang from './js/langLib';
import './assets/css/app.css';

//Componets import
import CreateList from './components/list';
import CreateHeader from './components/header';
import CreateSettings from './components/settings'

const langObj  = getLang()

console.log('This line is begin called before app rendering')
//{langObj.labels[0]}

// Render the app into the root div
const render = () => {
    console.log('Called')
    ReactDOM.render(
    <div id= "app">
        <CreateHeader/>
        <Router>
            <div>
                <Route path='/' component={CreateList}/>
                <Route path='/settings' component={CreateSettings}/>
            </div>
        </Router>
    </div>
   , document.getElementById('root'));  // render empty list
}

render()


//static
/*        <div class="center-panel">
    <p class='section'>{langObj.labels[0]}</p>
                <ul><CreateList /></ul>
        </div>
    </div>*/
