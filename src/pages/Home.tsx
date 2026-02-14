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

  //cookieにタスクを保存
  function setCookieTask(name: string, value: string) {
    //保存用配列にタスクをプッシュ
    const taskList = hasCookieTask();
    taskList.push(value);
    //配列を文字列に変換
    const encodedValue = encodeURIComponent(JSON.stringify(taskList));

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const encodedName = encodeURIComponent(name);

    document.cookie = `${encodedName}=${encodedValue}; path=/; expires=${expires.toUTCString()}`;
    setTaskList(taskList);
  }

//   //タスクを取得
//   function getCookieTask() {
//     const match = document.cookie.match(
//       new RegExp("(?:^|; )" + encodeURIComponent("task") + "=([^;]*)"),
//     );
//     if (!match) return [];
//     const decoded = decodeURIComponent(match[1]);
//     const data = JSON.parse(decoded);
//     setTaskList(data);
//   }

  return (
    <div>
      <div>こんにちは</div>
      {taskList !== null &&
        taskList.map((task, index) => {
          return <div key={index}>{task}</div>;
        })}
      <form
        onSubmit={(e) => {
          setCookieTask("task", taskName);
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
        onClick={() => setCookieTask("task", "仮タスク")}
      >
        保存
      </button>
    </div>
  );
}
