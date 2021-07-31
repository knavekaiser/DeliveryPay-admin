import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Modal, Confirm } from "./Modal";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import {
  Combobox,
  Plus_svg,
  Err_svg,
  Succ_svg,
  Paginaiton,
  Arrow_left_svg,
  Chev_down_svg,
  X_svg,
} from "./Elements";
import moment from "moment";
import { DateRange } from "react-date-range";
import TextareaAutosize from "react-textarea-autosize";
require("./styles/support.scss");
require("./styles/singleTicket.scss");

export const Faqs = ({ history, location, pathname }) => {
  const dateFilterRef = useRef();
  const [faqForm, setFaqForm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
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
      `/api/faqs?page=${page}&perPage=${perPage}&sort=${sort.column}&order=${
        sort.order
      }${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setFaqs(data.faqs.faqs);
          setTotal(data.faqs.pageInfo[0]?.count || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get FAQs.</h4>
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
              <h4>Could not get FAQs. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateFilter]);
  return (
    <div className="table faqContainer">
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
            placeholder="Search Question or Answer"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
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
        <section className="addFaq">
          <button onClick={() => setFaqForm(true)}>
            <Plus_svg />
            Add FAQ
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
              Date <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "author" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "author",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Author <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "ques" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "ques",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Question <Chev_down_svg />
            </th>
            <th
              className={sort.column === "ans" ? "sort" + " " + sort.order : ""}
              onClick={() => {
                setSort((prev) => ({
                  column: "ans",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Answer <Chev_down_svg />
            </th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((item) => (
            <SingleFaq key={item._id} faq={item} setFaqs={setFaqs} />
          ))}
          {faqs.length === 0 && (
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
      <Modal open={faqForm} className="formModal faqForm">
        <div className="head">
          <p className="modalName">Add FAQ</p>
          <button onClick={() => setFaqForm(false)}>
            <X_svg />
          </button>
        </div>
        <FaqForm
          onSuccess={(newFaq) => {
            setFaqs((prev) => [newFaq, ...prev]);
            setFaqForm(false);
            setMsg(
              <>
                <button onClick={() => setMsg(null)}>Okay</button>
                <div>
                  <Succ_svg />
                  <h4>FAQ successfully added.</h4>
                </div>
              </>
            );
          }}
        />
      </Modal>
    </div>
  );
};
const FaqForm = ({ edit, onSuccess, onCancel }) => {
  const [msg, setMsg] = useState(null);
  const [ques, setQues] = useState(edit?.ques || "");
  const [ans, setAns] = useState(edit?.ans || "");
  const submit = (e) => {
    e.preventDefault();
    fetch("/api/faq", {
      method: edit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ques, ans, ...(edit && { _id: edit._id }) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          onSuccess?.(data.faq);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>FAQ could not be added. Try again.</h4>
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
              <h4>FAQ could not be added. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  };
  return (
    <form onSubmit={submit}>
      <section>
        <label htmlFor="name">Question</label>
        <TextareaAutosize
          value={ques}
          onChange={(e) => setQues(e.target.value)}
          type="text"
          name="question"
          required={true}
        />
      </section>
      <section className="ans">
        <label htmlFor="name">Answer</label>
        <TextareaAutosize
          value={ans}
          onChange={(e) => setAns(e.target.value)}
          type="text"
          name="answer"
          required={true}
        />
      </section>
      <button className="submit">Save</button>
      <section className="pBtm" />
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </form>
  );
};
const SingleFaq = ({ faq, setFaqs }) => {
  const [msg, setMsg] = useState(null);
  const [view, setView] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const deleteFaq = (_id) => {
    fetch("/api/deleteFaq", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setView(false);
          setMsg(
            <>
              <button
                onClick={() => {
                  setFaqs((prev) => prev.filter((item) => item._id !== _id));
                }}
              >
                Okay
              </button>
              <div>
                <Succ_svg />
                <h4>FAQ successfully deleted.</h4>
              </div>
            </>
          );
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>FAQ could not be deleted. Try again.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>FAQ could not be deleted. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  };
  return (
    <>
      <tr onClick={() => setView(true)}>
        <td>
          <Moment format="DD MMM, YYYY. hh:mm a">{faq.createdAt}</Moment>
        </td>
        <td className="user">
          <img src={faq.author.profileImg || "/profile-user.jpg"} />
          <p className="name">
            {faq.author.name}
            <span className="phone">{faq.author.phone}</span>
          </p>
        </td>
        <td>{faq.ques}</td>
        <td>{faq.ans}</td>
      </tr>
      <Modal open={view} className="faq formModal">
        <div className="head">
          <p className="modalName">FAQ</p>
          <button
            onClick={() => {
              setView(false);
            }}
          >
            <X_svg />
          </button>
        </div>
        <div className="content">
          <h3>{faq.ques}</h3>
          <p>{faq.ans}</p>
          <div className="author">
            <img src={faq.author?.profileImg || "/profile-user.jpg"} />
            <p className="name">
              {faq.author?.name || "Deleted user"}
              <span className="phone">{faq.author?.phone}</span>
            </p>
          </div>
          <div className="actions">
            <button
              className="edit"
              onClick={() => {
                setFormOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="delete"
              onClick={() =>
                Confirm({
                  label: "Delete FAQ",
                  question: "You sure want to delete this FAQ?",
                  callback: () => deleteFaq(faq._id),
                })
              }
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
      <Modal open={formOpen} className="formModal faqForm">
        <div className="head">
          <p className="modalName">Add FAQ</p>
          <button onClick={() => setFormOpen(false)}>
            <X_svg />
          </button>
        </div>
        <FaqForm
          edit={faq}
          onSuccess={(newFaq) => {
            setFaqs((prev) =>
              prev.map((item) => {
                if (item._id === newFaq._id) {
                  return newFaq;
                } else {
                  return item;
                }
              })
            );
            setFormOpen(false);
            setMsg(
              <>
                <button onClick={() => setMsg(null)}>Okay</button>
                <div>
                  <Succ_svg />
                  <h4>FAQ successfully updated.</h4>
                </div>
              </>
            );
          }}
        />
      </Modal>
    </>
  );
};

export const Tickets = ({ history, location, pathname }) => {
  const dateFilterRef = useRef();
  const [faqForm, setFaqForm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
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
      `/api/tickets?page=${page}&perPage=${perPage}&sort=${sort.column}&order=${
        sort.order
      }${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setTickets(data.tickets.tickets);
          setTotal(data.tickets.pageInfo[0]?.count || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get Tickets.</h4>
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
              <h4>Could not get Tickets. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateFilter]);
  return (
    <div className="table ticketContainer">
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
            placeholder="Search Issue"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
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
            <th
              className={
                sort.column === "user.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "user.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              User <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "issue" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "issue",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Issue <Chev_down_svg />
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
          {tickets.map((item) => (
            <tr
              key={item._id}
              onClick={() =>
                history.push(`/dashboard/support/ticket/${item._id}`)
              }
            >
              <td>
                <Moment format="hh:mm a, DD MMM, YYYY">{item.createdAt}</Moment>
              </td>
              <td className="user">
                <img src={item.user?.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.user
                    ? item.user.firstName + " " + item.user.lastName
                    : "Deleted user"}
                  <span className="phone">{item.user?.phone}</span>
                </p>
              </td>
              <td>{item.issue}</td>
              <td>{item.status}</td>
            </tr>
          ))}
          {tickets.length === 0 && (
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
};
export const SingleTicket = ({ history, match }) => {
  const [ticket, setTicket] = useState(null);
  const [msg, setMsg] = useState(null);
  const [replyForm, setReplyForm] = useState(false);
  useEffect(() => {
    fetch(`/api/singleTicket?_id=${match.params._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          console.log(data.ticket);
          setTicket(data.ticket);
        } else {
          setMsg(
            <>
              <button
                onClick={() => history.push("/dashboard/support/tickets")}
              >
                Go Back
              </button>
              <div>
                <Err_svg />
                <h4>Ticket could not be found.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => history.push("/account/support/ticket")}>
              Go Back
            </button>
            <div>
              <Err_svg />
              <h4>Ticket could not be found.</h4>
            </div>
          </>
        );
      });
  }, []);
  if (ticket) {
    return (
      <div className="ticket">
        <div className="detail">
          <Link to="/dashboard/support/tickets" className="back">
            <Arrow_left_svg />
            Go Back
          </Link>
          <ul className="summery">
            <li className="head">Ticket Summery</li>
            <li>
              <label>Issue:</label>
              <p>{ticket.issue}</p>
            </li>
            <li>
              <label>Status:</label>
              <p>{ticket.status}</p>
            </li>
            <li>
              <label>Created at:</label>
              <p>
                <Moment format="hh:mm a, DD MMM, YYYY">
                  {ticket.createdAt}
                </Moment>
              </p>
            </li>
            <li>
              <label>Last Activity:</label>
              <p>
                <Moment format="hh:mm a, DD MMM, YYYY">
                  {ticket.updatedAt}
                </Moment>
              </p>
            </li>
          </ul>
          <ul className="milestoneDetail">
            <li className="head">Milestone Detail</li>
            {ticket.milestone ? (
              <>
                <li>
                  <label>Amount:</label>
                  <p>{ticket.milestone.amount}</p>
                </li>
                <li>
                  <label>Status:</label>
                  <p>{ticket.milestone.status}</p>
                </li>
                <li>
                  <label>Created at:</label>
                  <p>
                    <Moment format="hh:mm a, DD MMM, YYYY">
                      {ticket.milestone.createdAt}
                    </Moment>
                  </p>
                </li>
                <li>
                  <label>Verification Method:</label>
                  <p>{ticket.milestone.verification}</p>
                </li>
                <li>
                  <label>Seller:</label>
                  <p>
                    {ticket.milestone.seller.firstName +
                      " " +
                      ticket.milestone.seller.lastName}
                  </p>
                </li>
                <li>
                  <label>Buyer:</label>
                  <p>
                    {ticket.milestone.buyer.firstName +
                      " " +
                      ticket.milestone.buyer.lastName}
                  </p>
                </li>
                <li>
                  <label>Description:</label>
                  <p>{ticket.milestone.dscr}</p>
                </li>
              </>
            ) : (
              <li className="placeholder">No Detail provided</li>
            )}
          </ul>
          <ul className="transactionDetail">
            <li className="head">Transaction Detail</li>
            {ticket.transaction ? (
              <>
                <li>
                  <label>Type:</label>
                  <p>{ticket.transaction.__t}</p>
                </li>
                <li>
                  <label>Amount:</label>
                  <p>{ticket.transaction.amount}</p>
                </li>
                <li>
                  <label>Note:</label>
                  <p>{ticket.transaction.note}</p>
                </li>
                <li>
                  <label>Created at:</label>
                  <p>
                    <Moment format="hh:mm a, DD MMM, YYYY">
                      {ticket.transaction.createdAt}
                    </Moment>
                  </p>
                </li>
              </>
            ) : (
              <li className="placeholder">No Detail provided</li>
            )}
          </ul>
          <div className="pBtm" />
        </div>
        <div className="messages">
          <div className="head">
            Messages <button onClick={() => setReplyForm(true)}>Reply</button>
          </div>
          <ul>
            {ticket.messages.map((item, i) => (
              <li key={i}>
                <div className="user">
                  <p className="name">
                    {item.user.name}
                    <span>•</span>
                    <span className="role">{item.user.role}</span>
                    <span className="date">
                      <Moment format="hh:mm a, DD MMM, YYYY">
                        {item.createdAt}
                      </Moment>
                    </span>
                  </p>
                </div>
                <p className="message">{item.message.body}</p>
                {item.message.files.length > 0 && (
                  <div className="files">test</div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Modal open={replyForm} className="formModal ticketReplyFormModal">
          <div className="head">
            <p className="modalName">Add reply to Ticket</p>
            <button onClick={() => setReplyForm(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15.557"
                height="15.557"
                viewBox="0 0 15.557 15.557"
              >
                <defs>
                  <clipPath id="clip-path">
                    <rect width="15.557" height="15.557" fill="none" />
                  </clipPath>
                </defs>
                <g id="Cancel" clipPath="url(#clip-path)">
                  <path
                    id="Union_3"
                    data-name="Union 3"
                    d="M7.778,9.192,1.414,15.557,0,14.142,6.364,7.778,0,1.414,1.414,0,7.778,6.364,14.142,0l1.415,1.414L9.192,7.778l6.364,6.364-1.415,1.415Z"
                    fill="#2699fb"
                  />
                </g>
              </svg>
            </button>
          </div>
          <TicketReplyForm
            _id={ticket._id}
            onSuccess={(newTicket) => {
              setReplyForm(false);
              setTicket((prev) => ({ ...prev, messages: newTicket.messages }));
              setMsg(
                <>
                  <button onClick={() => setMsg(null)}>Okay</button>
                  <div>
                    <Succ_svg />
                    <h4>Reply has been submitted.</h4>
                  </div>
                </>
              );
            }}
          />
        </Modal>
        <Modal open={msg} className="msg">
          {msg}
        </Modal>
      </div>
    );
  }
  return (
    <div className="ticket">
      loading
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </div>
  );
};
export const TicketReplyForm = ({ _id, onSuccess }) => {
  const [msg, setMsg] = useState(false);
  const [caseFiles, setCaseFiles] = useState("");
  const [message, setMessage] = useState("");
  const submit = (e) => {
    e.preventDefault();
    // upload files here.
    const files = [];
    fetch("/api/addTicketReply", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id,
        message: { body: message, files },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          onSuccess?.(data.ticket);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Reply could not be submitted.</h4>
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
              <h4>Reply could not be submitted. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  };
  return (
    <>
      <form className="ticketReplyForm" onSubmit={submit}>
        <section>
          <label>Message</label>
          <TextareaAutosize
            required={true}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </section>
        <section className="fileInput">
          <label htmlFor="for">Upload relevant files (optional)</label>
          {caseFiles.length > 0 && (
            <ul>
              {caseFiles.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
          <input
            type="file"
            name="files"
            accept="audio/*,video/*,image/*"
            multiple={true}
            onChange={(e) => {
              setCaseFiles(Object.values(e.target.files));
            }}
          />
        </section>
        <button className="submit" type="submit">
          Submit
        </button>
        <div className="pBtm" />
      </form>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </>
  );
};

export const ContactRequest = ({ history, location, pathname }) => {
  const dateFilterRef = useRef();
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [reqs, setReqs] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [fullRequest, setFullRequest] = useState(null);
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
      `/api/contactRequest?page=${page}&perPage=${perPage}&sort=${
        sort.column
      }&order=${sort.order}${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setReqs(data.contactRequests.contactRequests);
          setTotal(data.contactRequests.pageInfo[0]?.count || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get Contact Requests.</h4>
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
              <h4>Could not get Contact Requests. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateFilter]);
  return (
    <div className="table contactContainer">
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
            placeholder="Search for User or Message"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
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
            <th
              className={
                sort.column === "user.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "user.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              User <Chev_down_svg />
            </th>
            <th>
              Message <Chev_down_svg />
            </th>
          </tr>
        </thead>
        <tbody>
          {reqs.map((item) => (
            <tr key={item._id} onClick={() => setFullRequest(item)}>
              <td>
                <Moment format="hh:mm a, DD MMM, YYYY">{item.createdAt}</Moment>
              </td>
              <td className="user">
                <img src={item.user?.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.name}
                  <span className="phone">{item.phone}</span>
                  <span className="phone">{item.email}</span>
                </p>
              </td>
              <td className="message">{item.message}</td>
            </tr>
          ))}
          {reqs.length === 0 && (
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
      <Modal open={fullRequest} className="formModal singleContact">
        <div className="head">
          <p className="modalName">Add FAQ</p>
          <button onClick={() => setFullRequest(null)}>
            <X_svg />
          </button>
        </div>
        <div className="content">
          <div className="user">
            {fullRequest?.name}
            <span>{fullRequest?.email || fullRequest?.phone}</span>
          </div>
          <p className="message">{fullRequest?.message}</p>
          <div
            className="actions"
            onClick={() =>
              Confirm({
                label: "Delete Contact Requets",
                question: "You sure want to delete this request?",
                callback: () => {
                  fetch("/api/deleteContactRequest", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      _id: fullRequest._id,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.code === "ok") {
                        setReqs((prev) =>
                          prev.filter((item) => item._id !== fullRequest._id)
                        );
                        setFullRequest(null);
                      } else {
                        setMsg(
                          <>
                            <button onClick={() => setMsg(null)}>Okay</button>
                            <div>
                              <Err_svg />
                              <h4>Could not delete Contact Request.</h4>
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
                              Could not delete Contact Request. Make sure you're
                              online.
                            </h4>
                          </div>
                        </>
                      );
                    });
                },
              })
            }
          >
            <button className="delete">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const WorkRequest = ({ history, location, pathname }) => {
  const dateFilterRef = useRef();
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [reqs, setReqs] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [fullRequest, setFullRequest] = useState(null);
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
      `/api/viewAllWorkRequest?page=${page}&perPage=${perPage}&sort=${
        sort.column
      }&order=${sort.order}${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setReqs(data.requests.requests);
          setTotal(data.requests.pageInfo[0]?.count || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get Work Requests.</h4>
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
              <h4>Could not get Work Requests. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateFilter]);
  return (
    <div className="table contactContainer">
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
            placeholder="Search for Name, phone, email"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
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
            <th
              className={
                sort.column === "user.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "user.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              User <Chev_down_svg />
            </th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {reqs.map((item) => (
            <tr key={item._id} onClick={() => setFullRequest(item)}>
              <td>
                <Moment format="hh:mm a, DD MMM, YYYY">{item.createdAt}</Moment>
              </td>
              <td className="user">
                <img src={item.user?.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.firstName + " " + item.lastName}
                  <span className="phone">{item.phone}</span>
                  <span className="phone">{item.email}</span>
                </p>
              </td>
              <td className="message">
                <a
                  href={item.resume}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.resume}
                </a>
              </td>
            </tr>
          ))}
          {reqs.length === 0 && (
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
      <Modal open={fullRequest} className="formModal singleContact">
        <div className="head">
          <p className="modalName">Add FAQ</p>
          <button onClick={() => setFullRequest(null)}>
            <X_svg />
          </button>
        </div>
        <div className="content">
          <div className="user">
            {fullRequest?.firstName + " " + fullRequest?.lastName}
            <span>
              {fullRequest?.phone}, {fullRequest?.email}
            </span>
          </div>
          <div className="message">
            <p>Resume:</p>
            <p>
              <a target="_blank" href={fullRequest?.resume}>
                {fullRequest?.resume}
              </a>
            </p>
            {fullRequest?.dscr && (
              <>
                <p>Description</p>
                <p>{fullRequest?.dscr}</p>
              </>
            )}
          </div>
          <div
            className="actions"
            onClick={() =>
              Confirm({
                label: "Delete Contact Requets",
                question: "You sure want to delete this request?",
                callback: () => {
                  fetch("/api/deleteContactRequest", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      _id: fullRequest._id,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.code === "ok") {
                        setReqs((prev) =>
                          prev.filter((item) => item._id !== fullRequest._id)
                        );
                        setFullRequest(null);
                      } else {
                        setMsg(
                          <>
                            <button onClick={() => setMsg(null)}>Okay</button>
                            <div>
                              <Err_svg />
                              <h4>Could not delete Contact Request.</h4>
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
                              Could not delete Contact Request. Make sure you're
                              online.
                            </h4>
                          </div>
                        </>
                      );
                    });
                },
              })
            }
          >
            <button className="delete">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
