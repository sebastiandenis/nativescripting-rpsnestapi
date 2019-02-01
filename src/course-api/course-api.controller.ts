import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
  Param,
} from "@nestjs/common";
import { AppService } from "src/app.service";
import { IMessageObject } from "src/shared/models/domain/message-object.model";
import { PtUserWithAuth } from "src/shared/models";
import { PtItem } from "src/shared/models/domain";

@Controller("api")
export class CourseApiController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): IMessageObject {
    return this.appService.getMessage();
  }

  @Get("/users")
  getUsers(): PtUserWithAuth[] {
    return this.appService.getUsers();
  }

  @Get("/backlog")
  getBacklog(): PtItem[] {
    return this.appService.generatedPtItems;
  }

  @Get("/myItems/:userId")
  getMyItems(@Param("userId") userId?: string): PtItem[] {
    let id: number;
    if (userId) {
      id = parseInt(userId, 10);
    }
    let items = this.appService.getMyItems(id);
    if (items === undefined) {
      throw new HttpException("Items not found", HttpStatus.NOT_FOUND);
      items = [];
    }
    return items;
  }

  @Get("/item/:id")
  getItem(@Param("id") id?: string): PtItem {
    let itemId: number;
    if (id) {
      itemId = parseInt(id, 10);
    }
    let item = this.appService.getItem(itemId);
    if (item === undefined) {
      throw new HttpException("Item not found", HttpStatus.NOT_FOUND);
      item = null;
    }
    return item;
  }

  @Get("/photo/:id")
  getPhoto(@Res() res, @Param("id") id?: string): PtItem {
    let userId: number;
    if (id) {
      userId = parseInt(id, 10);
    }
    let photo = this.appService.getPhoto(userId);
    if (photo === undefined) {
      throw new HttpException("Photo not found", HttpStatus.NOT_FOUND);
      photo = null;
    }
    return res.sendFile(photo, { root: "src" });
  }

  @Get("/openItems")
  getOpenItems(): PtItem[] {
    return this.appService.getOpenItems();
  }

  @Get("/closedItems")
  getClosedItems(): PtItem[] {
    return this.appService.getClosedItems();
  }
}
