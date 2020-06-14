import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { DialogComponent } from '../components/dialog/dialog.component'
import { Observable } from 'rxjs'
import { take, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialogRef: MatDialogRef<DialogComponent>
  constructor(private dialog: MatDialog) { }

  public openDialog(options: any) {
    const config = new MatDialogConfig()
    config.width = options.width || '500px'
    config.height = options.height
    config.position = { top: '100px' }
    config.data = {
      title: options.title,
      body: options.body,
      confirm: options.confirm,
      errors: options.errors
    }

    try {
      if (options.errors && options.errors.message === 'Validation errors encountered') {
        config.data.errors = this.showValidationErrors(options.errors)
      }
    } catch (err) {
      // okay to ignore
    }

    this.dialogRef = this.dialog.open(DialogComponent, config)
  }

  public toConfirm(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
      return res
    }
    ))
  }

  showValidationErrors(err) {
    const messages = []
    const errors = err.error.data.errors
    for (let error of errors) {
      for (let message of error.messages) {
        messages.push(message)
      }
    }
    return messages
  }
}
