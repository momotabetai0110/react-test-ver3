import { useState, useEffect } from "react";
import type { Task } from "../type/task";
import {
  getCookieTask,
  setCookieTask,
  deleteCookieTask,
  deleteAllCookieTask,
} from "../utils/cookie";

export default function Home() {
  const [taskName, setTaskName] = useState<string>("");
  const [taskArray, setTaskArray] = useState<Task[]>([]);

  useEffect(() => {
    setTaskArray(getCookieTask());
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <button
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm("ほんとに消しますか？")) {
              setTaskArray(deleteAllCookieTask());
            }
          }}
        >
          初期化
        </button>
      </div>
      <div className="App-body">
        <div className="App-task-form">
          <form
            onSubmit={(e) => {
              setTaskArray(setCookieTask(taskName));
              e.preventDefault();
              setTaskName("");
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
          className={`App-task-list ${taskArray.length === 0 ? "empty" : ""}`}
        >
          {taskArray.length !== 0 &&
            taskArray.map((task) => {
              return (
                <div className="App-task-card" key={task.id}>
                  <div className="App-task-item">{task.text}</div>
                  <div>
                    <button
                      className="btn btn-danger"
                      onClick={() => setTaskArray(deleteCookieTask(task.id))}
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          {taskArray.length === 0 && <div>タスクはありません</div>}
        </div>
      </div>
      <div className="App-footer"></div>
    </div>
  );
}
