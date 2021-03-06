import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import axios from 'axios'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import { useHistory, Redirect } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import SendIcon from '@material-ui/icons/SendOutlined'
import ListComponent from '../../components/List/List.component'
import AppBarComponent from '../../components/AppBar/AppBar'

import { ModalAddProducto } from '../../components/ModalAddProducto'
import { ModalPersona } from '../../components/ModalPersona'

// Hooks
import { useSessionState } from '../../hooks/Session/useSessionState'

// Types
import { IModal, IModalPersona, ISnackbar, IProducto } from '../types'

// eslint-disable-line
const useStyles = makeStyles((a: Theme) => createStyles({
  listbox: { "& ul": { padding: 0, margin: 0 } }, root: { flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }, }, menuButton: { marginRight: a.spacing(2) }, title: { flexGrow: 1, display: "none", [a.breakpoints.up("sm")]: { display: "block" }, color: "#fff" }, search: { position: "relative", borderRadius: a.shape.borderRadius, backgroundColor: "linear-gradient(0deg, #02aab0 30%, #00cdac 90%)", "&:hover": { backgroundColor: fade(a.palette.common.white, .25), marginLeft: "0", transition: "125ms" }, "&$focus": {}, marginLeft: "40%", width: "100%", [a.breakpoints.up("sm")]: { marginLeft: a.spacing(1), width: "auto" } }, searchIcon: { padding: a.spacing(0, 2), height: "100%", position: "absolute", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }, inputRoot: { color: "inherit" }, inputInput: { padding: a.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${a.spacing(4)}px)`, transition: a.transitions.create("width"), width: "100%", [a.breakpoints.up("sm")]: { width: "12ch", "&:focus": { width: "20ch" } } }, fab: { position: "absolute", bottom: a.spacing(2), right: a.spacing(2) }, fabSend: { position: "absolute", bottom: a.spacing(2), left: a.spacing(2) }, extendedIcon: { marginRight: a.spacing(1), }, snackbar: { [a.breakpoints.down('xs')]: { bottom: 90 } },
}))

const host = process.env.REACT_APP_HOST
const apiKey = process.env.REACT_APP_API_KEY


const VentasPage: React.FC = (props) => {
  const classes = useStyles()
  const history = useHistory()

  const session = useSessionState()

  // current venta list
  const [items, setItems] = React.useState<IProducto[] | null>(null)
  // selected item -- maybe not nesseary
  const [productoAdding, setproductoAdding] = React.useState<IProducto | null>()
  // list of productos from cloud fetch
  const [productos, setProductos] = React.useState<IProducto[] | null>()
  //cloud loading state
  const [isLoading, setLoading] = React.useState(true)
  // modal state
  const [modal, setModal] = React.useState<IModal>({
    open: false, searchText: "", quantity: 1, textFocused: false, visibleList: false, searchItems: null, itemSelected: false,
    editing: false
  })

  const [modalCliente, setModalCliente] = React.useState<IModalPersona>({ open: false, name: "" })

  const [snackbarState, setSnackbarState] = React.useState<ISnackbar>(
    { open: false, type: "success", text: '' }
  )


  const closeAlert = () => {
    setSnackbarState({ ...snackbarState, open: false })
  }
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('fetching')
        const response = await axios.get(`${host}/api/productos`, { headers: { "API-KEY": apiKey, "AUTH-TOKEN": session.sessionState.token } })
        const json = await response.data
        const response_data: IProducto[] = json.map((item: IProducto) => ({
          nombre: item.nombre,
          detalle: `${item.precio} · ${item.categoria}`,
          _id: item._id,
          cantidad: item.cantidad,
          precio: item.precio,
          categoria: item.categoria
        }))
        console.log(response_data)
        setProductos(response_data)
        setModal({ ...modal, searchItems: response_data })
        setLoading(false)
      } catch (error) {
        console.log("error", error)
        setLoading(false)
      }
    }
    fetchProductos()
  }, [snackbarState, session.sessionState])


  if (!session.sessionState.token.length) {
    return <Redirect to="/signin" />
  }


  const handleClickOpen = () => {
    if (productos)
      setModal({ ...modal, searchItems: productos || null, open: true })
    else {
      // re fetch productos
      setSnackbarState({ ...snackbarState })
    }
  }

  const handleOpenModalClient = () => {
    setModalCliente({ ...modalCliente, open: true })
  }

  const handleSend = async (e: any) => {
    setModalCliente({ ...modalCliente, open: false })
    try {
      const response = await axios.post(`${host}/api/sales`, { items, clientName: modalCliente.name }, { headers: { "API-KEY": apiKey, "AUTH-TOKEN": session.sessionState.token } })

      console.log(response.data)
      setSnackbarState({ open: true, type: 'success', text: 'Compra guardada con éxito' })
      setItems(null)
    } catch (error) {
      console.log(error)
      setSnackbarState({ open: true, type: 'error', text: error.message })
    }
  }

  const handleModalClienteCancel = () => {
    setModalCliente({ ...modalCliente, open: false })
  }

  const handleEdit = (item: IProducto) => {
    setproductoAdding({ ...item })
    setModal({
      open: true, searchText: item.nombre, quantity: Number(item.cant) || 1,
      textFocused: false, visibleList: false, searchItems: null, itemSelected: false,
      editing: true
    })
  }

  const handleDelete = (del: IProducto) => {
    // remove the item from the list
    const tempItems = items && items.filter((item: IProducto) => item._id !== del._id)
    if (Array.isArray(tempItems) && tempItems.length)
      setItems([...tempItems])
    else
      setItems([])
  }

  return isLoading ? <p>loading</p> : (
    <IonPage>
      <IonHeader>
        <AppBarComponent goBack={true} title="Venta" key="venta-key" />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Menu Principal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ListComponent
          items={items}
          emptyText={"Agrega cosas al carrito"}
          onEdit={handleEdit}
          onDelete={handleDelete} />
        <Fab disabled={!(items && items.length)} className={classes.fabSend} color='secondary' variant='extended' onClick={handleOpenModalClient}>
          <SendIcon className={classes.extendedIcon} />
          Enviar
        </Fab>
        <Fab className={classes.fab} color='secondary' onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
        <ModalAddProducto
          items={items}
          setItems={setItems}
          modal={modal}
          setModal={setModal}
          productos={productos || null}
          setSnackbarState={setSnackbarState}
          productoAdding={productoAdding}
          setproductoAdding={setproductoAdding} />

        <ModalPersona
          modal={modalCliente}
          setModal={setModalCliente}
          handleAccept={handleSend}
          handleCancel={handleModalClienteCancel} />
        <Snackbar open={snackbarState?.open || false} autoHideDuration={6000} onClose={closeAlert} className={classes.snackbar}>
          <Alert onClose={closeAlert} severity={snackbarState.type}>
            {snackbarState.text}
          </Alert>
        </Snackbar>
      </IonContent>
    </IonPage >
  )
}

export default VentasPage