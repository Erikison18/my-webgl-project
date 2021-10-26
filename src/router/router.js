import React, { Suspense, lazy }from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
const Shadow = lazy(() => import('../components/shadow/index.jsx'));
const Scene = lazy(() => import('../components/scene/index.jsx'));
const SolarSystem = lazy(() => import('../components/solarSystem/index.jsx'));
const Earth = lazy(() => import('../components/earth/index.jsx'));
const Kongmingdeng = lazy(() => import('../components/kongmingdeng/index.jsx'));
const Chongdong = lazy(() => import('../components/chongdong/index.jsx'));
const Bofang = lazy(() => import('../components/bofang/index.jsx'));

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
                <Route exact path="/kongmingdeng" component={Kongmingdeng}/>
                <Route exact path="/chongdong" component={Chongdong}/>
                <Route exact path="/bofang" component={Bofang}/>
            </Switch>
        </Suspense>
    </HashRouter>
);

export default BasicRoute;
