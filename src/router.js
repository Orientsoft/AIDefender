import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/roles',
      models: () => [import('./models/roles')],
      component: () => import('./routes/roles'),
    }, {
      path: '/singlequery',
      models: () => [import('./models/singlequery')],
      component: () => import('./routes/singlequery/'),
    }, {
      path: '/systemquery/:uid',
      models: () => [import('./models/systemquery')],
      component: () => import('./routes/systemquery/'),
    }, {
      path: '/settings',
      models: () => [
        import('./models/settings'),
        import('./models/nodeConfig'),
      ],
      component: () => import('./routes/settings/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/register',
      models: () => [import('./models/register')],
      component: () => import('./routes/register/'),
    }, {
      path: '/singleSource',
      models: () => [import('./models/singleSource')],
      component: () => import('./routes/singleSource/'),
    },
    {
      path: '/metric',
      models: () => [
        import('./models/metric'),
        import('./models/singleSource'),
      ],
      component: () => import('./routes/metric/'),
    },
    {
      path: '/ports',
      models: () => [
        import('./models/ports'),
        import('./models/tasks'),
      ],
      component: () => import('./routes/alerts/ports/'),
    },
    {
      path: '/tasks',
      models: () => [
        import('./models/tasks'),
        import('./models/ports'),
        import('./models/jobs'),
        import('./models/status'),
        import('./models/flows'),
        import('./models/logs'),
      ],
      component: () => import('./routes/alerts/tasks/'),
    },
    {
      path: '/flows',
      models: () => [
        import('./models/flows'),
        import('./models/tasks'),
        import('./models/triggers'),
        import('./models/status'),
        import('./models/jobs'),
      ],
      component: () => import('./routes/alerts/flows/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/settings" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
