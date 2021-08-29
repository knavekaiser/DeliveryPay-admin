import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Combobox,
  Err_svg,
  Paginaiton,
  Chev_down_svg,
  Arrow_down_svg,
  X_svg,
  InputDateRange,
  Img,
  Succ_svg,
  Actions,
  moment,
  Moment,
} from "./Elements";
import { Modal, Confirm } from "./Modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CSVLink } from "react-csv";
require("./styles/transactions.scss");

function BugReport({ history, location, pathname }) {
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [bugs, setBugs] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState(null);
  const [status, setStatus] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [payout, setPayout] = useState(false);
  const [fullView, setFullView] = useState(null);
  useEffect(() => {
    const startDate = moment({
      time: dateRange?.startDate,
      format: "YYYY-MM-DD",
    });
    const endDate = moment({
      time: dateRange?.endDate.setHours(24, 0, 0, 0),
      format: "YYYY-MM-DD",
    });
    fetch(
      `/api/bugReport?${new URLSearchParams({
        page,
        perPage,
        sort: sort.column,
        order: sort.order,
        ...(search && { q: search }),
        ...(dateRange && {
          dateFrom: startDate,
          dateTo: endDate,
        }),
        ...(status && { status }),
      }).toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setBugs(data.bugs);
          setTotal(data.total);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get Bugs.</h4>
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
              <h4>Could not get Bugs. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateRange, status]);
  return (
    <div className="table bugContainer">
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
            placeholder="Search Buyer or Seller's name, phone, Milestone ID"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
        </section>
        <section className="status">
          <label>Status:</label>
          <Combobox
            defaultValue={0}
            options={[
              { label: "All", value: "" },
              { label: "In Progress", value: "inProgress" },
              { label: "Pending", value: "pending" },
              { label: "Released", value: "released" },
              { label: "Dispute", value: "dispute" },
            ]}
            onChange={(e) => setStatus(e.value)}
          />
        </section>
        <InputDateRange
          onChange={(range) => {
            setDateRange(range);
          }}
        />
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
            <th>User</th>
            <th>Issue</th>
            <th>URL</th>
            <th>Files</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((item) => (
            <tr key={item._id}>
              <td>
                <Moment format="DD-MM-YYYY hh:mm a">{item.createdAt}</Moment>
              </td>
              <td className="user">
                <p className="name">
                  {item.name}
                  <span className="phone">{item.phone}</span>
                </p>
              </td>
              <td>{item.issue}</td>
              <td>
                <a href={item.url} target="_blank">
                  {item.url}
                </a>
              </td>
              <td>{item.files}</td>
              <td>
                <Actions>
                  <button onClick={() => setFullView(item)}>View</button>
                  <button
                    onClick={() =>
                      Confirm({
                        label: "Delete Bug Report",
                        question: "You sure want to delete this report?",
                        callback: () => {
                          fetch("/api/deleteBugReport", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ _id: item._id }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.code === "ok") {
                                setBugs((prev) =>
                                  prev.filter((bug) => bug._id !== item._id)
                                );
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Succ_svg />
                                      <h4>Bug Report deleted.</h4>
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
                                        Could not delete Bug Report. Please try
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
                                      Could not delete Bug Report. Make sure
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
          {bugs.length === 0 && (
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
      {fullView && (
        <Modal
          open={fullView}
          setOpen={setFullView}
          head={true}
          label="Bug Report"
          className="fullBug"
        >
          <div className="content">
            <section>
              <label>User</label>
              {fullView.user ? (
                <p>
                  {fullView.user.name}
                  <span>{fullView.user.phone}</span>
                </p>
              ) : (
                <p>Automatic Bug Report</p>
              )}
            </section>
            <section>
              <label>Issue</label>
              {fullView.issue}
            </section>
            <section>
              <label>Detail</label>
              {typeof fullView.dscr === "object" ? (
                <ul>
                  {Object.entries(fullView.dscr).map(([key, value]) => (
                    <li key={key}>
                      <span className={key === "componentStack" ? "code" : ""}>
                        {key}
                      </span>
                      {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{fullView.dscr}</p>
              )}
            </section>
          </div>
        </Modal>
      )}
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </div>
  );
}

export default BugReport;
