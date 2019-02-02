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
} from "@nestjs/common";
import { AppService } from "src/app.service";
import { IMessageObject } from "src/shared/models/domain/message-object.model";
import { PtUserWithAuth } from "src/shared/models";
import { PtItem, PtUser } from "src/shared/models/domain";
import { of, Observable } from "rxjs";

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
}
