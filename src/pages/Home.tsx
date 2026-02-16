import { useState, useEffect } from "react";
import {
  hasCookieTask,
  setCookieTask,
  deleteCookieTask,
} from "../utils/cookie";

export default function Home() {
  const [taskName, setTaskName] = useState<string>("");
  const [taskList, setTaskList] = useState<string[]>([]);


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
              setTaskList(setCookieTask(taskName));
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
          className={`App-task-list ${taskList.length === 0 ? "empty" : ""}`}
        >
          {taskList.length !== 0 &&
            taskList.map((task, index) => {
              return (
                <div className="App-task-card" key={index}>
                  <div className="App-task-item">{task}</div>
                  <div>
                    <button
                      className="btn btn-danger"
                      onClick={() => setTaskList(deleteCookieTask(index))}
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
