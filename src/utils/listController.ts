import { SavedList } from "../types";


export function checkListName(listName: string): boolean {
  const lists = window.localStorage.getItem('lists');
  if (lists) {
    const parsedLists: SavedList[] = JSON.parse(lists)
    const foundList = parsedLists.find((list) => list.listName === listName);
    if (foundList) return true;
    else return false;
  }
  else return false;
}

export function saveList(listName: string, channels: string[]): void {
  const lists = window.localStorage.getItem('lists');
  if (lists) {
    const parsedLists: SavedList[] = JSON.parse(lists)
    parsedLists.push({ listName, channels });
    window.localStorage.setItem('lists', JSON.stringify(parsedLists));
  }
  else {
    const newLists: SavedList[] = [{ listName, channels }];
    window.localStorage.setItem('lists', JSON.stringify(newLists));
  }
}

export function getListByName(listName: string): string[] {
  const lists = window.localStorage.getItem('lists');
  if (lists) {
    const parsedLists: SavedList[] = JSON.parse(lists)
    const foundList = parsedLists.find((list) => list.listName === listName);
    if (foundList) return foundList.channels;
    else return [];
  }
  else return [];
}

export function getLists(): SavedList[] {
  const lists = window.localStorage.getItem('lists');
  if (lists) {
    const parsedLists: SavedList[] = JSON.parse(lists)
    return parsedLists;
  }
  else return [];
}

export function removeList(listName: string): void {
  const lists = window.localStorage.getItem('lists');
  if (lists) {
    const parsedLists: SavedList[] = JSON.parse(lists)
    const newList = parsedLists.filter((list) => list.listName !== listName);
    window.localStorage.setItem('lists', JSON.stringify(newList));
  }
}