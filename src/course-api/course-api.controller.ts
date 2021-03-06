import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
  Param,
  Put,
  Body,
  Delete,
  Post,
} from "@nestjs/common";
import { AppService } from "src/app.service";
import { IMessageObject } from "src/shared/models/domain/message-object.model";
import { PtUserWithAuth } from "src/shared/models";
import { PtItem, PtUser, PtComment, PtTask } from "src/shared/models/domain";
import { of, Observable } from "rxjs";
import { DtoComment } from "src/shared/models/domain/dto-comment.model";
import { DtoTask } from "src/shared/models/domain/dto-task.model";

@Controller("api")
export class CourseApiController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): Observable<IMessageObject> {
    return of(this.appService.getMessage());
  }

  @Get("/users")
  getUsers(): Observable<PtUserWithAuth[]> {
    return of(this.appService.getUsers());
  }

  @Get("/backlog")
  getBacklog(): Observable<PtItem[]> {
    return of(this.appService.generatedPtItems);
  }

  @Get("/myItems/:userId")
  getMyItems(@Param("userId") userId?: string): Observable<PtItem[]> {
    let id: number;
    if (userId) {
      id = parseInt(userId, 10);
    }
    let items = this.appService.getMyItems(id);
    if (items === undefined) {
      throw new HttpException("Items not found", HttpStatus.NOT_FOUND);
      items = [];
    }
    return of(items);
  }

  @Get("/item/:id")
  getItem(@Param("id") id?: string): Observable<PtItem> {
    let itemId: number;
    if (id) {
      itemId = parseInt(id, 10);
    }
    let item = this.appService.getItem(itemId);
    if (item === undefined) {
      throw new HttpException("Item not found", HttpStatus.NOT_FOUND);
      item = null;
    }
    return of(item);
  }

  @Get("/photo/:id")
  getPhoto(@Res() res, @Param("id") id?: string): Observable<PtItem> {
    let userId: number;
    if (id) {
      userId = parseInt(id, 10);
    }
    let photo = this.appService.getPhoto(userId);
    if (photo === undefined) {
      throw new HttpException("Photo not found", HttpStatus.NOT_FOUND);
      photo = null;
    }
    return of(res.sendFile(photo, { root: "src" }));
  }

  @Get("/openItems")
  getOpenItems(): Observable<PtItem[]> {
    return of(this.appService.getOpenItems());
  }

  @Get("/closedItems")
  getClosedItems(): Observable<PtItem[]> {
    return of(this.appService.getClosedItems());
  }

  @Put("/users/:id")
  updateUser(
    @Body() modifiedUser: PtUserWithAuth,
    @Param("id") id,
  ): Observable<any> {
    let userId: number;
    if (id) {
      userId = parseInt(id, 10);
    }
    const result: any = this.appService.updateUser(modifiedUser, userId);
    if (!result || (result && !result.found)) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return of({
      id: result.id,
      result: result.result,
    });
  }

  @Delete("/users/:id")
  deleteUser(@Param("id") id: string): Observable<any> {
    let userId: number;
    if (id) {
      userId = parseInt(id, 10);
    }

    const result: any = this.appService.deleteUser(userId);
    if (!result || (result && !result.result)) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return of(result);
  }

  @Post("/comment")
  createComment(@Body() newCommentDto: DtoComment): Observable<PtComment> {
    let newComment: PtComment;
    if (newCommentDto && newCommentDto.itemId && newCommentDto.comment) {
      newComment = this.appService.createComment(
        newCommentDto.itemId,
        newCommentDto.comment,
      );
    }
    if (!newComment) {
      throw new HttpException("Comment not created", HttpStatus.NOT_MODIFIED);
    }
    return of(newComment);
  }

  @Put("/task/:id")
  updateTask(@Body() taskDto: DtoTask, @Param("id") id): Observable<any> {
    let taskId: number;
    let result: any;
    if (id) {
      taskId = parseInt(id, 10);
    }

    if (taskDto && taskDto.itemId && taskDto.task) {
      result = this.appService.updateTask(taskDto, taskId);
    }

    if (!result || (result && !result.found)) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return of({
      id: result.id,
      result: result.result,
    });
  }

  @Post("/task")
  createTask(@Body() newTaskDto: DtoTask): Observable<PtTask> {
    let newTask: PtTask;

    if (newTaskDto && newTaskDto.itemId && newTaskDto.task) {
      newTask = this.appService.createTask(newTaskDto.task, newTaskDto.itemId);
    } else {
      newTask = null;
    }

    return of(newTask);
  }

  @Delete("/item/:id")
  deletItem(@Param("id") id: string): Observable<any> {
    let itemId: number;
    if (id) {
      itemId = parseInt(id, 10);
    }

    const result: any = this.appService.deleteItem(itemId);
    if (!result || (result && !result.result)) {
      throw new HttpException("Item not found", HttpStatus.NOT_FOUND);
    }

    return of(result);
  }

  @Put("/item/:id")
  updateItem(@Body() item: PtItem, @Param("id") id): Observable<any> {
    let itemId: number;
    let result: any;
    if (id) {
      itemId = parseInt(id, 10);
    }

    if (item) {
      result = this.appService.updateItem(item, itemId);
    }

    if (!result || (result && !result.found)) {
      throw new HttpException("Item not found", HttpStatus.NOT_FOUND);
    }

    return of(result.updatedItem);
  }
}
