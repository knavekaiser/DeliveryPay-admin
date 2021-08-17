import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Combobox,
  Err_svg,
  Paginaiton,
  Chev_down_svg,
  X_svg,
  Succ_svg,
  FileInput,
  NumberInput,
  UploadFiles,
  Plus_svg,
  Actions,
} from "./Elements";
import { Link } from "react-router-dom";
import { Modal, Confirm } from "./Modal";
import Moment from "react-moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import moment from "moment";
require("./styles/transactions.scss");

function Users({ history, location, pathname }) {
  const dateFilterRef = useRef();
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
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
  const [userForm, setUserForm] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [edit, setEdit] = useState(null);
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
      `/api/users?page=${page}&perPage=${perPage}&sort=${sort.column}&order=${
        sort.order
      }${search && "&q=" + search}${
        dateFilter ? "&dateFrom=" + startDate + "&dateTo=" + lastDate : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setUsers(data.users);
          setTotal(data.total);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get users.</h4>
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
              <h4>Could not get users. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search, dateFilter]);
  useEffect(() => {
    if (!userForm) {
      setEdit(null);
    }
  }, [userForm]);
  return (
    <div className="table users">
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
            placeholder="Search User's name, phone, email, id"
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
        <section className="add">
          <button onClick={() => setUserForm(true)}>
            <Plus_svg />
            Add User
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
            <th>User ID</th>
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
              Balance <Chev_down_svg />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Moment format="DD MMM, YYYY. hh:mm a">{user.createdAt}</Moment>
              </td>
              <td className="user">
                <img src={user?.profileImg || "/profile-user.jpg"} />
                <p className="name">
                  {user
                    ? user?.firstName + " " + user?.lastName
                    : "Deleted user"}
                  <span className="phone">{user?.phone}</span>
                </p>
              </td>
              <td>{user.userId}</td>
              <td>{(user.balance || 0).fix()}</td>
              <td className="action">
                <Actions>
                  <button
                    onClick={() => {
                      setEdit(user);
                      setUserForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <Link to={`/dashboard/users/user._id`}>
                    <li>View</li>
                  </Link>
                  <button
                    onClick={() =>
                      Confirm({
                        label: "Delete User",
                        question: "You sure want to delete this user?",
                        callback: () => {
                          fetch("/api/deleteUser", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              _id: user._id,
                            }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.code === "ok") {
                                setUsers((prev) =>
                                  prev.filter(
                                    (item) => item._id !== data.user._id
                                  )
                                );
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Succ_svg />
                                      <h4>User successfully deleted.</h4>
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
                                      <h4>Could not delete user. Try again.</h4>
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
                                      Could not delete user. Make sure you're
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
                    Delete
                  </button>
                </Actions>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
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
      <Modal
        open={userForm}
        head={true}
        label="Add User"
        setOpen={setUserForm}
        className="formModal userForm"
      >
        <UserForm
          edit={edit}
          onSuccess={(newUser) => {
            setUsers((prev) => [
              newUser,
              ...prev.filter((item) => item._id !== newUser._id),
            ]);
            setUserForm(false);
            setMsg(
              <>
                <button onClick={() => setMsg(null)}>Okay</button>
                <div>
                  <Succ_svg />
                  <h4>User successfully added.</h4>
                </div>
              </>
            );
          }}
        />
      </Modal>
    </div>
  );
}
const UserForm = ({ edit, onSuccess }) => {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(edit?.firstName || "");
  const [lastName, setLastName] = useState(edit?.lastName || "");
  const [phone, setPhone] = useState(edit?.phone || "+91");
  const [email, setEmail] = useState(edit?.email || "");
  const [age, setAge] = useState(edit?.age || "");
  const [gender, setGender] = useState(edit?.gender || "");
  const [password, setPassword] = useState("");
  const [street, setStreet] = useState(edit?.address?.street || "");
  const [city, setCity] = useState(edit?.address?.city || "");
  const [state, setState] = useState(edit?.address?.state || "");
  const [country, setContry] = useState(edit?.address?.country || "");
  const [zip, setZip] = useState(edit?.address?.zip || "");
  const [kycFiles, setKycFiles] = useState(edit?.kyc?.files || "");
  const [kycStatus, setKycStatus] = useState(edit?.kyc?.verified || false);
  const [gstStatus, setGstStatus] = useState(edit?.gst?.verified || false);
  const [gstFiles, setGstFiles] = useState(edit?.gst?.detail?.files || "");
  const [gstReg, setGstReg] = useState(edit?.gst?.detail?.reg || "");
  const [gstAmount, setGstAmount] = useState(edit?.gst?.amount || "");
  const [shippingCost, setShippingCost] = useState(
    edit?.shopInfo?.shippingCost || 0
  );
  const [deliveryWithin, setDeliveryWithin] = useState(
    edit?.shopInfo?.deliveryWithin || ""
  );
  const [refundable, setRefundable] = useState(
    edit?.shopInfo?.refundable || null
  );
  const [terms, setTerms] = useState(edit?.shopInfo?.terms || []);
  const [name, setName] = useState(edit?.shopInfo?.paymentMethod?.name || "");
  const [bank, setBank] = useState(edit?.shopInfo?.paymentMethod?.bank || "");
  const [city_bank, setCity_bank] = useState(
    edit?.shopInfo?.paymentMethod?.city || ""
  );
  const [accountType, setAccountType] = useState(
    edit?.shopInfo?.paymentMethod?.accountType || ""
  );
  const [accountNumber, setAccountNumber] = useState(
    edit?.shopInfo?.paymentMethod?.accountNumber || ""
  );
  const [ifsc, setIfsc] = useState(edit?.shopInfo?.paymentMethod?.ifsc || "");
  const addUser = async () => {
    setLoading(true);
    const kycFileLinks = kycFiles.length
      ? await UploadFiles({ files: kycFiles, setMsg })
      : [];
    const gstFileLinks = gstFiles.length
      ? await UploadFiles({ files: gstFiles, setMsg })
      : [];
    fetch(edit ? "/api/editUser" : "/api/addUser", {
      method: edit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(edit && { _id: edit._id }),
        firstName,
        lastName,
        phone,
        email,
        ...(password && { password }),
        age,
        gender,
        "address.street": street,
        "address.city": city,
        "address.state": state,
        "address.country": country,
        "address.zip": zip,
        "kyc.verified": kycStatus,
        "kyc.files": kycFileLinks,
        "gst.verified": gstStatus,
        "gst.detail.files": gstFileLinks,
        "gst.detail.reg": gstReg,
        "gst.amount": gstAmount,
        "shopInfo.shippingCost": shippingCost,
        "shopInfo.deliveryWithin": deliveryWithin,
        "shopInfo.refundable": refundable,
        "shopInfo.terms": terms,
        "shopInfo.paymentMethod.name": name,
        "shopInfo.paymentMethod.bank": bank,
        "shopInfo.paymentMethod.city": city,
        "shopInfo.paymentMethod.accountType": accountType,
        "shopInfo.paymentMethod.accountNumber": accountNumber,
        "shopInfo.paymentMethod.ifsc": ifsc,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          onSuccess(data.user);
        } else if (data.code === 409) {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Email or Phone already exists.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get users.</h4>
            </div>
          </>
        );
      });
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          Confirm({
            label: edit ? "Edit User" : "Add User",
            question: edit
              ? "You sure want to save these changes for this user?"
              : "You sure want to add this user?",
            callback: addUser,
          });
        }}
      >
        <section className="break">
          <h3>User Information</h3>
          <hr />
        </section>
        <section>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            required={true}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </section>
        <section>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            required={true}
            onChange={(e) => setLastName(e.target.value)}
          />
        </section>
        <section>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={phone}
            required={true}
            onChange={(e) => setPhone(e.target.value)}
          />
        </section>
        <section>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>
        <section>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            autoComplete="new-password"
            required={!edit}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <section>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </section>
        <section>
          <label>Gender</label>
          <input
            type="text"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </section>
        <section className="break">
          <h3>Address</h3>
          <hr />
        </section>
        <section>
          <label>Street</label>
          <input
            type="text"
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </section>
        <section>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </section>
        <section>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </section>
        <section>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={country}
            onChange={(e) => setContry(e.target.value)}
          />
        </section>
        <section>
          <label>Zip</label>
          <input
            type="text"
            name="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </section>
        <section className="break">
          <h3>KYC</h3>
          <hr />
        </section>
        <section>
          <label>KYC Files</label>
          <FileInput
            multiple={true}
            prefill={kycFiles}
            onChange={(files) => setKycFiles(files)}
          />
        </section>
        <section>
          <label>Status</label>
          <Combobox
            defaultValue={kycStatus}
            options={[
              { label: "Verified", value: true },
              { label: "Unverified", value: false },
            ]}
            onChange={(e) => setKycStatus(e.value)}
          />
        </section>
        <section className="break">
          <h3>GST</h3>
          <hr />
        </section>
        <section>
          <label>GST Files</label>
          <FileInput
            multiple={true}
            prefill={gstFiles}
            onChange={(files) => setGstFiles(files)}
          />
        </section>
        <section>
          <label>GST Registration no.</label>
          <input
            type="text"
            name="zip"
            value={gstReg}
            onChange={(e) => setGstReg(e.target.value)}
          />
        </section>
        <section>
          <label>Status</label>
          <Combobox
            defaultValue={gstStatus}
            options={[
              { label: "Verified", value: true },
              { label: "Unverified", value: false },
            ]}
            onChange={(e) => setGstStatus(e.value)}
          />
        </section>
        <section>
          <label>GST Amount (%)</label>
          <input
            type="number"
            name="gst"
            value={gstAmount}
            onChange={(e) => setGstAmount(e.target.value)}
          />
        </section>
        <section className="break">
          <h3>Shop info</h3>
          <hr />
        </section>
        <section>
          <label>Shipping Cost ₹</label>
          <NumberInput
            required={true}
            defaultValue={shippingCost}
            name="shippingCost"
            onChange={(e) => setShippingCost(e.target.value)}
          />
        </section>
        <section>
          <label>Delivery Within (days)</label>
          <NumberInput
            required={true}
            defaultValue={deliveryWithin}
            name="deliveryWithin"
            min={1}
            step="0"
            placeholder="ie. 4 Days"
            onChange={(e) => setDeliveryWithin(e.target.value)}
          />
        </section>
        <section>
          <label>Refundable</label>
          <Combobox
            defaultValue={refundable}
            onChange={(e) => setRefundable(e.value)}
            options={[
              { label: "No", value: null },
              {
                label: "Upto 24 Hours After Delivery",
                value: "Upto 24 Hours After Delivery",
              },
              {
                label: "Upto 7 Days After Delivery",
                value: "Upto 7 Days After Delivery",
              },
              {
                label: "Upto 15 Days After Delivery",
                value: "Upto 15 Days After Delivery",
              },
            ]}
          />
        </section>
        <section className="break">
          <h3>Shop Payment Method</h3>
          <hr />
        </section>
        <section>
          <label>Full name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
          />
        </section>
        <section>
          <label>Bank</label>
          <input
            type="text"
            name="bank"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            required={true}
          />
        </section>
        <section>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={city_bank}
            onChange={(e) => setCity_bank(e.target.value)}
            required={true}
          />
        </section>
        <section>
          <label>Account type ie. Savings / Current</label>
          <input
            type="text"
            name="type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required={true}
          />
        </section>
        <section>
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required={true}
          />
        </section>
        <section>
          <label>IFSC</label>
          <input
            type="text"
            name="ifsc"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            required={true}
          />
        </section>
        <section className="btns">
          <button className="submit">Sumit</button>
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

export default Users;
