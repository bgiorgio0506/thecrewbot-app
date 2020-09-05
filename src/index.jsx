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

const langObj = getLang()

console.log('This line is begin called before app rendering')
//{langObj.labels[0]}

// Render the app into the root div
const render = () => {
    console.log('Called')
    ReactDOM.render(
        <Router>
            <div id="app">
                <CreateHeader />
                <Redirect exact from="/" to="/" />
                <Switch>
                    <Route exact path='/' component={CreateList} />
                    <Route path='/settings' component={CreateSettings} />
                </Switch>
            </div>
        </Router>
        , document.getElementById('root'));  // render empty list
}

render()


//static
/*        <div class="center-panel">
    <p class='section'>{langObj.labels[0]}</p>
                <ul><CreateList /></ul>
        </div>
    </div>*/
