import { useState, useEffect } from "react";
import type { Task, TaskList } from "../type/task";
import {
  getCookieList,
  addCookieTask,
  deleteCookieTask,
  deleteAllCookieTask,
  addCookieList,
} from "../utils/cookie";

export default function Home() {
  //入力用
  const [inputTask, setInputTask] = useState<string>("");
  const [inputList, setInputList] = useState<string>("");

  //表示用
  const [listArray, setListArray] = useState<TaskList[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [viewTasks, setViewTasks] = useState<Task[]>();

  //表示タブが切り替わった際に実行
  //表示用タスクを入れ替える
  function switchTab(id: string) {
    setActiveTab(id);
    const targetTasks = listArray.find((list) => list.id === id);
    setViewTasks(targetTasks?.tasks);
  }

  //クッキーを再読み込みし、画面に反映する
  function reloadCookie() {
    const list = getCookieList();
    setListArray(list);
    if (list.length !== 0 && list[0].id) {
      setActiveTab(list[0].id);
      setViewTasks(list[0].tasks);
    }
  }

  useEffect(() => {
    //クッキーが存在していない場合は初期化する
    if (getCookieList.length === 0) {
      deleteAllCookieTask();
    }
    reloadCookie();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <button
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm("ほんとに消しますか？")) {
              deleteAllCookieTask();
              reloadCookie();
            }
          }}
        >
          初期化
        </button>
      </div>
      <div className="App-body">
        {/* リストの追加 */}
        <div className="App-task-form">
          <form
            onSubmit={(e) => {
              setListArray(addCookieList(inputList));
              e.preventDefault();
              setInputList("");
            }}
          >
            <input
              className="App-task-input"
              type="text"
              value={inputList}
              placeholder="リストを追加..."
              onChange={(e) => setInputList(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              追加
            </button>
          </form>
        </div>
        <div className="App-task-tab">
          <div className="App-task-tab-header">
            {listArray.length !== 0 &&
              listArray.map((list) => {
                return (
                  <div
                    className={`App-task-tab-button ${activeTab === list.id ? "active" : ""}`}
                    key={list.id}
                    onClick={() => switchTab(list.id)}
                  >
                    {list.name}
                  </div>
                );
              })}
          </div>

          <div
            className={`App-task-list ${!viewTasks || viewTasks.length === 0 ? "empty" : ""}`}
          >
            {viewTasks &&
              viewTasks.map((task) => {
                return (
                  <div key={task.id}>
                    <div className="App-task-card">
                      <div className="App-task-item">{task.text}</div>
                      <div>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            const newList = deleteCookieTask(
                              activeTab,
                              task.id,
                            );
                            setViewTasks(
                              newList.find((list) => list.id === activeTab)
                                ?.tasks ?? [],
                            );
                            setListArray(newList);
                          }}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            {!viewTasks ||
              (viewTasks.length === 0 && <div>タスクはありません</div>)}
            <form
              onSubmit={(e) => {
                const newList = addCookieTask(activeTab, inputTask);
                setViewTasks(
                  newList.find((list) => list.id === activeTab)?.tasks ?? [],
                );
                setListArray(newList);
                e.preventDefault();
                setInputTask("");
              }}
            >
              <input
                className="App-task-input"
                type="text"
                value={inputTask}
                placeholder="タスクを入力..."
                onChange={(e) => setInputTask(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                追加
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="App-footer"></div>
    </div>
  );
}
