import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interfaces/comment.interface';
import { generateUniqueIdWithTimesTamp } from '../../utils/generate-unique-id-with-timestamp';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  taskCommentsChanged = false;
  commentControl = new FormControl('', [Validators.required]);

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  readonly _task: ITask = inject(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);

  onAddComment() {
    console.log('Comentário:', this.commentControl.value);

    //criar um comentário
    const newComment: IComment = {
      id: generateUniqueIdWithTimesTamp(),
      description: this.commentControl.value ? this.commentControl.value : '',
    };

    //adicionar o novo comentário na lista de comentários da tarefa
    this._task.comments.unshift(newComment);

    //reset no form control
    this.commentControl.reset();

    //atualizar a flag/prop se houve alteração nos comentários
    this.taskCommentsChanged = true;

    //focando no elemento de input
    this.commentInputRef.nativeElement.focus();
  }

  onRemoveComment(commentId: string) {
    this._task.comments = this._task.comments.filter(
      (comment) => comment.id !== commentId,
    );

    this.taskCommentsChanged = true;
  }

  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
