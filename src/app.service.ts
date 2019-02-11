import { Injectable } from "@nestjs/common";
import { IMessageObject } from "./shared/models/domain/message-object.model";
import { PtUserWithAuth } from "./shared/models";
import { PtItem, PtUser, PtComment, PtTask } from "./shared/models/domain";
import * as mockgen from "./data/mock-data-generator";
import { DtoTask } from "./shared/models/domain/dto-task.model";
import { identity } from "rxjs";

@Injectable()
export class AppService {
  usersPerPage = 20;
  generatedPtUsers: PtUserWithAuth[];
  generatedPtItems: PtItem[];
  currentPtUsers: PtUserWithAuth[];
  currentPtItems: PtItem[];
  constructor() {
    this.generatedPtUsers = mockgen.generateUsers();
    this.generatedPtItems = mockgen.generatePTItems(this.generatedPtUsers);
    this.currentPtUsers = this.generatedPtUsers.slice(0);
    this.currentPtItems = this.generatedPtItems.slice(0);
  }

  getUsers(): PtUserWithAuth[] {
    return this.currentPtUsers;
  }

  getBacklog(): PtItem[] {
    return this.currentPtItems;
  }

  getMyItems(userId: number): PtItem[] {
    let found = false;
    if (this.currentPtUsers.findIndex(u => u.id === userId) >= 0) {
      found = true;
    }

    const filteredItems = this.currentPtItems.filter(
      i => i.assignee.id === userId && i.dateDeleted === undefined,
    );
    if (!found) {
      return undefined;
    } else {
      return filteredItems;
    }
  }

  getItem(itemId: number): PtItem {
    const foundItem = this.currentPtItems.find(
      i => i.id === itemId && i.dateDeleted === undefined,
    );
    let found = false;
    if (foundItem) {
      found = true;
    }

    if (!found) {
      return undefined;
    } else {
      return foundItem;
    }
  }

  getPhoto(userId: number): string {
    const user = this.currentPtUsers.find(
      u => u.id === userId && u.dateDeleted === undefined,
    );

    let found = false;
    if (user) {
      found = true;
    }

    if (!found) {
      return undefined;
    } else {
      return user.avatar;
    }
  }

  getOpenItems(): PtItem[] {
    const filteredItems = this.currentPtItems.filter(
      (i: PtItem) =>
        (i.status === "Open" || i.status === "ReOpened") &&
        i.dateDeleted === undefined,
    );
    return filteredItems;
  }

  getClosedItems(): PtItem[] {
    const filteredItems = this.currentPtItems.filter(
      i => i.status === "Closed" && i.dateDeleted === undefined,
    );
    return filteredItems;
  }

  getHello(): string {
    return "Hello World!";
  }

  getMessage(): IMessageObject {
    const messageObject: IMessageObject = {
      message: "Hooray! welcome to our api!!",
    };

    return messageObject;
  }

  updateUser(modifiedUser: PtUserWithAuth, userId: number): any {
    let found = false;

    const newUsers = this.currentPtUsers.map(user => {
      if (user.id === userId && user.dateDeleted === undefined) {
        found = true;
        return modifiedUser;
      } else {
        return user;
      }
    });
    this.currentPtUsers = newUsers;

    return {
      id: userId,
      result: modifiedUser,
      found,
    };
  }

  deleteUser(userId: number): any {
    const user = this.currentPtUsers.find(
      u => u.id === userId && u.dateDeleted === undefined,
    );

    if (user) {
      user.dateDeleted = new Date();
      return {
        id: userId,
        result: true,
      };
    } else {
      return {
        id: userId,
        result: false,
      };
    }
  }

  createComment(itemId: number, comment: PtComment): PtComment {
    if (itemId && comment) {
      const foundItem = this.currentPtItems.find(
        i => i.id === itemId && i.dateDeleted === undefined,
      );
      comment.id = this.getNextIntergerId(foundItem.comments);
      const updatedComments = [comment, ...foundItem.comments];
      const updateItem = Object.assign({}, foundItem, {
        comments: updatedComments,
      });
      const updatedItems = this.currentPtItems.map(i => {
        if (i.id === itemId) {
          return updateItem;
        } else {
          return i;
        }
      });
      this.currentPtItems = updatedItems;
      return comment;
    } else {
      return null;
    }
  }

  updateTask(taskDto: DtoTask, taskId: number): any {
    let found = false;

    const foundItem = this.currentPtItems.find(
      i => i.id === taskDto.itemId && i.dateDeleted === undefined,
    );

    const updatedTasks = foundItem.tasks.map(t => {
      if (t.id === taskDto.task.id) {
        found = true;
        return taskDto.task;
      } else {
        return t;
      }
    });

    const updatedItem = Object.assign({}, foundItem, { tasks: updatedTasks });

    const updatedItems = this.currentPtItems.map(i => {
      if (i.id === taskDto.itemId) {
        return updatedItem;
      } else {
        return i;
      }
    });

    this.currentPtItems = updatedItems;

    return {
      id: taskId,
      result: taskDto.task,
      found,
    };
  }

  createTask(newTask: PtTask, itemId: number): any {
    const foundItem = this.currentPtItems.find(
      i => i.id === itemId && i.dateDeleted === undefined,
    );

    newTask.id = this.getNextIntergerId(foundItem.tasks);

    const updatedTasks = [newTask, ...foundItem.tasks];
    const updatedItem = Object.assign({}, foundItem, { tasks: updatedTasks });

    const updatedItems = this.currentPtItems.map(i => {
      if (i.id === itemId) {
        return updatedItem;
      } else {
        return i;
      }
    });
    this.currentPtItems = updatedItems;

    return newTask;
  }

  deleteItem(itemId: number): any {
    const foundItem = this.currentPtItems.find(
      i => i.id === itemId && i.dateDeleted === undefined,
    );

    if (foundItem) {
      const itemToDelete = Object.assign({}, foundItem, {
        dateDeleted: new Date(),
      });
      const updatedItems = this.currentPtItems.map(i => {
        if (i.id === itemId) {
          return itemToDelete;
        } else {
          return i;
        }
      });
      this.currentPtItems = updatedItems;

      return {
        id: itemId,
        result: true,
      };
    } else {
      return {
        id: itemId,
        result: false,
      };
    }
  }

  updateItem(modifiedItem: PtItem, itemId: number): any {
    let found = false;

    const foundItem = this.currentPtItems.find(
      i => i.id === itemId && i.dateDeleted === undefined,
    );

    if (foundItem) {
      found = true;
      const updatedItems = this.currentPtItems.map(i => {
        if (i.id === itemId) {
          return modifiedItem;
        } else {
          return i;
        }
      });

      this.currentPtItems = updatedItems;
    }

    return {
      updatedItem: modifiedItem,
      found,
    };
  }

  private paginateArray(array: [], pageSize: number, pageNumber: number) {
    --pageNumber; // because pages logically start with 1, but technically with 0
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  private getNextIntergerId(arrayWithIdProp: any[]) {
    const newId =
      arrayWithIdProp.length > 0
        ? Math.max(...arrayWithIdProp.map(i => i.id)) + 1
        : 1;
    return newId;
  }
}
