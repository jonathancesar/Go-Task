import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { TaskCommentsModalComponent } from '../task-comments-modal/task-comments-modal.component';
import { ITaskFormControls } from '../../interfaces/task-form-controls.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalControllerService {
  private readonly modalSizeOptions = {
    maxWidth: '620px',
    width: '95%',
  };
  private readonly _dialog = inject(Dialog);

  openNewTaskModal() {
    //Para nao repetir o código Altura e largura atribuir o modalSizeOptions
    return this._dialog.open(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      data: {
        mode: 'create',
        formValues: {
          name: '',
          description: '',
        },
      },
    });
  }

  openEditTaskModal(formValues: ITaskFormControls) {
    return this._dialog.open(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      data: {
        mode: 'edit',
        formValues,
      },
    });
  }

  openTaskCommentsModal() {
    return this._dialog.open(TaskCommentsModalComponent, {
      ...this.modalSizeOptions,
    });
  }
}
