import { useEffect, useState } from "react";
import "./App.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactHtmlParser from "html-react-parser";
import Axios from "axios";

function App() {
  const [workContent, setWorkContent] = useState({
    title: "",
    content: "",
  });

  const [oughtContent, setOughtContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:5000/api/get").then((response) => {
      setOughtContent(response.data);
      setIsLoading(false);
    });
  }, [oughtContent]);

  const submitOught = () => {
    Axios.post("http://localhost:5000/api/insert", {
      title: workContent.title,
      content: workContent.content,
    }).then(() => {
      alert("등록 완료!");
    });
  };

  const onRemove = async (id) => {
    try {
      await Axios({
        url: `http://localhost:5000/api/delete${id}`,
        method: "DELETE",
      });
      const data = await Axios({
        url: `http://localhost:5000/api/get`,
        method: "GET",
      });
      setWorkContent(data.data);
    } catch (e) {
      setError(e);
    }
  };

  const getValue = (e) => {
    const { name, value } = e.target;
    setWorkContent({
      ...workContent,
      [name]: value,
    });
  };

  if (error) {
    return <>에러: {error.message}</>;
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="App">
      <h1>Today dialy</h1>
      <div className="work-container">
        {oughtContent.map((element) => (
          <div>
            <h2>{element.title}</h2>
            <div>{ReactHtmlParser(element.content)}</div>
            <button variant="danger" onClick={onRemove}>
              삭제
            </button>
          </div>
        ))}
      </div>
      <div className="form-wrapper">
        <input
          className="title-input"
          type="text"
          placeholder="제목"
          onChange={getValue}
          name="title"
        />
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setWorkContent({
              ...workContent,
              content: data,
            });
            console.log(workContent);
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
      <button className="submit-button" onClick={submitOught}>
        입력
      </button>
    </div>
  );
}

export default App;
