import React, { Suspense, lazy }from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
const Shadow = lazy(() => import('../components/shadow/index.jsx'));
const Scene = lazy(() => import('../components/scene/index.jsx'));
const SolarSystem = lazy(() => import('../components/solarSystem/index.jsx'));
const Earth = lazy(() => import('../components/earth/index.jsx'));


const BasicRoute = (props) => (
    <HashRouter>
        {props.children}
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/shadow" push />} />
                <Route exact path="/shadow" component={Shadow}/>
                <Route exact path="/scene" component={Scene}/>
                <Route exact path="/solarSystem" component={SolarSystem}/>
                <Route exact path="/earth" component={Earth}/>
            </Switch>
        </Suspense>
    </HashRouter>
);

export default BasicRoute;
