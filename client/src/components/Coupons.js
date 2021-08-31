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
  InputDateRange,
  NumberInput,
  Media,
  Actions,
  Moment,
  moment,
} from "./Elements";
import { Modal, Confirm } from "./Modal";
import TextareaAutosize from "react-textarea-autosize";

function Coupons({ history, location, pathname }) {
  const [msg, setMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [sort, setSort] = useState({ column: "createdAt", order: "dsc" });
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [edit, setEdit] = useState(null);
  const [couponForm, setCouponForm] = useState(false);
  useEffect(() => {
    fetch(
      `/api/coupons?${new URLSearchParams({
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
          setCoupons(data.coupons);
          setTotal(data.total || 0);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not get Coupons.</h4>
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
              <h4>Could not get coupons. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [page, perPage, sort.column, sort.order, search]);
  useEffect(() => {
    if (!couponForm) {
      setEdit(null);
    }
  }, [couponForm]);
  return (
    <div className="table couponContainer">
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
            placeholder="Search Code"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
        </section>
        <section className="add">
          <button onClick={() => setCouponForm(true)}>
            <Plus_svg />
            Add Coupon
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
            <th>Offer</th>
            <th>Code</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Max</th>
            <th>Threshold</th>
            <th>Status</th>
            <th>Used</th>
            <th>Validity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((item) => (
            <tr key={item._id}>
              <td>
                <Moment format="DD MMM, YYYY">{item.createdAt}</Moment>
              </td>
              <td className="thumbs">
                {item.image && <Media links={[item.image]} />}
              </td>
              <td>{item.title}</td>
              <td>{item.code}</td>
              <td>{item.type}</td>
              <td>{item.amount}</td>
              <td>{item.maxDiscount}</td>
              <td>{item.threshold}</td>
              <td>{item.status}</td>
              <td>{item.users?.length}</td>
              <td>
                <Moment format="DD MMM YY">{item.date?.from}</Moment>-
                <Moment format="DD MMM YY">{item.date?.to}</Moment>
              </td>
              <td>
                <Actions>
                  <button
                    onClick={() => {
                      setEdit(item);
                      setCouponForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      Confirm({
                        label: "Delete Coupon",
                        question: "You sure want to delete this coupon?",
                        callback: () => {
                          fetch("/api/deleteCoupon", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ _id: item._id }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.code === "ok") {
                                setCoupons((prev) =>
                                  prev.filter((noti) => noti._id !== item._id)
                                );
                                setMsg(
                                  <>
                                    <button onClick={() => setMsg(null)}>
                                      Okay
                                    </button>
                                    <div>
                                      <Succ_svg />
                                      <h4>Coupon has been deleted.</h4>
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
                                        Could not delete coupon. Try again.
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
                                      Could not delete coupon. Make sure you're
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
          {coupons.length === 0 && (
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
        label="Add/Edit Coupon"
        open={couponForm}
        setOpen={setCouponForm}
        className="formModal couponForm"
      >
        <CouponForm
          edit={edit}
          onSuccess={(newCoupon) => {
            setCouponForm(false);
            setCoupons((prev) => [
              newCoupon,
              ...prev.filter((item) => item._id !== newCoupon._id),
            ]);
          }}
        />
      </Modal>
    </div>
  );
}

const CouponForm = ({ edit, onSuccess }) => {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState(edit?.image ? [edit.image] : []);
  const [title, setTitle] = useState(edit?.title || "");
  const [dscr, setDscr] = useState(edit?.dscr || "");
  const [code, setCode] = useState(edit?.code || "");
  const [type, setType] = useState(edit?.type || "");
  const [amount, setAmount] = useState(edit?.amount || "");
  const [maxDiscount, setMaxDiscount] = useState(edit?.maxDiscount || "");
  const [threshold, setThreshold] = useState(edit?.threshold || "");
  const [validPerUser, setValidPerUser] = useState(edit?.validPerUser || 1);
  const [date, setDate] = useState({
    from: edit?.date?.from || new Date(),
    to: edit?.date?.to || new Date(),
  });
  const [status, setStatus] = useState(edit?.status || "draft");
  const [terms, setTerms] = useState(edit?.terms || []);
  const [termsUrl, setTermsUrl] = useState(edit?.termsUrl || "");
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const imgLink = (await UploadFiles({ files: thumb, setMsg }))?.[0] || null;
    if (thumb.length && !imgLink.length) {
      return;
      setMsg(
        <>
          <button onClick={() => setMsg(null)}>Okay</button>
          <div>
            <Err_svg />
            <h4>Could not upload image. Please try again.</h4>
          </div>
        </>
      );
    }
    fetch(edit ? "/api/editCoupon" : "/api/addCoupon", {
      method: edit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(edit && { _id: edit._id }),
        image: imgLink,
        title,
        dscr,
        code,
        type,
        amount,
        maxDiscount,
        threshold,
        validPerUser,
        date: {
          from: moment({
            time: date.from,
            format: "YYYY-MM-DD",
          }),
          to: moment({
            time: date.to,
            format: "YYYY-MM-DD",
          }),
        },
        status,
        ...(termsUrl ? { termsUrl } : { terms }),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          onSuccess?.(data.coupon);
        } else if (data.code === 409) {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Coupon code already exists. Enter a different code.</h4>
              </div>
            </>
          );
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not add Coupon.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not add Coupon. Make sure you're online.</h4>
            </div>
          </>
        );
        console.log(err);
      });
  };
  return (
    <>
      <form onSubmit={submit}>
        <section>
          <label>Offer Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>
        <section className="files">
          <label>Image</label>
          <FileInput prefill={thumb} onChange={(file) => setThumb(file)} />
        </section>
        <section className="code">
          <label>Code</label>
          <input
            type="text"
            required={true}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </section>
        <section className="dscr">
          <label>Offer Description</label>
          <TextareaAutosize
            type="text"
            value={dscr}
            onChange={(e) => setDscr(e.target.value)}
          />
        </section>
        <section>
          <label>Discount Type</label>
          <Combobox
            options={[
              { label: "Percent", value: "percent" },
              { label: "Flat", value: "flat" },
            ]}
            required={true}
            defaultValue={type}
            onChange={(e) => setType(e.value)}
          />
        </section>
        <section>
          <label>
            Amount {type === "percent" && "%"}
            {type === "flat" && "₹"}
          </label>
          <NumberInput
            required={true}
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </section>
        <section>
          <label>Max Discount ₹</label>
          <NumberInput
            required={true}
            defaultValue={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
          />
        </section>
        <section>
          <label>Threshold ₹</label>
          <NumberInput
            required={true}
            defaultValue={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </section>
        <section>
          <label>Valid Per user</label>
          <NumberInput
            required={true}
            step="0"
            defaultValue={validPerUser}
            onChange={(e) => setValidPerUser(e.target.value)}
          />
        </section>
        <section className="_date">
          <label>Validity</label>
          <InputDateRange
            dateRange={{
              startDate: new Date(date.from),
              endDate: new Date(date.to),
            }}
            required={true}
            value={threshold}
            onChange={(dateRange) =>
              setDate({
                from: dateRange?.startDate,
                to: dateRange?.endDate,
              })
            }
          />
        </section>
        <section>
          <label>Status</label>
          <Combobox
            options={[
              { label: "Draft", value: "draft" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            required={true}
            defaultValue={status}
            onChange={(e) => setStatus(e.value)}
          />
        </section>
        <section className="termsUrl">
          <label>Terms URL</label>
          <input
            type="text"
            value={termsUrl}
            onChange={(e) => setTermsUrl(e.target.value)}
          />
        </section>
        <section className={`terms ${termsUrl ? "disabled" : ""}`}>
          <label>Terms</label>
          <ul>
            {terms.map((term, i) => (
              <li key={i}>
                {term}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTerms((prev) => prev.filter((item) => item !== term));
                  }}
                >
                  <X_svg />
                </button>
              </li>
            ))}
            {terms.length === 0 && (
              <li className="placeholder">No terms added.</li>
            )}
          </ul>
          <div className="termForm">
            <TextareaAutosize />
            <button
              type="button"
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                const term = `${input.value}`;
                if (term) {
                  setTerms((prev) => [
                    ...prev.filter((item) => item !== term),
                    term,
                  ]);
                }
                input.value = "";
                input.focus();
              }}
            >
              Add Term
            </button>
          </div>
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

export default Coupons;
