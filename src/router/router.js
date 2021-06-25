import React, { Suspense, lazy }from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
// import GameChess from "../components/gameChess";
// import CoreContent from "../components/coreContent";
// import SeniorGuidance from "../components/seniorGuidance";
const GameChess = lazy(() => import('../components/gameChess'));
const CoreContent = lazy(() => import('../components/coreContent'));
const SeniorGuidance = lazy(() => import('../components/seniorGuidance'));

class About extends React.Component{
    render() {
      return <h3>About</h3>
    }
}

const BasicRoute = () => (
    <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/"/>
                <Route exact path="/gameChess" component={GameChess}/>
                <Route exact path="/coreContent" component={CoreContent}/>
                <Route exact path="/seniorGuidance" component={SeniorGuidance}/>
                <Route exact path="/about" component={About}/>
            </Switch>
        </Suspense>
    </HashRouter>
);

export default BasicRoute;
