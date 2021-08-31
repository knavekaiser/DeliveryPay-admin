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
  Moment,
  moment,
} from "./Elements";
import { Modal, Confirm } from "./Modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CSVLink } from "react-csv";
require("./styles/transactions.scss");

function Milestones({ history, location, pathname }) {
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [miles, setMiles] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState(null);
  const [status, setStatus] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [payout, setPayout] = useState(false);
  useEffect(() => {
    const startDate = moment({
      time: dateRange?.startDate,
      format: "YYYY-MM-DD",
    });
    const endDate = moment({
      time: dateRange?.endDate?.setHours(24, 0, 0, 0),
      format: "YYYY-MM-DD",
    });
    fetch(
      `/api/milestones?${new URLSearchParams({
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
          setMiles(data.milestones.milestones);
          setTotal(data.milestones.pageInfo[0]?.count || 0);
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
  }, [page, perPage, sort.column, sort.order, search, dateRange, status]);
  return (
    <div className="table milestoneContainer">
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
        <section className="add">
          <button
            onClick={() => {
              setPayout(true);
            }}
          >
            <Arrow_down_svg /> Download Payout Sheet
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
              Created At <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "seller.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "seller.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Seller <Chev_down_svg />
            </th>
            <th
              className={
                sort.column === "buyer.firstName"
                  ? "sort" + " " + sort.order
                  : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "buyer.firstName",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Buyer <Chev_down_svg />
            </th>
            <th>Description</th>
            <th>Milestone ID</th>
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
            <th
              className={
                sort.column === "amount" ? "sort" + " " + sort.order : ""
              }
              onClick={() => {
                setSort((prev) => ({
                  column: "amount",
                  order: prev.order === "dsc" ? "asc" : "dsc",
                }));
              }}
            >
              Amount <Chev_down_svg />
            </th>
          </tr>
        </thead>
        <tbody>
          {miles.map((item) => (
            <tr key={item._id}>
              <td>
                <Moment format="DD-MM-YYYY hh:mm a">{item.createdAt}</Moment>
              </td>
              <td className="user">
                <Img src={item.seller.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.seller.firstName + " " + item.seller.lastName}
                  <span className="phone">{item.seller.phone}</span>
                </p>
              </td>
              <td className="user">
                <Img src={item.buyer.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.buyer.firstName + " " + item.buyer.lastName}
                  <span className="phone">{item.buyer.phone}</span>
                </p>
              </td>
              <td>{item.dscr}</td>
              <td>{item._id}</td>
              <td>{item.status}</td>
              <td>₹ {item.amount}</td>
            </tr>
          ))}
          {miles.length === 0 && (
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
        label="Download Payout"
        open={payout}
        setOpen={setPayout}
        className="payoutSheet"
      >
        <PayoutModal
          onSuccess={() => {
            setPayout(false);
          }}
        />
      </Modal>
    </div>
  );
}

const PayoutModal = ({ onSuccess }) => {
  const [dateRange, setDateRange] = useState(null);
  const [msg, setMsg] = useState(null);
  const [csvReport, setCsvReport] = useState(null);
  const downloadBtn = useRef();
  return (
    <div className="content">
      <p>Select dates below</p>
      <InputDateRange
        onChange={(range) => {
          setDateRange(range);
        }}
      />
      <div className="actions">
        {!csvReport && (
          <button
            disabled={!dateRange}
            onClick={() => {
              const startDate = moment(dateRange?.startDate).format(
                "YYYY-MM-DD"
              );
              const endDate = moment(dateRange?.endDate).format("YYYY-MM-DD");
              const lastDate = moment(
                new Date(dateRange?.endDate).setDate(
                  dateRange?.endDate.getDate() + 1
                )
              ).format("YYYY-MM-DD");
              Confirm({
                label: "Download Payout Sheet",
                question: (
                  <>
                    You sure want to download all milestones released{" "}
                    {dateRange?.startDate.toString() !==
                    dateRange?.endDate.toString() ? (
                      <>
                        between{" "}
                        <Moment format="DD MMM YYYY">
                          {dateRange.startDate}
                        </Moment>{" "}
                        to{" "}
                        <Moment format="DD MMM YYYY">
                          {dateRange.endDate}
                        </Moment>
                      </>
                    ) : (
                      <>
                        on{" "}
                        <Moment format="DD MMM YYYY">
                          {dateRange.startDate}
                        </Moment>
                      </>
                    )}
                    ?
                  </>
                ),
                callback: () => {
                  fetch("/api/downloadPayout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      startDate: startDate,
                      endDate: lastDate,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.code === "ok") {
                        if (data.users.length === 0) {
                          setMsg(
                            <>
                              <button onClick={() => setMsg(null)}>Okay</button>
                              <div>
                                <Err_svg />
                                <h4>No milestones found in selected dates</h4>
                              </div>
                            </>
                          );
                          return;
                        }
                        const headers = Object.keys(data.users[0]).map(
                          (item) => ({
                            label: item,
                            key: item,
                          })
                        );
                        console.log(headers);
                        setCsvReport({
                          headers,
                          data: data.users,
                          filename: `Delivery Pay payout sheet, ${startDate}-${endDate}.csv`,
                        });
                      } else {
                        setMsg(
                          <>
                            <button onClick={() => setMsg(null)}>Okay</button>
                            <div>
                              <Err_svg />
                              <h4>Could not get milestones. Try again.</h4>
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
                              Could not get milestones. Make sure you're online.
                            </h4>
                          </div>
                        </>
                      );
                    });
                },
              });
            }}
          >
            Generate report
          </button>
        )}
        {csvReport && (
          <CSVLink
            ref={downloadBtn}
            {...csvReport}
            onClick={() => {
              setCsvReport(null);
            }}
          >
            Download Report
          </CSVLink>
        )}
      </div>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </div>
  );
};

export default Milestones;
