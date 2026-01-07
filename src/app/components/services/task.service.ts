import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ITask } from '../../interfaces/task.interface';
import { ITaskFormControls } from '../../interfaces/task-form-controls.interface';
import { TaskStatusEnum } from '../../enums/task-status.enum';
import { generateUniqueIdWithTimesTamp } from '../../utils/generate-unique-id-with-timestamp';
import { TaskStatus } from '../../types/task-status';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  //Tarefas em a Fazer
  private todoTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly todoTasks = this.todoTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  //Tarefas em Fazendo
  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTasks = this.doingTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  //Tarefas em Concluído
  private doneTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTasks = this.doneTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: TaskStatusEnum.TODO,
      id: generateUniqueIdWithTimesTamp(),
      comments: [],
    };

    const currentList = this.todoTasks$.value;

    this.todoTasks$.next([...currentList, newTask]);
  }

  updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    taskNextStatus: TaskStatus,
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);
    const currentTask = currentTaskList.value.find(
      (task) => task.id === taskId,
    );

    if (currentTask) {
      //Atualizando o status da tarefa
      currentTask.status = taskNextStatus;

      //Removendo a tarefa da lista atual
      const currentTaskListWithoutTask = currentTaskList.value.filter(
        (task) => task.id !== taskId,
      );
      currentTaskList.next([...currentTaskListWithoutTask]);

      //Adicionando a tarefa na nova lista
      nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
    }
  }

  private getTaskListByStatus(taskStatus: TaskStatus) {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.todoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };

    return taskListObj[taskStatus];
  }
}
