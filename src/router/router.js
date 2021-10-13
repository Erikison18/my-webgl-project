import React, { Suspense, lazy }from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
const Shadow = lazy(() => import('../components/shadow/index.jsx'));
const Triangle = lazy(() => import('../components/triangle/index.jsx'));

const BasicRoute = () => (
    <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/shadow" push />} />
                <Route exact path="/shadow" component={Shadow}/>
                <Route exact path="/triangle" component={Triangle}/>
            </Switch>
        </Suspense>
    </HashRouter>
);

export default BasicRoute;
