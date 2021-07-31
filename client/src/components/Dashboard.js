import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { SiteContext } from "../SiteContext";
import { Route, Switch, useHistory, Link } from "react-router-dom";
import { Modal } from "./Modal.js";
import {
  Combobox,
  NumberInput,
  Err_svg,
  Succ_svg,
  X_svg,
  Plus_svg,
  Minus_svg,
} from "./Elements";
import { GoogleLogout } from "react-google-login";
import Transactions from "./Transactions";
import Milestones from "./Milestones";
import Settings from "./Settings";
import Disputes, { SingleDispute } from "./Disputes";
import {
  Faqs,
  Tickets,
  SingleTicket,
  ContactRequest,
  WorkRequest,
} from "./Support";
import Moment from "react-moment";
require("./styles/dashboard.scss");

const ProfileAvatar = () => {
  const { user, setUser } = useContext(SiteContext);
  const history = useHistory();
  const menuRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [invite, setInvite] = useState(false);
  const [noti, setNoti] = useState(false);
  const [unread, setUnread] = useState(false);
  const [msg, setMsg] = useState(null);
  const logout = (e) => {
    console.log(e);
  };
  // <GoogleLogout
  // clientId="978249749020-kjq65au1n373ur5oap7n4ebo2fq1jdhq.apps.googleusercontent.com"
  // buttonText="Logout"
  // onLogoutSuccess={logout}
  // >
  // test
  // </GoogleLogout>
  useEffect(() => {
    if (noti) {
      fetch("/api/editAdminProfile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationLastRead: new Date(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser((prev) => ({
              ...prev,
              notificationLastRead: data.user.notificationLastRead,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [noti]);
  useEffect(() => {
    if (user) {
      const newNoti = user.notifications.find((item) => {
        return new Date(item.createdAt) > new Date(user.notificationLastRead);
      });
      if (newNoti) {
        setUnread(true);
      }
      if (noti) {
        setUnread(false);
      }
    }
  }, [noti, user]);
  return (
    <>
      <div className="profile">
        <button
          className={`bell ${unread ? "unread" : ""}`}
          onClick={() => setNoti(true)}
        >
          <img src="/notification-bell.png" />
        </button>
        <img
          src={user?.profileImg}
          className="avatar"
          onClick={() => setMenu(!menu)}
        />
        {menu && (
          <div className="menu" ref={menuRef} onClick={() => setMenu(false)}>
            <p className="name">{user.name || user.phone}</p>
            <div className="links">
              <Link className="link settings" to="/dashboard/profile">
                Settings
              </Link>
            </div>
            <button
              className="logout"
              onClick={() => {
                fetch("/api/logout")
                  .then((res) => res.json())
                  .then((data) => {
                    setUser(null);
                    history.push("/");
                  })
                  .catch((err) => {
                    console.log(err);
                    setMsg(
                      <>
                        <button onClick={() => setMsg(null)}>Okay</button>
                        <div>
                          <Err_svg />
                          <h4>Could not logout.</h4>
                        </div>
                      </>
                    );
                  });
              }}
            >
              Logout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31.702"
                height="31.702"
                viewBox="0 0 31.702 31.702"
              >
                <path
                  id="Path_1758"
                  data-name="Path 1758"
                  d="M15.487,25.174l2.483,2.483,8.806-8.806L17.97,10.045l-2.483,2.483,4.544,4.562H3v3.522H20.031ZM31.18,3H6.522A3.521,3.521,0,0,0,3,6.522v7.045H6.522V6.522H31.18V31.18H6.522V24.135H3V31.18A3.521,3.521,0,0,0,6.522,34.7H31.18A3.533,3.533,0,0,0,34.7,31.18V6.522A3.533,3.533,0,0,0,31.18,3Z"
                  transform="translate(-3 -3)"
                  fill="#fc0660"
                />
              </svg>
            </button>
          </div>
        )}
        {noti && (
          <ul className="notiWrapper">
            {user.notifications.reverse().map((item, i) => {
              return (
                <li key={i}>
                  <Moment format="hh:mm">{item.createdAt}</Moment>
                  <p className="title">{item.title}</p>
                  <p className="body">{item.body}</p>
                </li>
              );
            })}
            {user.notifications.length === 0 && (
              <li className="placeholder">Nothing for now.</li>
            )}
          </ul>
        )}
      </div>
      {(menu || noti) && (
        <div
          className="backdrop"
          onClick={() => {
            setMenu(false);
            setNoti(false);
          }}
        />
      )}
    </>
  );
};
const Home = () => {
  const history = useHistory();
  const [data, setData] = useState({});
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    fetch("/api/getDashboardData")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setData(data);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get data</h4>
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
              <h4>Could not get data. Make sure you're online.</h4>
            </div>
          </>
        );
        console.log(err);
      });
  }, []);
  return (
    <div className="homeContainer">
      <div className="totalBalance">
        <p>Total balance in wallet</p>
        <h1>₹ {data.totalBalance || 0}</h1>
      </div>
      <div className="total">
        <p>Total milestone in progress.</p>
        <h3>{data.activeMilestones || 0}</h3>
      </div>
      <div className="total">
        <p>Total dispute pending verdict.</p>
        <h3>{data.activeDisputes || 0}</h3>
      </div>
      <div className="total">
        <p>
          Total Transaction this month{" "}
          <span>
            <Moment format="MMM, YYYY">{new Date()}</Moment>
          </span>
        </p>
        <h3>{data.transactionThisMonth || 0}</h3>
      </div>
      <div className="recentTrans">
        <p>Latest Transactions</p>
        <ul>
          {data.recentTrans?.map((item) => (
            <li key={item._id}>
              <div className="transDetail">
                <img src={item.user?.profileImg} />
                <p className="name">
                  {item.user?.firstName + " " + item.user?.lastName ||
                    "Deleted user"}
                  <Moment className="date" format="MMM DD, YYYY">
                    {item.createdAt}
                  </Moment>
                </p>
              </div>
              <div className="amount">
                <h4>₹ {item.amount}</h4>
              </div>
            </li>
          )) || <li>Nothing for now</li>}
        </ul>
        <Link className="viewAll" to="/dashboard/transactions">
          View All
        </Link>
      </div>
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </div>
  );
};

function Dashboard({ location }) {
  const { user } = useContext(SiteContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
      className={`account ${
        location.pathname.startsWith("/dashboard/deals/") ? "chatSection" : ""
      }`}
    >
      <ul
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        onClick={(e) => setSidebarOpen(false)}
      >
        <li>
          <img className="logo" src="/logo_land.jpg" alt="Delivery pay logo" />
        </li>
        <li
          className={
            location.pathname === "/dashboard" ||
            location.pathname.startsWith("/dashboard/home")
              ? "active"
              : undefined
          }
        >
          <Link to="/dashboard/home">
            <div className="icon">
              <img src="/dashboard.png" />
            </div>
            <p className="label">Home</p>
          </Link>
        </li>
        <li
          className={
            location.pathname.startsWith("/dashboard/milestones")
              ? "active"
              : undefined
          }
        >
          <Link to="/dashboard/milestones">
            <div className="icon">
              <img src="/buyer.png" />
            </div>
            <p className="label">Milestones</p>
          </Link>
        </li>
        {
          //   <li
          //   className={`seller ${
          //     location.pathname.startsWith("/dashboard/seller")
          //       ? "active"
          //       : undefined
          //   }`}
          // >
          //   <Link to="/dashboard/seller">
          //     <div className="icon">
          //       <img src="/seller.png" />
          //     </div>
          //     <p className="label">Seller</p>
          //   </Link>
          // </li>
          // <li
          //   className={`buyer ${
          //     location.pathname.startsWith("/dashboard/buyer")
          //       ? "active"
          //       : undefined
          //   }`}
          // >
          //   <Link to="/dashboard/buyer">
          //     <div className="icon">
          //       <img src="/buyer.png" />
          //     </div>
          //     <p className="label">Buyer</p>
          //   </Link>
          // </li>
        }
        <li
          className={
            location.pathname.startsWith("/dashboard/transactions")
              ? "active"
              : undefined
          }
        >
          <Link to="/dashboard/transactions">
            <div className="icon">
              <img src="/transaction.png" />
            </div>
            <p className="label">Transactions</p>
          </Link>
        </li>
        <li
          className={
            location.pathname.startsWith("/dashboard/disputes")
              ? "active"
              : undefined
          }
        >
          <Link to="/dashboard/disputes">
            <div className="icon">
              <img src="/deal.png" />
            </div>
            <p className="label">Disputes</p>
          </Link>
        </li>
        <li
          className={`settings ${
            location.pathname.startsWith("/dashboard/settings")
              ? "active"
              : undefined
          }`}
        >
          <Link to="/dashboard/settings">
            <div className="icon">
              <img src="/setting.png" />
            </div>
            <p className="label">Settings</p>
          </Link>
        </li>
        {
          // <li
          //   className={`${
          //     location.pathname.startsWith("/dashboard/analytics") ? "active" : ""
          //   }`}
          // >
          //   <Link to="/dashboard/analytics">
          //     <div className="icon">
          //       <img src="/analytics.png" />
          //     </div>
          //     <p className="label">Analytics</p>
          //   </Link>
          // </li>
        }
        <Accordion
          className={`support ${
            location.pathname.startsWith("/dashboard/support") ? "active" : ""
          }`}
          location={location}
          label={
            <>
              <div className="icon">
                <img src="/customer-support.png" />
              </div>
              <p className="label">Customer Support</p>
            </>
          }
          link="/dashboard/support"
          path="/dashboard/support/faq"
        >
          <ul className="">
            <li>
              <Link
                to="/dashboard/support/faq"
                className={`${
                  location.pathname.startsWith("/dashboard/support/faq")
                    ? "active"
                    : ""
                }`}
              >
                <div className="icon">
                  <img src="/message.png" />
                </div>
                <p className="label">FAQ Blogs</p>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/support/tickets"
                className={`${
                  location.pathname.startsWith("/dashboard/support/tickets")
                    ? "active"
                    : ""
                }`}
              >
                <div className="icon">
                  <img src="/tickets.png" />
                </div>
                <p className="label">Tickets</p>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/support/workRequest"
                className={`${
                  location.pathname.startsWith("/dashboard/support/workRequest")
                    ? "active"
                    : ""
                }`}
              >
                <div className="icon">
                  <img src="/cargo.png" />
                </div>
                <p className="label">Job Application</p>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/support/contactRequest"
                className={`${
                  location.pathname.startsWith(
                    "/dashboard/support/contactRequest"
                  )
                    ? "active"
                    : ""
                }`}
              >
                <div className="icon">
                  <img src="/cargo.png" />
                </div>
                <p className="label">Contact Request</p>
              </Link>
            </li>
          </ul>
        </Accordion>
      </ul>
      {sidebarOpen && (
        <div
          className="sidebarBackdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main>
        <header>
          <button className="menuBtn" onClick={() => setSidebarOpen(true)}>
            <img src="/menu.svg" />
          </button>
          <h3>Now Pay after Delivery with Delivery Pay</h3>
          <ProfileAvatar />
        </header>
        <Switch>
          <Route path="/dashboard/milestones" component={Milestones} />
          <Route path="/dashboard/transactions" component={Transactions} />
          <Route path="/dashboard/support/faq" component={Faqs} />
          <Route
            path="/dashboard/support/ticket/:_id"
            component={SingleTicket}
          />
          <Route path="/dashboard/support/tickets" component={Tickets} />
          <Route
            path="/dashboard/support/workRequest"
            component={WorkRequest}
          />
          <Route path="/dashboard/settings" component={Settings} />
          <Route
            path="/dashboard/support/contactRequest"
            component={ContactRequest}
          />
          <Route
            exact
            path="/dashboard/disputes/:_id"
            component={SingleDispute}
          />
          <Route exact path="/dashboard/disputes" component={Disputes} />
          <Route path="/" component={Home} />
        </Switch>
      </main>
      <ul className="mobileMenu">
        <li
          className={
            location.pathname === "/dashboard" ||
            location.pathname.startsWith("/dashboard/home")
              ? "active"
              : undefined
          }
        >
          <Link to="/dashboard/home">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.648"
                height="21.513"
                viewBox="0 0 21.648 21.513"
              >
                <path
                  id="Path_287"
                  data-name="Path 287"
                  d="M21.387,10.488A1.079,1.079,0,0,0,21.3,8.979L11.626.289a1.185,1.185,0,0,0-1.576,0L.342,9.44A1.073,1.073,0,0,0,.3,10.95l.245.258A1.043,1.043,0,0,0,2,11.321l.724-.665v9.762A1.071,1.071,0,0,0,3.78,21.5H7.563A1.071,1.071,0,0,0,8.62,20.418V13.591h4.81v6.828a1.04,1.04,0,0,0,.269.761.987.987,0,0,0,.723.323H18.45a1.071,1.071,0,0,0,1.057-1.084V10.776l.449.4c.245.222.765.042,1.168-.4Z"
                  transform="translate(-0.008 0.011)"
                  fill="#fff"
                />
              </svg>
            </div>
            Home
          </Link>
        </li>
        <li
          className={`deals ${
            location.pathname.startsWith("/dashboard/deals")
              ? "active"
              : undefined
          }`}
        >
          <Link to="/dashboard/deals">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26.55"
                height="25.219"
                viewBox="0 0 26.55 25.219"
              >
                <path
                  id="Path_1"
                  data-name="Path 1"
                  d="M-242.2-184.285h-13l26.55-10.786-4.252,25.219-5.531-10.637-2.127,4.68v-6.382l7.659-9.148h2.34"
                  transform="translate(255.198 195.071)"
                  fill="#fff"
                />
              </svg>
            </div>
            Deals
          </Link>
        </li>
        <li
          className={
            location.pathname.startsWith("/dashboard/wallet")
              ? "active"
              : undefined
          }
        >
          <Link to="/dashboard/wallet">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20.886"
                height="22.948"
                viewBox="0 0 20.886 22.948"
              >
                <g
                  id="Rectangle_2"
                  data-name="Rectangle 2"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <rect width="20.886" height="16.244" rx="2" stroke="none" />
                  <rect
                    x="1"
                    y="1"
                    width="18.886"
                    height="14.244"
                    rx="1"
                    fill="none"
                  />
                </g>
                <g
                  id="Rectangle_3"
                  data-name="Rectangle 3"
                  transform="translate(0 9.283)"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <rect width="20.886" height="6.962" rx="2" stroke="none" />
                  <rect
                    x="1"
                    y="1"
                    width="18.886"
                    height="4.962"
                    rx="1"
                    fill="none"
                  />
                </g>
                <path
                  id="Path_2"
                  data-name="Path 2"
                  d="M-180.174-182v7.923l4.1-4.653,3.932,4.653V-182Z"
                  transform="translate(186.6 197.025)"
                  fill="#fff"
                />
              </svg>
            </div>
            Wallet
          </Link>
        </li>
        <li
          className={`hold ${
            location.pathname.startsWith("/dashboard/hold")
              ? "active"
              : undefined
          }`}
        >
          <Link to="/dashboard/hold">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="27"
                viewBox="0 0 22 27"
              >
                <text
                  id="_3"
                  data-name="3"
                  transform="translate(14 14) rotate(180)"
                  fill="#fff"
                  fontSize="10"
                  fontFamily="Ebrima-Bold, Ebrima"
                  fontWeight="700"
                >
                  <tspan x="0" y="0">
                    3
                  </tspan>
                </text>
                <g
                  id="Group_166"
                  data-name="Group 166"
                  transform="translate(-534.967 -611.816)"
                >
                  <g
                    id="Rectangle_1132"
                    data-name="Rectangle 1132"
                    transform="translate(534.967 620.816)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <rect width="22" height="18" rx="4" stroke="none" />
                    <rect
                      x="1"
                      y="1"
                      width="20"
                      height="16"
                      rx="3"
                      fill="none"
                    />
                  </g>
                  <g
                    id="Rectangle_1133"
                    data-name="Rectangle 1133"
                    transform="translate(539.967 611.816)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <path
                      d="M6.5,0h0A6.5,6.5,0,0,1,13,6.5V11a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V6.5A6.5,6.5,0,0,1,6.5,0Z"
                      stroke="none"
                    />
                    <path
                      d="M6.5,1h0A5.5,5.5,0,0,1,12,6.5V9.214a.786.786,0,0,1-.786.786H1.786A.786.786,0,0,1,1,9.214V6.5A5.5,5.5,0,0,1,6.5,1Z"
                      fill="none"
                    />
                  </g>
                </g>
              </svg>
            </div>
            Hold
          </Link>
        </li>
        <li
          className={`trans ${
            location.pathname.startsWith("/dashboard/transactions")
              ? "active"
              : undefined
          }`}
        >
          <Link to="/dashboard/transactions">
            <div className="icon">
              <svg
                id="Group_283"
                data-name="Group 283"
                xmlns="http://www.w3.org/2000/svg"
                width="28.407"
                height="25.407"
                viewBox="0 0 28.407 25.407"
              >
                <g
                  id="Path_4"
                  data-name="Path 4"
                  transform="translate(3)"
                  fill="none"
                >
                  <path
                    d="M12.7,0A12.7,12.7,0,1,1,0,12.7,12.7,12.7,0,0,1,12.7,0Z"
                    stroke="none"
                  />
                  <path
                    d="M 12.70325660705566 1.999996185302734 C 9.844316482543945 1.999996185302734 7.156496047973633 3.113327026367188 5.134906768798828 5.134906768798828 C 3.113327026367188 7.156496047973633 1.999996185302734 9.844316482543945 1.999996185302734 12.70325660705566 C 1.999996185302734 15.56219673156738 3.113327026367188 18.2500171661377 5.134906768798828 20.2716064453125 C 7.156496047973633 22.29318618774414 9.844316482543945 23.40651702880859 12.70325660705566 23.40651702880859 C 15.56219673156738 23.40651702880859 18.2500171661377 22.29318618774414 20.2716064453125 20.2716064453125 C 22.29318618774414 18.2500171661377 23.40651702880859 15.56219673156738 23.40651702880859 12.70325660705566 C 23.40651702880859 9.844316482543945 22.29318618774414 7.156496047973633 20.2716064453125 5.134906768798828 C 18.2500171661377 3.113327026367188 15.56219673156738 1.999996185302734 12.70325660705566 1.999996185302734 M 12.70325660705566 -3.814697265625e-06 C 19.71906661987305 -3.814697265625e-06 25.40651702880859 5.687446594238281 25.40651702880859 12.70325660705566 C 25.40651702880859 19.71906661987305 19.71906661987305 25.40651702880859 12.70325660705566 25.40651702880859 C 5.687446594238281 25.40651702880859 -3.814697265625e-06 19.71906661987305 -3.814697265625e-06 12.70325660705566 C -3.814697265625e-06 5.687446594238281 5.687446594238281 -3.814697265625e-06 12.70325660705566 -3.814697265625e-06 Z"
                    stroke="none"
                    fill="#fff"
                  />
                </g>
                <g
                  id="Polygon_1"
                  data-name="Polygon 1"
                  transform="translate(6.001 12.353) rotate(-150)"
                  fill="#fff"
                >
                  <path
                    d="M 4.929044723510742 3.619362831115723 L 2.000004529953003 3.619362831115723 L 3.464524507522583 1.666669487953186 L 4.929044723510742 3.619362831115723 Z"
                    stroke="none"
                  />
                  <path
                    d="M 3.464524507522583 2.86102294921875e-06 L 6.929044723510742 4.619362831115723 L 4.291534423828125e-06 4.619362831115723 L 3.464524507522583 2.86102294921875e-06 Z"
                    stroke="none"
                    fill="#fff"
                  />
                </g>
                <g
                  id="Rectangle_4"
                  data-name="Rectangle 4"
                  transform="translate(0 11.86) rotate(-22)"
                  fill="#336cf9"
                  stroke="#336cf9"
                  strokeWidth="1"
                >
                  <rect width="6.929" height="4.619" stroke="none" />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="5.929"
                    height="3.619"
                    fill="none"
                  />
                </g>
                <g
                  id="Group_5"
                  data-name="Group 5"
                  transform="translate(15.704 4.888)"
                >
                  <line
                    id="Line_3"
                    data-name="Line 3"
                    y2="9.239"
                    transform="translate(0 0)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <line
                    id="Line_4"
                    data-name="Line 4"
                    x2="6.929"
                    y2="2.31"
                    transform="translate(0 9.239)"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
            Transactions
          </Link>
        </li>
      </ul>
    </div>
  );
}
const Accordion = ({ label, className, location, link, path, children }) => {
  return (
    <li
      className={`accordion ${className || ""} ${
        location.pathname.startsWith(link) && "open"
      }`}
    >
      <Link to={path}>{label}</Link>
      {location.pathname.startsWith(link) && children}
    </li>
  );
};

export default Dashboard;
