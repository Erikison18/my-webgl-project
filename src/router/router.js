import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import GameChess from "../components/gameChess";
import CoreContent from "../components/coreContent";

class About extends React.Component{
    render() {
      return <h3>About</h3>
    }
}

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/"/>
            <Route exact path="/gameChess" component={GameChess}/>
            <Route exact path="/coreContent" component={CoreContent}/>
            <Route exact path="/about" component={About}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;
