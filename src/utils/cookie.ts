import type { Task, TaskList } from "../type/task";

//タスクリストを返す
export function getCookieList(): TaskList[] {
  try {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + encodeURIComponent("TaskList") + "=([^;]*)"),
    );
    if (!match) return [];
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (e) {
    //エラー時はログに出して空配列を返す
    console.error(e);
    return [];
  }
}

//指定したリストIDにタスクを追加
//タスク追加ボタン押下時に実行
export function addCookieTask(listId: string, value: string):TaskList[]{
  try {
    if (value === "") {
      //値が空の時は何もしない
      return getCookieList();
    }
    const newTask: Task = { id: crypto.randomUUID(), text: value };
    //保存用配列にタスクをプッシュ
    const listArray = getCookieList();
    const newListArray = listArray.map((list) =>
      list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list,
    );
    //配列を文字列に変換
    const encodedValue = encodeURIComponent(JSON.stringify(newListArray));
    saveCookie("TaskList", encodedValue);
    return newListArray;
  } catch (e) {
    //エラー時はログに出して何もしない
    console.error(e);
    return getCookieList();
  }
}

//リストを追加し、追加後のタスクリストを返す
export function addCookieList(value: string) {
  try {
    if (value === "") {
      //値が空の時は何もしない
      return getCookieList();
    }

    const newTaskList: TaskList = {
      id: crypto.randomUUID(),
      name: value,
      tasks: [],
    };
    //保存用配列にタスクをプッシュ
    const listArray = getCookieList();
    const newListArray = [...listArray, newTaskList];
    //配列を文字列に変換
    const encodedValue = encodeURIComponent(JSON.stringify(newListArray));
    saveCookie("TaskList", encodedValue);
    return newListArray;
  } catch (e) {
    //エラー時はログに出して何もしない
    console.error(e);
    return getCookieList();
  }
}

//cookieからタスクを削除
//削除ボタン押下時に実行
export function deleteCookieTask(listId: string, targetId: string): TaskList[] {
  try {
    //指定したタスクを削除
    const listArray = getCookieList();
    const targetList = listArray.find((list) => list.id === listId);
    const newTaskArray = (targetList?.tasks ?? []).filter((task) => {
      return task.id !== targetId;
    });
    const newListArray = listArray.map((list) =>
      list.id === listId ? { ...list, tasks: newTaskArray } : list,
    );
    //削除した配列でcookieを上書き
    const encodedValue = encodeURIComponent(JSON.stringify(newListArray));
    saveCookie("TaskList", encodedValue);
    //画面向けに再取得
    return newListArray;
  } catch (e) {
    //エラー時はログに出して何もしない
    console.error(e);
    return getCookieList();
  }
}

//cookieからタスクを全て削除
//初期化ボタン押下時に実行
export function deleteAllCookieTask() {
  try {
    const defaultList = [{ id: "abcdefg", name: "サンプル", tasks: [] }];
    //削除した配列でcookieを上書き
    const encodedValue = encodeURIComponent(JSON.stringify(defaultList));
    saveCookie("TaskList", encodedValue);
    //画面向けに再取得
  } catch (e) {
    //エラー時はログに出して何もしない
    console.error(e);
    return;
  }
}

//クッキーにタスクを保存
function saveCookie(name: string, value: string) {
  try {
    //cookieの保存期限を定義
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    //cookieに保存するnameを定義
    const encodedName = encodeURIComponent(name);
    //cookieに値を保存
    document.cookie = `${encodedName}=${value}; path=/; expires=${expires.toUTCString()}`;
  } catch (e) {
    //エラー時はログに出して呼び出し元にエラーを伝える
    console.error(e);
    throw e;
  }
}
