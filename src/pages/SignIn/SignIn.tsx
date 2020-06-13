import React, { useContext, useState, useEffect } from 'react'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

import * as jwt from 'jsonwebtoken'


// Hooks
import { useSessionState } from '../../hooks/Session/useSessionState'
import { useHistory, Redirect } from 'react-router-dom'


import axios from 'axios'
import { ISnackbar } from '../types'
import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { IonPage } from '@ionic/react'
import { green } from '@material-ui/core/colors'


const host = process.env.REACT_APP_HOST
const port = process.env.REACT_APP_PORT
const apiKey = process.env.REACT_APP_API_KEY

const useStyles = makeStyles((theme) => ({
  background: {
    // backgroundImage: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
    backgroundImage: 'linear-gradient(135deg, rgba(21,101,192,1) 0%, rgba(63,81,181,1) 100%)',
    position: "absolute",
    width: '100%',
    height: '100%',
    color: '#000'
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  snackbar: { [theme.breakpoints.down('xs')]: { bottom: 90 } },
  buttonProgress: {
    color: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -12,
  },
}))

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: '#fff' }
  }
})

interface iLoginResult {
  ok: boolean,
  token: string
}

interface iFormulario {
  username: string,
  password: string,
}

export default function SignIn() {
  const classes = useStyles()
  const { sessionState, setSessionState, } = useSessionState()
  const [formulario, setFormulario] = useState<iFormulario>({ username: "", password: "" })
  const [remember, setRemember] = useState<boolean>(false)
  const history = useHistory()
  const [error, setError] = useState<boolean>(false)
  const [snackbarState, setSnackbarState] = React.useState<ISnackbar>(
    { open: false, type: "success", text: '' }
  )
  const [loging, setLoging] = React.useState(false)


  const handleUsername = (e: any) => {
    setFormulario({ ...formulario, username: e.target.value })
  }

  const handlePassword = (e: any) => {
    setFormulario({ ...formulario, password: e.target.value })
  }

  const toggleRemember = () => {
    setRemember(!remember)
  }

  const closeAlert = () => {
    setSnackbarState({ ...snackbarState, open: false })
  }
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const handleLogin = async () => {
    try {
      if (!loging) {
        setLoging(true)
      }
      const response: iLoginResult = (await axios.post(`${host}/api/login`, formulario, { headers: { "API-KEY": apiKey } })).data
      if (response && response.ok && response.token) {
        setSessionState({ token: response.token, type: 'setTokenRef' })
        if (remember) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('tokenExp', moment.utc().add(15, 'minutes').toISOString())
        }
        setLoging(false)
        history.push('/home')
      }
    } catch (error) {
      setSnackbarState({ type: 'error', text: 'Credenciales incorrectas', open: true })
      setError(true)
    }
  }

  React.useEffect(() => {
    const verifyToken = async () => {
      if (localStorage.getItem('token') && !sessionState.token.length) {
        const token = localStorage.getItem('token')
        if (localStorage.getItem('tokenExp') &&
          moment.utc().isSameOrAfter(moment.utc(localStorage.getItem('tokenExp')))) {
          return false
        }
        if (typeof token === 'string') {
          setSessionState({ token: token, type: 'setTokenRef' })
          history.push('/home')
        }
      }
    }
    verifyToken()
  }, [])

  return (
    <IonPage>

      <ThemeProvider theme={darkTheme} >
        <Container component="main" maxWidth="xs" className={classes.background} >
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon style={{ color: '#fff' }} />
            </Avatar>
            <Typography component="h1" variant="h5" style={{ color: '#fff' }}>
              CloudPos
        </Typography>
            <div className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Usuario"
                autoFocus
                onChange={handleUsername}
                value={formulario?.username}
                error={error}
                style={{ color: '#fff' }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label={error ? "Credenciales incorrectas" : "Contraseña"}
                type="password"
                onChange={handlePassword}
                value={formulario?.password}
                error={error}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="default" onChange={e => toggleRemember()} checked={remember} />}
                label="Mantener sesión"
                style={{ color: '#ddd' }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleLogin}
                disabled={loging}
              >
                {loging ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Continuar'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" style={{ color: '#ddd' }}>
                    ¿Olvidaste tu contraseña?
              </Link>
                </Grid>
              </Grid>
            </div>
          </div>
        </Container>
        <Snackbar open={snackbarState?.open || false} autoHideDuration={6000} onClose={closeAlert} className={classes.snackbar}>
          <Alert onClose={closeAlert} severity={snackbarState.type}>
            {snackbarState.text}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </IonPage>
  )
}