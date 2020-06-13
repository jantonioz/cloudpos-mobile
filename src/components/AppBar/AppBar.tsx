import React from 'react'

import { IonText } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import BackArrow from '@material-ui/icons/ArrowBack'
import { Typography, Button } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((a: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      '& > * + *': { marginTop: a.spacing(2) },
      zIndex: -999,
    },
    toolbar: {
      minHeight: 128,
      alignItems: 'flex-start',
      paddingTop: a.spacing(1),
      paddingBottom: a.spacing(2),
    },
    normalToolbar: {
      backgroundImage:
        'linear-gradient(-150deg, rgba(5,117,230,1) 0%, rgba(2,27,121,1) 100%)',
    },
    middleToolbar: {
      height: '200%',
      backgroundImage:
        'linear-gradient(-150deg, rgba(255, 255, 255) 0%, rgba(255, 255, 255) 100%)',
    },
    toolbarBg: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: -100,
      width: '100%',
      height: 206,
      backgroundImage:
        'linear-gradient(180deg, rgba(5,117,230,1) 0%, rgba(2,27,121,1) 99%)',
      transform: 'skewY(-6deg)',
      transformOrigin: 'top left',
      // zIndex: 99
    },
    title: {
      alignSelf: 'flex-end',
    },
  })
)

const defaultButton = {
  title: '',
  onClick: <HTMLButtonElement, MouseEvent>() => { },
}

export default function AppBarComponent(props: {
  expanded?: boolean
  title: string
  goBack: boolean
  button?: {
    title: string
    handleClick: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void
  },
  middleFade?: boolean
}) {
  const classes = useStyles()
  const history = useHistory()

  const titleStyles: any = { width: 'auto', flexGrow: 1 }
  if (props.expanded) titleStyles.alignSelf = 'flex-end'

  const getClass = () => {
    if (props.expanded) return classes.toolbar
    if (props.middleFade) return classes.middleToolbar
    return classes.normalToolbar
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" style={{ boxShadow: '0 0 0 0 white' }}>
        <Toolbar
          className={getClass()}
        >
          {props.expanded ? (
            <div className={classes.toolbarBg}></div>
          ) : (
              <div></div>
            )}

          {!props.goBack ? (
            <> </>
          ) : (
              <IconButton
                onClick={() => {
                  history.goBack()
                }}
              >
                <BackArrow style={{ color: '#fff' }} />
              </IconButton>
            )}
          <Typography variant="h6" style={titleStyles}>
            {props.title}
          </Typography>
          {props.button && props.button.title && props.button.handleClick ? (
            <Button color="inherit" onClick={props.button.handleClick}>
              {props.button.title}
            </Button>
          ) : (
              <></>
            )}
        </Toolbar>
      </AppBar>
    </div>
  )
}
