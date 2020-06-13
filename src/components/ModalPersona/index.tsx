import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { IModalPersona } from '../../pages/types'

export function ModalPersona(props: { modal: IModalPersona, setModal(modal: IModalPersona): void, handleAccept(e: any): void, handleCancel(e: any): void }) {

  const handleChange = (e: any) => {
    // console.log(e.target.value)
    props.setModal({ ...props.modal, name: e.target.value })
  }

  return (
    <Dialog open={props.modal.open} onClose={props.handleCancel}>
      <DialogTitle id="cliente-name-diag-title">Nombre del cliente</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Cliente"
          onChange={handleChange}
          value={props.modal.name}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCancel} color="primary">
          Cancel
          </Button>
        <Button onClick={props.handleAccept} color="primary">
          Aceptar
          </Button>
      </DialogActions>
    </Dialog>
  )
}