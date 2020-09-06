// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route} from 'react-router-dom'
import { Switch, Redirect } from 'react-router'
import getLang from './js/langLib';
import './assets/css/app.css';

//Componets import
import CreateList from './components/list';
import CreateHeader from './components/header';
import CreateSettings from './components/settings';
import CreateSubMenu from './components/subMenu';

const langObj = getLang()

console.log('This line is begin called before app rendering')
//{langObj.labels[0]}

// Render the app into the root div
const render = () => {
    console.log('Called')
    ReactDOM.render(
        <Router>
            <div id="app">
                <CreateHeader/>
                <CreateSubMenu />
                <Redirect exact from="/" to="/" />
                <Switch>
                    <Route exact path='/' component={CreateList}/>
                    <Route excat path='/settings' component={CreateSettings} />
                </Switch>
            </div>
        </Router>
        , document.getElementById('root'));  // render empty list
}

render()
