import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Combobox,
  Err_svg,
  Succ_svg,
  Paginaiton,
  Chev_down_svg,
  X_svg,
  Plus_svg,
  FileInput,
  UploadFiles,
  Media,
  Actions,
  Moment,
} from "./Elements";
import { Modal, Confirm } from "./Modal";
import TextareaAutosize from "react-textarea-autosize";

function Notifications({ history, location, pathname }) {
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [notis, setNotis] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [edit, setEdit] = useState(null);
  const [notificationForm, setNotificationForm] = useState(false);
  useEffect(() => {
    fetch(
      `/api/notifications?${new URLSearchParams({
        page,
        perPage,
        sort: sort.column,
        order: sort.order,
        ...(search && { q: search }),
      }).toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setNotis(data.notifications);
          setTotal(data.total || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get notifications.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get notifications. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search]);
  useEffect(() => {
    if (!notificationForm) {
      setEdit(null);
    }
  }, [notificationForm]);
  return (
    <div className="table notiContainer">
      <div style={{ display: "none" }}>
        <X_svg />
      </div>
      <div className="filters">
        <section>
          <label>Total:</label>
          {total}
        </section>
        <section>
          <label>Per Page:</label>
          <Combobox
            defaultValue={0}
            options={[
              { label: "20", value: 20 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
            ]}
            onChange={(e) => setPerPage(e.value)}
          />
        </section>
        <section className="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <path
              id="Icon_ionic-ios-search"
              data-name="Icon ionic-ios-search"
              d="M27.23,25.828l-6.4-6.455a9.116,9.116,0,1,0-1.384,1.4L25.8,27.188a.985.985,0,0,0,1.39.036A.99.99,0,0,0,27.23,25.828ZM13.67,20.852a7.2,7.2,0,1,1,5.091-2.108A7.155,7.155,0,0,1,13.67,20.852Z"
              transform="translate(-4.5 -4.493)"
              fill="#707070"
              opacity="0.74"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Title, body"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
        </section>
        <section className="add">
          <button onClick={() => setNotificationForm(true)}>
            <Plus_svg />
            Add Notification
          </button>
        </section>
      </div>
      <table cellSpacing={0} cellPadding={0}>
        <thead>
          <tr>
            <th
              className={
                sort.column === "createdAt" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "createdAt",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Created at <Chev_down_svg />
            </th>
            <th>Image</th>
            <th>title</th>
            <th>Body</th>
            <th
              className={
                sort.column === "pushed" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "pushed",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Pushed <Chev_down_svg />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notis.map((item) => (
            <tr key={item._id}>
              <td>
                <Moment format="DD MMM, YYYY. hh:mm a">{item.createdAt}</Moment>
              </td>
              <td className="thumbs">
                {item.image && <Media links={[item.image]} />}
              </td>
              <td>{item.title}</td>
              <td>{item.body}</td>
              <td>{item.pushed}</td>
              <td>
                <Actions>
                  <button
                    onClick={() =>
                      Confirm({
                        label: "Push Notification",
                        question: "You sure want to push this notificaion?",
                        callback: () => {
                          fetch("/api/pushNotificaiton", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ _id: item._id }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.code === "ok") {
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Succ_svg />
                                      <h4>Notification has been pushed.</h4>
                                    </div>
                                  </>
                                );
                              } else {
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Err_svg />
                                      <h4>
                                        Could not Push notification. Try again.
                                      </h4>
                                    </div>
                                  </>
                                );
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                              setMsg(
                                <>
                                  <button onClick={() => setMsg(null)}>
                                    Okay
                                  </button>
                                  <div>
                                    <Err_svg />
                                    <h4>
                                      Could not Push notification. Make sure
                                      you're online.
                                    </h4>
                                  </div>
                                </>
                              );
                            });
                        },
                      })
                    }
                  >
                    Push
                  </button>
                  <button
                    onClick={() => {
                      setEdit(item);
                      setNotificationForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      Confirm({
                        label: "Delete Notification",
                        question: "You sure want to delete this notificaion?",
                        callback: () => {
                          fetch("/api/deleteNotification", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ _id: item._id }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.code === "ok") {
                                setNotis((prev) =>
                                  prev.filter((noti) => noti._id !== item._id)
                                );
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Succ_svg />
                                      <h4>Notification has been deleted.</h4>
                                    </div>
                                  </>
                                );
                              } else {
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Err_svg />
                                      <h4>
                                        Could not delete notification. Try
                                        again.
                                      </h4>
                                    </div>
                                  </>
                                );
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                              setMsg(
                                <>
                                  <button onClick={() => setMsg(null)}>
                                    Okay
                                  </button>
                                  <div>
                                    <Err_svg />
                                    <h4>
                                      Could not delete notification. Make sure
                                      you're online.
                                    </h4>
                                  </div>
                                </>
                              );
                            });
                        },
                      })
                    }
                  >
                    Delete
                  </button>
                </Actions>
              </td>
            </tr>
          ))}
          {notis.length === 0 && (
            <tr className="placeholder">
              <td>Nothing yet.</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Paginaiton
                total={total}
                perPage={perPage}
                currentPage={page}
                btns={5}
                setPage={setPage}
              />
            </td>
          </tr>
        </tfoot>
      </table>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
      <Modal
        head={true}
        label="Push Notification"
        open={notificationForm}
        setOpen={setNotificationForm}
        className="formModal pushNotificaiton"
      >
        <NotificationForm
          edit={edit}
          onSuccess={(newNoti) => {
            setNotificationForm(false);
            setNotis((prev) => [
              newNoti,
              ...prev.filter((item) => item._id !== newNoti._id),
            ]);
          }}
        />
      </Modal>
    </div>
  );
}

const NotificationForm = ({ edit, onSuccess }) => {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState(edit?.image ? [edit.image] : []);
  const [title, setTitle] = useState(edit?.title || "");
  const [body, setBody] = useState(edit?.body || "");
  const [link, setLink] = useState(edit?.url || "");
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const thumbLink =
      (await UploadFiles({ files: thumb, setMsg }))?.[0] || null;
    fetch(edit ? "/api/editNotification" : "/api/addNotification", {
      method: edit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(edit && { _id: edit._id }),
        title,
        body,
        image: thumbLink,
        url: link,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          onSuccess?.(data.notification);
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <>
      <form onSubmit={submit}>
        <section className="files">
          <label>Image</label>
          <FileInput prefill={thumb} onChange={(file) => setThumb(file)} />
        </section>
        <section>
          <label>Title</label>
          <input
            type="text"
            required={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>
        <section>
          <label>Body</label>
          <TextareaAutosize
            type="text"
            required={true}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </section>
        <section>
          <label>URL</label>
          <input
            type="text"
            required={true}
            value={link}
            placeholder="https://deliverypay.in"
            onChange={(e) => setLink(e.target.value)}
          />
        </section>
        <section className="btns">
          <button className="submit">Add</button>
        </section>
      </form>
      {loading && (
        <div className="spinnerContainer">
          <div className="spinner" />
        </div>
      )}
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </>
  );
};

export default Notifications;
