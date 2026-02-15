// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

    if(value == ""){
      //値が空の時は何もしない
      return
    }
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

  useEffect(() => {
    setTaskList(hasCookieTask());
  }, []);

  return (
    <div className="App">
      <div className="App-header"></div>
      <div className="App-body">
        <div className="App-task-form">
          <form
            onSubmit={(e) => {
              setCookieTask(taskName);
              e.preventDefault();
              setTaskName("")
            }}
          >
            <input
              className="App-task-input"
              type="string"
              value={taskName}
              placeholder="タスクを入力..."
              onChange={(e) => setTaskName(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              追加
            </button>
          </form>
        </div>
        <div
          className={`App-task-list ${taskList.length === 0 ? "empty" : ""}`}
        >
          {taskList.length !== 0 &&
            taskList.map((task, index) => {
              return (
                <div className="App-task-card" key={index}>
                  <div className="App-task-item">
                    {task}
                  </div>
                  <div>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteCookieTask(index)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          {taskList.length === 0 && <div>タスクはありません</div>}
        </div>
      </div>
      <div className="App-footer"></div>
    </div>
  );
}
