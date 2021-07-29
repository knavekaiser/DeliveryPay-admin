import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Combobox,
  Err_svg,
  Paginaiton,
  Chev_down_svg,
  X_svg,
} from "./Elements";
import { Modal } from "./Modal";
import Moment from "react-moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import moment from "moment";
require("./styles/transactions.scss");

function Milestones({ history, location, pathname }) {
  const dateFilterRef = useRef();
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [miles, setMiles] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [status, setStatus] = useState("");
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
      `/api/milestones?page=${page}&perPage=${perPage}&sort=${
        sort.column
      }&order=${sort.order}${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }${status && "&status=" + status}`
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
  }, [page, perPage, sort.column, sort.order, search, dateFilter, status]);
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
                <Moment format="DD MMM, YYYY. hh:mm a">{item.createdAt}</Moment>
              </td>
              <td className="user">
                <img src={item.buyer.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {item.seller.firstName + " " + item.seller.lastName}
                  <span className="phone">{item.seller.phone}</span>
                </p>
              </td>
              <td className="user">
                <img src={item.buyer.profileImg || "/profile-user.jpg"} />
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

export default Milestones;
