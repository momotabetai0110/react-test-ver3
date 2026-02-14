// import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [taskName, setTaskName] = useState<string>("");
  const [taskList, setTaskList] = useState<string[]>([]);

  //cookieが存在するかチェック
  function hasCookieTask(): string[] {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + encodeURIComponent("task") + "=([^;]*)"),
    );
    if (!match) return [];
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded);
    return parsed;
  }

  //cookieにタスクを追加
  function setCookieTask(value: string) {
    //保存用配列にタスクをプッシュ
    const taskList = hasCookieTask();
    taskList.push(value);
    //配列を文字列に変換
    const encodedValue = encodeURIComponent(JSON.stringify(taskList));
    saveCookieTask(encodedValue);
    setTaskList(taskList);
  }

  //クッキーにタスクを保存
  function saveCookieTask(value: string) {
    //cookieの保存期限を定義
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    //cookieに保存するnameを定義
    const name = encodeURIComponent("task");
    //cookieに値を保存
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
  }

  //cookieからタスクを削除
  function deleteCookieTask(target: number) {
    //指定したタスクを削除
    const taskList = hasCookieTask();
    taskList.splice(target, 1);
    //削除した配列でcookieを上書き
    const encodedValue = encodeURIComponent(JSON.stringify(taskList));
    saveCookieTask(encodedValue);
    //画面向けに再取得
    setTaskList(taskList);
  }

  return (
    <div>
      <div>こんにちは</div>
      {taskList !== null &&
        taskList.map((task, index) => {
          return (
            <div>
              <div key={index}>{task}</div>
              <button
                className="btn btn-danger"
                onClick={() => deleteCookieTask(index)}
              >
                削除
              </button>
            </div>
          );
        })}
      <form
        onSubmit={(e) => {
          setCookieTask(taskName);
          e.preventDefault();
        }}
      >
        <input
          type="string"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button className="btn btn-success" type="submit">
          タスク追加
        </button>
      </form>
      <button
        className="btn btn-primary"
        onClick={() => setCookieTask("仮タスク")}
      >
        保存
      </button>
    </div>
  );
}
