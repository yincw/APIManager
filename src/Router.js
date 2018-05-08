import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  routerRedux,
} from 'dva/router';
import dynamic from 'dva/dynamic';
import Layout from './components/App/Layout';

const { ConnectedRouter } = routerRedux;

function RouteWithLayout({layout, component, ...rest}){
  return (
    <Route {...rest} render={(props) =>
      React.createElement( layout, props, React.createElement(component, props))
    }/>
  );
}

const RouterWrapper = ({ history, app }) => {
  const Async = dynamic({
    app,
    component: () => import('./routes/Async'),
  });

  const PageForbidden = dynamic({
    app,
    component: () => import('./components/PageForbidden'),
  });

  const PageServerError = dynamic({
    app,
    component: () => import('./components/PageServerError'),
  });

  const PageNetworkError = dynamic({
    app,
    component: () => import('./components/PageNetworkError'),
  });

  const PageNotFound = dynamic({
    app,
    component: () => import('./components/PageNotFound'),
  });

  const ApiDetail = dynamic({
    app,
    component: () => import('./components/App/ApiDetail'),
  });

  const LatitudeSearch = dynamic({
    app,
    component: () => import('./components/App/LatitudeSearch'),
  });

  const Settings = dynamic({
    app,
    component: () => import('./components/Settings'),
  });

  const DocumentIndex = dynamic({
    app,
    component: () => import('./components/DocumentIndex'),
  });

  const Log = dynamic({
    app,
    component: () => import('./components/Log'),
  });

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <RouteWithLayout exact layout={Layout} path="/" component={ApiDetail} />
        <RouteWithLayout exact layout={Layout} path="/latitude/search" component={LatitudeSearch} />
        <RouteWithLayout exact layout={Layout} path="/settings" component={Settings} />
        <RouteWithLayout exact layout={Layout} path="/doc/:id" component={DocumentIndex} />
        <RouteWithLayout exact layout={Layout} path="/log" component={Log} />
        {/* 403 */}
        <Route exact path="/403" component={PageForbidden} />
        {/* 500 */}
        <Route exact path="/500" component={PageServerError} />
        {/* 网络错误 */}
        <Route exact path="/error" component={PageNetworkError} />
        {/* 404 */}
        <Route component={PageNotFound} />
      </Switch>
    </ConnectedRouter>
   );
};

RouterWrapper.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

RouterWrapper.defaultProps = {};

export default RouterWrapper;
