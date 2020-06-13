import React from 'react'
import DOTENV from 'dotenv'
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

// Date Picker
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

// Pages
import MenuPrincipal from './pages/menu-principal/MenuPrincipal.page'
import Ventas from './pages/ventas/Ventas.page'
import HistoryVentas from './pages/history/HistoryVenta.page'
import HistoryCompra from './pages/history/HistoryCompra.page'
import Inventory from './pages/inventory/Inventory.page'
import Compras from './pages/compras/Compras.page'
import SignIn from './pages/SignIn/SignIn'
import Performance from './pages/performance/Performance'


// Privider
import { SessionProvider } from './hooks/Session/SessionProvider'
import { useSessionState } from './hooks/Session/useSessionState'
import { SessionState } from './hooks/Session/SessionContext'


DOTENV.config()
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#3f51b5',
    },
    type: 'light'
  },
})



const App: React.FC = () => {
  const session = useSessionState()
  const findLocalLogin = () => {
    if (!localStorage.getItem('token')) {
      console.log('App.tsx', 'not found token')
      return <Redirect to="/signin" />
    }
    else {
      const token = localStorage.getItem('token')
      if (typeof token === 'string') {
        console.log('localstorage found', token)
        session.setSessionState({ token: token, type: 'setTokenRef' })
        return <Redirect to="/home" />
      }
    }
  }
  return (<SessionProvider>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/signin" component={SignIn} exact={true} />
              <Route path="/home" component={MenuPrincipal} exact={true} />
              <Route path="/ventas" exact={true} component={Ventas} />
              <Route path="/compras" exact={true} component={Compras} />
              <Route path="/historiales/ventas" exact={true} component={HistoryVentas} />
              <Route path="/historiales/compras" exact={true} component={HistoryCompra} />
              <Route path="/inventory" exact={true} component={Inventory} />
              <Route path="/reportes" exact={true} component={Performance} />
              <Route exact path="/" render={findLocalLogin} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp >
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </SessionProvider>)
}

export default App
