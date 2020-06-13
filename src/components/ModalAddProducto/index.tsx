import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slider from '@material-ui/core/Slider'

import { IModal, IProducto } from '../../pages/types'
import { ListItemText } from '@material-ui/core'

export function ModalAddProducto
  (props: {
    modal: IModal, setModal(modal: IModal): void, handleClose?: any, handleProductoSearch?: any,
    productoAdding: any, handleCantidad?(event: any, newValue: number | number[]): void,
    handleAccept?(e: any): void,
    setproductoAdding(producto: IProducto | null): void,
    maxCant?: number,
    purchasing?: boolean,
    items: IProducto[] | null,
    setItems: any
    productos: IProducto[] | null,
    setSnackbarState: any
  }) {
  const [value, setValue] = React.useState<IProducto | null>(null)
  const [inputValue, setInputValue] = React.useState<string>('')

  const handleChange = ((event: any, producto: string | IProducto) => {
    if (producto && typeof producto !== 'string') {
      setValue(producto)
      props.setproductoAdding(producto)
    }
  })

  const resetModal = () => {
    if (props.productos)
      props.setModal({
        open: false, searchText: "", quantity: 1, textFocused: false, visibleList: false, searchItems: props.productos, itemSelected: false
      })
    else {
      props.setModal({
        open: false, searchText: "", quantity: 1, textFocused: false, visibleList: false, searchItems: null, itemSelected: false
      })
      console.log(props.items, props.modal)
    }
  }

  const handleClose = () => {
    props.setproductoAdding(null)
    resetModal()
    // props.setModal({ ...modal, open: false })
    // console.log(modal)
  }

  const handleAccept = () => {
    console.log('handleAccept', props.productoAdding)
    if (props.productoAdding && !props.productoAdding.cant) {
      setTimeout(() =>
        props.setSnackbarState({ open: true, type: 'warning', text: 'Cantidad no válida' }), 200)
    }
    else if (props.items && props.productoAdding && !props.modal.editing) {
      // Search if already exists the same product
      const existsPreviously = props.items.find(item => item._id === props.productoAdding._id)
      if (existsPreviously) {
        const tempItems = props.items.filter(item => item._id !== existsPreviously._id)
        existsPreviously.cant = String(Number(existsPreviously.cant || 0) + Number(props.productoAdding.cant || 0))
        props.setItems([...tempItems, existsPreviously])
      } else
        props.setItems([...props.items, props.productoAdding])
    } else if (!props.items && props.productoAdding) {
      props.setItems([props.productoAdding])
    } else if (props.items && props.productoAdding && props.modal.editing) {
      // update the existing item
      const tempItems = props.items.filter((item: IProducto) => item._id !== props.productoAdding._id)
      props.setItems([...tempItems, props.productoAdding])
    }
    console.log('after setItems', props.items, props.productoAdding)
    props.setModal({
      ...props.modal,
      visibleList: false, searchItems: props.items
    })
    setTimeout(() => resetModal(), 100)
  }


  const handleCantidad = (event: any, newValue: number | number[]) => {
    if (props.productoAdding)
      props.setproductoAdding({ ...props.productoAdding, cant: '' + newValue })
  }

  return (<Dialog open={props.modal.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">
      {props.modal.editing ? 'Edita el producto' : 'Selecciona un producto'}
    </DialogTitle>
    <DialogContent>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        value={value || ''}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        options={props.modal.searchItems ? props.modal.searchItems : []}
        groupBy={option => option.categoria}
        getOptionLabel={option => option.nombre}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Producto"
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
        renderOption={option => (
          <ListItemText
            primary={option.nombre}
            secondary={`$${option.precio} · ${option.cantidad} restantes`} />
        )}
      />

      <Typography id="discrete-slider" gutterBottom style={{ marginTop: 15 }}>
        Cantidad
      </Typography>
      <Slider
        disabled={!props.productoAdding}
        defaultValue={1}
        getAriaValueText={(value) => `${value}`}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={props.purchasing ? Math.max(props.maxCant || 0, 30) : props.productoAdding ? Math.min(Number(props.productoAdding.cantidad), 10) : 0}
        onChange={handleCantidad}
        value={props.productoAdding ? Number(props.productoAdding.cant || 0) : 0}
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
  </Dialog>)
}