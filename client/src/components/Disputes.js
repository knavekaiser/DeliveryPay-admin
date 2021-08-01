import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Combobox,
  Succ_svg,
  Err_svg,
  Paginaiton,
  Chev_down_svg,
  X_svg,
  Media,
} from "./Elements";
import { Link } from "react-router-dom";
import { Modal, Confirm } from "./Modal";
import Moment from "react-moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import moment from "moment";
require("./styles/transactions.scss");

function Disputes({ history, location, match }) {
  const dateFilterRef = useRef();
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [dis, setDis] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [datePickerStyle, setDatePickerStyle] = useState({});
  const [dateFilter, setDateFilter] = useState(false);
  useLayoutEffect(() => {
    const {
      height,
      y,
      width,
      x,
    } = dateFilterRef.current.getBoundingClientRect();
    setDatePickerStyle({
      position: "fixed",
      top: height + y + 4,
      right: window.innerWidth - x - width,
    });
  }, []);
  useEffect(() => {
    const startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
    const endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
    const lastDate = moment(
      new Date(dateRange.endDate).setDate(dateRange.endDate.getDate() + 1)
    ).format("YYYY-MM-DD");
    fetch(
      `/api/disputes?page=${page}&perPage=${perPage}&sort=${
        sort.column
      }&order=${sort.order}${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }${status && "&status=" + status}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setDis(data.disputes.disputes);
          setTotal(data.disputes.pageInfo[0]?.count || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get transactions.</h4>
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
              <h4>Could not get transactions. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateFilter, status]);
  return (
    <div className="table disputeContainer">
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
            placeholder="Search User's name, phone, Transaction ID, note"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
        </section>
        <section className="status">
          <label>Status</label>
          <Combobox
            defaultValue={0}
            options={[
              { label: "All", value: "" },
              { label: "Pending", value: "pending" },
              { label: "In Progress", value: "pendingVerdict" },
              { label: "Resolved", value: "resolved" },
              { label: "Closed", value: "closed" },
            ]}
            onChange={(e) => setStatus(e.value)}
          />
        </section>
        <section
          className={`date ${dateFilter ? "open" : ""}`}
          ref={dateFilterRef}
          onClick={() => setDateOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30.971"
            height="30.971"
            viewBox="0 0 30.971 30.971"
          >
            <path
              id="Path_299"
              data-name="Path 299"
              d="M3.992,2.42H6.775V.968a.968.968,0,1,1,1.936,0V2.42H22.26V.968a.968.968,0,1,1,1.936,0V2.42h2.783a4,4,0,0,1,3.992,3.992V26.978a4,4,0,0,1-3.992,3.992H3.992A4,4,0,0,1,0,26.978V6.412A4,4,0,0,1,3.992,2.42ZM26.978,4.355H24.2v.968a.968.968,0,1,1-1.936,0V4.355H8.71v.968a.968.968,0,1,1-1.936,0V4.355H3.992A2.059,2.059,0,0,0,1.936,6.412v2.3h27.1v-2.3A2.059,2.059,0,0,0,26.978,4.355ZM3.992,29.035H26.978a2.059,2.059,0,0,0,2.057-2.057V10.646H1.936V26.978A2.059,2.059,0,0,0,3.992,29.035Z"
              fill="#336cf9"
            />
          </svg>
          {dateFilter && (
            <>
              <div className="dates">
                <p>
                  From:{" "}
                  <Moment format="DD MMM, YYYY">{dateRange.startDate}</Moment>
                </p>
                <p>
                  To: <Moment format="DD MMM, YYYY">{dateRange.endDate}</Moment>
                </p>
              </div>
              <button
                className="clearDateFilter"
                onClick={() => {
                  setDateRange({
                    startDate: new Date(),
                    endDate: new Date(),
                  });
                  setDateFilter(false);
                }}
              >
                <X_svg />
              </button>
            </>
          )}
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
              Date <Chev_down_svg />
            </th>
            <th>Issue</th>
            <th
              className={
                sort.column === "plaintiff.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "plaintiff.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Plaintiff <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "defendant.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "defendant.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Defendant <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "status" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "status",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Status <Chev_down_svg />
            </th>
          </tr>
        </thead>
        <tbody>
          {dis.map((item) => (
            <tr
              key={item._id}
              onClick={() => {
                history.push(`/dashboard/disputes/${item._id}`);
              }}
            >
              <td>
                <Moment format="DD MMM, YYYY. hh:mm a">{item.createdAt}</Moment>
              </td>
              <td>{item.issue}</td>
              <td className="user">
                <img src={item.plaintiff.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.plaintiff.firstName + " " + item.plaintiff.lastName}
                  <span className="phone">{item.plaintiff.phone}</span>
                  <span className="pills">
                    <span className="pill role">{item.plaintiff.role}</span>
                    {item.winner === item.plaintiff._id && (
                      <span className="pill winner">Winner</span>
                    )}
                  </span>
                </p>
              </td>
              <td className="user">
                <img src={item.defendant.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.defendant.firstName + " " + item.defendant.lastName}
                  <span className="phone">{item.defendant.phone}</span>
                  <span className="pills">
                    <span className="pill role">{item.defendant.role}</span>
                    {item.winner === item.defendant._id && (
                      <span className="pill winner">Winner</span>
                    )}
                  </span>
                </p>
              </td>
              <td>{item.status}</td>
            </tr>
          ))}
          {dis.length === 0 && (
            <tr className="placeholder">
              <td>Nothing yet.</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <Paginaiton
              total={total}
              perPage={perPage}
              currentPage={page}
              btns={5}
              setPage={setPage}
            />
          </tr>
        </tfoot>
      </table>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
      <Modal
        open={dateOpen}
        onBackdropClick={() => setDateOpen(false)}
        backdropClass="datePicker"
        style={datePickerStyle}
      >
        <DateRange
          className="dateRange"
          ranges={[dateRange]}
          onChange={(e) => {
            setDateRange(e.range1);
            if (e.range1.endDate !== e.range1.startDate) {
              setDateOpen(false);
              setDateFilter(true);
            }
          }}
        />
      </Modal>
    </div>
  );
}

export const SingleDispute = ({ history, location, match }) => {
  const chatRef = useRef();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chat, setChat] = useState([]);
  useEffect(() => {
    fetch(`/api/singleDispute?_id=${match.params._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setData(data.dispute);
          setChat(data.chat?.messages || []);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get Dispute. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, []);
  useEffect(() => {
    if (showChat && chatRef.current) {
      chatRef.current?.scrollBy(0, chatRef.current.scrollHeight);
    }
  }, [showChat]);
  if (data) {
    return (
      <div className={`singleDispute ${data.status}`}>
        <div className="disputeSummery">
          <div className="benner">
            Dispute Summery{" "}
            <button onClick={(e) => setShowChat(true)}>View Chat</button>
          </div>
          <ul className="disputeDetail">
            <li>
              <label>Dispute ID:</label>
              <div className="data">{data._id}</div>
            </li>
            <li>
              <label>Status:</label>
              <div className="data">{data.status}</div>
            </li>
            <li>
              <label>Issue:</label>
              <div className="data">{data.issue}</div>
            </li>
            <li>
              <label>Issued by:</label>
              <div className="data">{data.plaintiff.role}</div>
            </li>
            <li>
              <label>Dispute filed:</label>
              <div className="data">
                <Moment format="hh:mm a, DD MMM, YYYY">{data.createdAt}</Moment>
              </div>
            </li>
            <li>
              <label>Milestone amount:</label>
              <div className="data">₹ {data.milestone.amount}</div>
            </li>
            <li>
              <label>Milestone description:</label>
              <div className="data">{data.milestone.dscr}</div>
            </li>
            <li>
              <label>Milestone products:</label>
              <div className="data">
                {data.milestone.products?.map((item, i) => (
                  <li key={i}>{item.name}</li>
                ))}
                {data.milestone.products?.length ? null : "No product selected"}
              </div>
            </li>
            <li>
              <label>Milestone created:</label>
              <div className="data">
                <Moment format="hh:mm a, DD MMM, YYYY">
                  {data.milestone.createdAt}
                </Moment>
              </div>
            </li>
          </ul>
        </div>
        <Case role="plaintiff" dispute={data} setData={setData} />
        <Case role="defendant" dispute={data} setData={setData} />
        <Modal open={msg} className="msg">
          {msg}
        </Modal>
        <Modal open={showChat} className="disputeChat" ref={chatRef}>
          <div className="chatHead">
            <div className="user">
              <img src={data.plaintiff.profileImg} />
              <p className="name">
                {data.plaintiff.firstName + " " + data.plaintiff.lastName}
                <span className="role">Plaintiff</span>
              </p>
            </div>
            <button onClick={() => setShowChat(false)}>
              <X_svg />
            </button>
            <div className="user def">
              <img src={data.defendant.profileImg || "/profile-user.jpg"} />
              <p className="name">
                {data.defendant.firstName + " " + data.defendant.lastName}
                <span className="role">Defendant</span>
              </p>
            </div>
          </div>
          <Chat
            chat={chat}
            user={data.defendant._id}
            client={data.plaintiff._id}
          />
        </Modal>
      </div>
    );
  }
  return (
    <div className="singleDispute loading">
      <div className="disputeSummery">
        <div className="benner">Dispute Summery</div>
        <ul>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
        </ul>
      </div>
      <div className="plaintiff">
        <div className="benner">Plaintiff</div>
        <div className="user">
          <div className="img" />
          <div className="name" />
        </div>
        <ul className="detail">
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
        </ul>
      </div>
      <div className="defendant">
        <div className="benner">Defendant</div>
        <div className="user">
          <div className="img" />
          <div className="name" />
        </div>
        <ul className="detail">
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
        </ul>
      </div>
    </div>
  );
};

const Chat = ({ chat, user, client }) => {
  return (
    <ul className="chats">
      {chat.map((msg, i) => {
        if (!msg) {
          return null;
        }
        const timestamp =
          Math.abs(
            new Date(msg.createdAt).getTime() -
              new Date(chat[i + 1]?.createdAt).getTime()
          ) > 120000;
        const dateStamp =
          moment(msg.createdAt).format("YYYY-MM-DD") !==
            moment(chat[i - 1]?.createdAt).format("YYYY-MM-DD") || i === 0;
        return (
          <li
            key={i}
            className={`bubble ${msg.from === user ? "user" : "client"}`}
          >
            {dateStamp && (
              <Moment className="dateStamp" format="MMM DD, YYYY">
                {msg.createdAt}
              </Moment>
            )}
            {msg.text && <p className="text">{msg.text}</p>}
            {msg.media && <MediaBubble link={msg.media} />}
            {(timestamp || i === chat.length - 1) && (
              <Moment className="timestamp" format="hh:mm a">
                {msg.createdAt}
              </Moment>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const MediaBubble = ({ link }) => {
  let view = null;
  let fullView = null;
  const [open, setOpen] = useState(false);
  if (link.match(/(\.gif|\.png|\.jpg|\.jpeg|\.webp)$/)) {
    view = <img src={link} onClick={() => setOpen(true)} />;
  } else if (link.match(/(\.mp3|\.ogg|\.amr|\.m4a|\.flac|\.wav|\.aac)$/)) {
    view = <audio src={link} controls="on" />;
  } else if (link.match(/(\.mp4|\.mov|\.avi|\.flv|\.wmv|\.webm)$/)) {
    view = (
      <div className={`videoThumb`}>
        <video src={link} onClick={() => setOpen(true)} />
        <img src="/play_btn.png" />
      </div>
    );
    fullView = <video src={link} controls="on" autoPlay="on" />;
  } else {
    view = (
      <a href={link} target="_blank" className="link">
        <img src="/file_icon.png" />
        {link}
      </a>
    );
  }
  return (
    <div className="file">
      {view}
      <Modal open={open} className="chatMediaView">
        <button className="close" onClick={() => setOpen(false)}>
          <X_svg />
        </button>
        {fullView || view}
      </Modal>
    </div>
  );
};

const Case = ({ role, dispute, setData }) => {
  const [msg, setMsg] = useState(null);
  const resolveDispute = (winner) => {
    fetch("/api/resolveDispute", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: dispute._id,
        winner,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Succ_svg />
                <h4>Dispute Successfully resolved.</h4>
              </div>
            </>
          );
          setData((prev) => ({
            ...prev,
            winner: data.dispute.winner,
            status: data.dispute.status,
          }));
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>{data.message}</h4>
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
              <h4>
                Dispute Could not be resolved. Make sure you' a're online.
              </h4>
            </div>
          </>
        );
      });
  };
  return (
    <div
      className={`${role} ${dispute[role].role} ${
        dispute.winner === dispute[role]._id ? "winner" : ""
      }`}
    >
      <div className="benner">
        {role}
        {dispute.status === "pendingVerdict" && dispute.defendant.case?.dscr && (
          <button
            onClick={() =>
              Confirm({
                className: "disputeResolveConfirm",
                label: "Dispute resolve",
                question: (
                  <>
                    Are you sure{" "}
                    <span className="name">
                      {dispute[role].firstName + " " + dispute[role].lastName}
                    </span>{" "}
                    <span className="role">({role})</span> is the winner of this
                    dispute?
                  </>
                ),
                callback: () => resolveDispute(dispute[role]._id),
              })
            }
          >
            Winner
          </button>
        )}
        {dispute.winner === dispute[role]._id && (
          <p className="winnerTag">Winner</p>
        )}
      </div>
      <div className="content">
        <div className="user">
          <img src={dispute[role].profileImg || "/profile-user.jpg"} />
          <p className="name">
            {dispute[role].firstName + " " + dispute[role].lastName}
            <span className="phone">{dispute[role].phone}</span>
          </p>
        </div>
        {dispute[role].case?.dscr ? (
          <ul className="detail">
            <li>
              <label>Role:</label> <div>{dispute[role].role}</div>
            </li>
            <li>
              <label>Current Balance:</label>{" "}
              <div>₹ {dispute[role].balance}</div>
            </li>
            <li>
              <label>Case:</label>{" "}
              <div>{dispute[role].case?.dscr || "N/A"}</div>
            </li>
            <li>
              <label>Evidence:</label>{" "}
              <div className="thumbs">
                {dispute[role].case?.files?.length ? (
                  <Media links={dispute[role].case?.files} />
                ) : (
                  "N/A"
                )}
              </div>
            </li>
          </ul>
        ) : (
          <p className="noRes">Has not responded yet.</p>
        )}
      </div>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </div>
  );
};

export default Disputes;
