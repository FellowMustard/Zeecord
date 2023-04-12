import { useEffect, useState } from "react";

function DateTimePicker({ handleDOB }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [monthDays, setMonthDays] = useState([]);

  const dateMonth = [
    {
      month: "January",
      days: 31,
    },
    {
      month: "February",
      days: 28,
    },
    {
      month: "March",
      days: 31,
    },
    {
      month: "April",
      days: 30,
    },
    {
      month: "May",
      days: 31,
    },
    {
      month: "June",
      days: 30,
    },
    {
      month: "July",
      days: 31,
    },
    {
      month: "August",
      days: 31,
    },
    {
      month: "September",
      days: 30,
    },
    {
      month: "October",
      days: 31,
    },
    {
      month: "November",
      days: 30,
    },
    {
      month: "December",
      days: 31,
    },
  ];
  const currentYear = new Date().getFullYear();
  const yearList = Array.from(Array(100).keys()).map(
    (num) => currentYear - num
  );
  let days = [];

  useEffect(() => {
    if (month !== "") {
      let numDays = dateMonth.find((m) => m.month === month).days;
      if (
        month === "February" &&
        year !== "" &&
        year % 4 === 0 &&
        (year % 100 !== 0 || year % 400 === 0)
      ) {
        numDays = 29;
        setDay("");
      }

      setMonthDays(Array.from(Array(numDays).keys()).map((num) => num + 1));
    }
  }, [month, year]);

  useEffect(() => {
    if (day === "" || month === "" || year === "") {
      handleDOB(false);
      return;
    }
    const date = new Date(
      Date.UTC(
        year,
        dateMonth.findIndex((m) => m.month === month),
        day
      )
    );

    handleDOB(date);
  }, [day, month, year]);

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };
  return (
    <div className="dob-column">
      <select
        className="cred-input dark select"
        value={month}
        onChange={handleMonthChange}
      >
        <option value="" disabled defaultValue="" hidden>
          Month
        </option>
        {dateMonth.map((month) => (
          <option key={month.month} value={month.month}>
            {month.month}
          </option>
        ))}
      </select>

      <select
        className="cred-input dark select"
        value={day}
        onChange={handleDayChange}
      >
        <option value="" disabled defaultValue="" hidden>
          Day
        </option>
        {monthDays
          .map((num) => num)
          .map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
      </select>

      <select
        className="cred-input dark select"
        value={year}
        onChange={handleYearChange}
      >
        <option value="" disabled defaultValue="" hidden>
          Year
        </option>
        {yearList.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DateTimePicker;
