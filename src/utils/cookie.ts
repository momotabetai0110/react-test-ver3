import type { Task } from "../type/task";
//cookieが存在するかチェック
//マウント時に実行
export function hasCookieTask(): Task[] {
  try {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + encodeURIComponent("task") + "=([^;]*)"),
    );
    if (!match) return [];
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (e) {
    //エラー時はログに出して空配列を返す
    console.error(e)
    return [];
  }
}

//cookieにタスクを追加
//タスク追加ボタン押下時に実行
export function setCookieTask(value: string) {
  try {
    if (value == "") {
      //値が空の時は何もしない
      return hasCookieTask();
    }
    const newTask: Task = { id: crypto.randomUUID(), text: value };
    //保存用配列にタスクをプッシュ
    const taskList = hasCookieTask();
    const newTaskList = [...taskList, newTask];
    //配列を文字列に変換
    const encodedValue = encodeURIComponent(JSON.stringify(newTaskList));
    saveCookieTask(encodedValue);
    return newTaskList;
  } catch (e) {
    //エラー時はログに出して何もしない
    console.error(e)
    return hasCookieTask();
  }
}

//cookieからタスクを削除
//削除ボタン押下時に実行
export function deleteCookieTask(targetId: string) {
  try {
    //指定したタスクを削除
    const taskList = hasCookieTask();
    //taskList.splice(target, 1);
    const newTaskList = taskList.filter((task) => {
      return task.id !== targetId;
    });
    //削除した配列でcookieを上書き
    const encodedValue = encodeURIComponent(JSON.stringify(newTaskList));
    saveCookieTask(encodedValue);
    //画面向けに再取得
    return newTaskList;
  } catch (e) {
    //エラー時はログに出して何もしない
    console.error(e)
    return hasCookieTask();
  }
}

//クッキーにタスクを保存
function saveCookieTask(value: string) {
  try {
    //cookieの保存期限を定義
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    //cookieに保存するnameを定義
    const name = encodeURIComponent("task");
    //cookieに値を保存
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
  } catch (e) {
    //エラー時はログに出して呼び出し元にエラーを伝える
    console.error(e)
    throw e
  }
}
