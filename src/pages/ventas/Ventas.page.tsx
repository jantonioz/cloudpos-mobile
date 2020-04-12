import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react'
import React from 'react'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import Fab from '@material-ui/core/Fab'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slider from '@material-ui/core/Slider'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import TinyVirtualList from 'react-tiny-virtual-list'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import BackArrow from '@material-ui/icons/ArrowBack'
import SendIcon from '@material-ui/icons/SendOutlined'
import ListComponent from '../../components/List/List.component'
import AppBarComponent from '../../components/AppBar/AppBar'

// eslint-disable-line
const useStyles = makeStyles((a: Theme) => createStyles({
  listbox: { "& ul": { padding: 0, margin: 0 } }, root: { flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }, }, menuButton: { marginRight: a.spacing(2) }, title: { flexGrow: 1, display: "none", [a.breakpoints.up("sm")]: { display: "block" }, color: "#fff" }, search: { position: "relative", borderRadius: a.shape.borderRadius, backgroundColor: "linear-gradient(0deg, #02aab0 30%, #00cdac 90%)", "&:hover": { backgroundColor: fade(a.palette.common.white, .25), marginLeft: "0", transition: "125ms" }, "&$focus": {}, marginLeft: "40%", width: "100%", [a.breakpoints.up("sm")]: { marginLeft: a.spacing(1), width: "auto" } }, searchIcon: { padding: a.spacing(0, 2), height: "100%", position: "absolute", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }, inputRoot: { color: "inherit" }, inputInput: { padding: a.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${a.spacing(4)}px)`, transition: a.transitions.create("width"), width: "100%", [a.breakpoints.up("sm")]: { width: "12ch", "&:focus": { width: "20ch" } } }, fab: { position: "absolute", bottom: a.spacing(2), right: a.spacing(2) }, fabSend: { position: "absolute", bottom: a.spacing(2), left: a.spacing(2) }, extendedIcon: { marginRight: a.spacing(1), }, snackbar: { [a.breakpoints.down('xs')]: { bottom: 90 } },
}))

const host = "192.168.0.23"
const port = "4000"
// const URL = '192.168.0.23:4000/api/productos'


interface ISnackbar {
  open?: boolean,
  type: "success" | "warning" | "error" | "info",
  text?: string,
}
interface IProducto {
  nombre: string,
  _id: string,
  cantidad: string,
  detalle: string,
  precio: string,
  categoria: string,
  cant?: string,
  usuarioId: string,
  iconId: string,
  productoId?: string
}

interface IModal {
  open: boolean,
  searchText: string,
  quantity: number,
  textFocused: boolean,
  visibleList: boolean,
  searchItems: IProducto[] | null,
  itemSelected: boolean
}

interface IModalC {
  open: boolean,
  name: string,
}

const Home: React.FC = (props) => {
  const classes = useStyles()
  const history = useHistory()
  // appbar's search text
  const [searchText, setSearchText] = React.useState("")
  // current venta list
  const [items, setItems] = React.useState<IProducto[] | null>(null)
  // selected item -- maybe not nesseary
  const [productoAdding, setproductoAdding] = React.useState<IProducto | null>()
  // list of productos from cloud fetch
  const [productos, setProductos] = React.useState<IProducto[] | null>()
  // virtual list based on search text
  const [searchItems, setSearchItems] = React.useState<IProducto[] | null>()
  //cloud loading state
  const [isLoading, setLoading] = React.useState(true)
  // modal state
  const [modal, setModal] = React.useState<IModal>({
    open: false, searchText: "", quantity: 1, textFocused: false, visibleList: false, searchItems: null, itemSelected: false
  })

  const [modalCliente, setModalCliente] = React.useState<IModalC>({ open: false, name: "" })

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
        const response = await axios.get(`http://${host}:${port}/api/productos`)
        const json = await response.data
        const response_data: IProducto[] = json.map((item: IProducto) =>
          ({
            nombre: item.nombre,
            detalle: `${item.precio} · ${item.categoria}`,
            _id: item._id,
            cantidad: item.cantidad,
            precio: item.precio,
            categoria: item.categoria
          })
        )
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
  }, [snackbarState])


  const handleClickOpen = () => {
    setModal({ ...modal, open: true })
  }

  const resetModal = () => {
    if (productos)
      setModal({
        open: false, searchText: "", quantity: 1, textFocused: false, visibleList: false, searchItems: productos, itemSelected: false
      })
    else {
      console.log(items, modal)
    }
  }

  const handleClose = () => {
    setproductoAdding(null)
    resetModal()
    // setModal({ ...modal, open: false })
    console.log(modal)
  }

  const handleAccept = () => {
    if (items && productoAdding) {
      setItems([...items, productoAdding])
    } else if (!items && productoAdding) {
      setItems([productoAdding])
    } else {
    }
    console.log(items, productoAdding)
    setModal({
      ...modal,
      visibleList: false, searchItems: items
    })
    setTimeout(() => resetModal(), 100)
  }

  const handleProductoSearch = (e: any) => {
    const searchText = e.target.value
    const filteredItems: IProducto[] | null = (productos && productos.length) ? productos.filter((item: IProducto) => item.nombre.toLowerCase().includes(searchText)) : null


    setModal({ ...modal, searchText, searchItems: filteredItems })
    console.log(e.target.value, modal.searchText, filteredItems)
  }

  const handleCantidad = (event: any, newValue: number | number[]) => {
    if (productoAdding)
      setproductoAdding({ ...productoAdding, cant: '' + newValue })
  }

  // cart search  --just highlight
  const handleSearch = (e: any) => {
    setModal(e.target.value)
    if (items && items.length)
      setSearchItems(
        items.filter(item => (item &&
          [item.nombre, item.detalle]
            .some(s =>
              s.toLowerCase().includes(e.target.value.toLowerCase())
            ))
        ))
  }

  const handleSend = (e: any) => {
    fetch(`http://${host}:${port}/api/sales`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    }).then(
      (response) => {
        console.log(response.json)
        setSnackbarState({ open: true, type: 'success', text: 'Compra guardada con éxito' })
        setItems(null)
      }
    )
  }

  const rowRenderer = ({ key, index }: any) => {
    if (modal && modal.searchItems && modal.searchItems[index]) {
      const renderItem = modal.searchItems[index]
      const visible = Number(renderItem.cantidad) > 0 ? true : false
      return (
        <ListItem
          button
          disabled={!visible}
          key={index}
          // selected={selectedIndex === 0}
          onClick={event => {
            // console.log(event, index)
            if (modal && modal.searchItems && modal.searchItems.length && modal.searchItems[index]) {
              setproductoAdding({ ...modal.searchItems[index], productoId: modal.searchItems[index]._id })
              setModal({ ...modal, visibleList: false, searchText: modal.searchItems[index].nombre })
            }
          }}
        >
          <ListItemText
            primary={modal.searchItems[index].nombre}
            secondary={`${modal.searchItems[index].detalle} · ${modal.searchItems[index].cantidad} unidades restantes`} />
        </ListItem>
      )
    }
    return <p></p>
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
        <ListComponent items={items} />
        <Fab disabled={!(items && items.length)} className={classes.fabSend} color='secondary' variant='extended' onClick={handleSend}>
          <SendIcon className={classes.extendedIcon} />
          Enviar
        </Fab>

        <Fab className={classes.fab} color='secondary' onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
        <Dialog open={modal.open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Selecciona un producto</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Nombre producto"
              type="text"
              fullWidth
              onChange={handleProductoSearch}
              value={modal.searchText}
              onFocus={() => setModal({ ...modal, visibleList: true })}
            />

            {modal.visibleList &&
              <TinyVirtualList
                width='100%'
                height={200}
                itemCount={modal.searchItems ? modal.searchItems.length : 0}
                itemSize={100}
                renderItem={rowRenderer}
              />}
            <Typography id="discrete-slider" gutterBottom style={{ marginTop: 15 }}>
              Cantidad
            </Typography>
            <Slider
              disabled={!productoAdding}
              defaultValue={1}
              getAriaValueText={(value) => `${value}`}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={productoAdding ? Math.min(Number(productoAdding.cantidad), 10) : 0}
              onChange={handleCantidad}
              value={productoAdding ? Number(productoAdding.cant || 0) : 0}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={handleAccept} color="primary">
              Aceptar
          </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbarState?.open || false} autoHideDuration={6000} onClose={closeAlert} className={classes.snackbar}>
          <Alert onClose={closeAlert} severity={snackbarState.type}>
            {snackbarState.text}
          </Alert>
        </Snackbar>
      </IonContent>
    </IonPage >
  )
}

export default Home