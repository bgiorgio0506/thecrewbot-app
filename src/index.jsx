// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, } from 'react-router-dom';
import { Switch, Redirect, } from 'react-router';
import getLang from './js/langLib';
import './assets/css/app.css';

//LayOut Imports
import AccountLayOut from './components/layouts/AccountLayout';

//Componets import
import CreateList from './components/list';
import CreateHeader from './components/header';
import CreateSettings from './components/settings';
import CreateSubMenu from './components/subMenu';
import CreateSettingsStreamDeck from './components/subMenus/settingsStreamDeck';
import CreateToolbar from './components/toolBar';
import CreateBotSettings from './components/subMenus/settingsBot';
import CreateLiveList from './components/subMenus/liveList';
import CreateClipsList from './components/subMenus/clipsList';
import CreateVideoList from './components/subMenus/videoList';
import CreateCommand from './components/commands';


console.log('This line is begin called before app rendering',);

// Render the app into the root div
const render = () => {
    ReactDOM.render(
        <Router>
            <div id="app">
                <CreateHeader />
                <CreateSubMenu />
                <Redirect exact from="/account" to="/questions" />
                <Switch>
                    <Route exact path='/account/:path?'>
                        <AccountLayOut>
                            <Redirect from="/account" to="/account/lives"/>
                            <Switch>
                                <Route exact path={'/account/lives'} component={CreateLiveList} />
                                <Route exact path={'/account/clips'} component={CreateClipsList} />
                                <Route exact path={'/account/video'} component={CreateVideoList} />
                            </Switch>
                        </AccountLayOut>
                    </Route>
                    <Route exact path='/commands'>
                        <Route exact path='/commands' component={CreateCommand}/>
                    </Route>
                    <Route exact path='/questions' component={CreateList} />
                    <Route excat path='/settings'>
                        <Route exact path='/settings' component={CreateSettings} />
                        <Route path='/settings/streamdeck' component={CreateSettingsStreamDeck} />
                        <Route path='/settings/bot' component={CreateBotSettings} />
                    </Route>
                </Switch>
                <CreateToolbar />
            </div>
        </Router>
        , document.getElementById('root',),);  // render empty list
};

render();
