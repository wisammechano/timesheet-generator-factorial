import React, { useEffect, useState } from "react";
import Select from "react-select";

import { MRound, strToObj } from "../utils";

const emptyAlloc = [
  {
    project: "",
    allocation: -1,
  },
];

const Form = ({
  projects: savedProjects,
  allocations: savedAllocations,
  onSubmit,
}) => {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    if (savedAllocations.length === 0) {
      setAllocations(emptyAlloc);
    } else {
      setAllocations(savedAllocations);
    }
  }, [savedAllocations]);

  const isOverAlloc =
    allocations.reduce((a, v) => a + Math.max(0, v.allocation), 0) > 100;

  const addAllocation = (project = "", allocation = -1) => {
    if (allocations.length >= 5) return;
    setAllocations([...allocations, { project, allocation }]);
  };

  const removeAllocation = (index) => {
    // we can remove by project name or index
    // since sometimes project names are empty strings
    const filterFn = (alloc, i) => !(alloc.project === index || i === index);

    setAllocations((prev) => {
      const next = prev.filter(filterFn);
      if (next.length === 0) {
        return emptyAlloc;
      }
      return next;
    });
  };

  const editAllocation = (index, val) => {
    setAllocations((prev) => {
      const newAllocations = [...prev];
      newAllocations[index] = { ...newAllocations[index], ...val };
      return newAllocations;
    });
  };

  const onSubmitInternal = (e) => {
    e.preventDefault();

    const finalAllocations = allocations
      .filter(
        (alloc) => alloc.project.trim().length > 0 && alloc.allocation >= 0
      )
      .map((alloc) => {
        alloc.project = alloc.project.trim();
        return alloc;
      });

    onSubmit({ allocations: finalAllocations });
  };

  return (
    <form
      className="flex flex-col gap-5 justify-around my-3 w-full px-2"
      onSubmit={onSubmitInternal}
    >
      <div className="grid grid-cols-12 gap-1">
        {/* Projects Col */}
        <div className="col-span-9 flex flex-col gap-1">
          <h3 className="my-2">Projects</h3>
          {allocations.map(({ project }, index) => (
            <Select
              isSearchable
              isOptionDisabled={(proj) =>
                proj.value !== project &&
                allocations.find((alloc) => alloc.project === proj.value)
              }
              key={project + index}
              placeholder="Pick a project"
              onChange={(proj) =>
                editAllocation(index, { project: proj.value })
              }
              value={project && strToObj(project)}
              options={savedProjects.map(strToObj)}
            />
          ))}
        </div>

        {/* Allocations Col */}
        <div className="col-span-2 flex flex-col gap-1">
          <h3 className="my-2">Allocations</h3>
          {allocations.map(({ allocation }, index) => (
            <Range
              key={index}
              value={allocation}
              min={0}
              max={100}
              onChange={(val) => editAllocation(index, { allocation: val })}
              formName={`project${index}Alloc`}
            />
          ))}
        </div>

        {/* Actions Col */}
        <div className="col-span-1 flex flex-col gap-1">
          <h3 className="my-2 text-white">Actions</h3>
          {allocations.map(({ project }, index) => (
            <button
              key={index}
              type="button"
              onClick={() => removeAllocation(project || index)}
              className="mx-auto block h-full"
            >
              <svg
                className="hover:fill-gray-500 fill-gray-300 stroke-transparent stroke-[2px] w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M 9.81818,10.125002 V 16.875 c 0,0.109375 -0.034067,0.199217 -0.1022733,0.269528 -0.06818,0.07032 -0.1553,0.105469 -0.26136,0.105469 H 8.7272733 c -0.10606,0 -0.19318,-0.03514 -0.2613666,-0.105469 C 8.3977267,17.074217 8.3636333,16.984375 8.3636333,16.875 v -6.749998 c 0,-0.109375 0.034067,-0.199224 0.1022734,-0.269534 0.068187,-0.070311 0.1553066,-0.1054702 0.2613666,-0.1054702 h 0.7272734 c 0.10606,0 0.19318,0.035135 0.26136,0.1054702 0.068187,0.07031 0.1022733,0.160159 0.1022733,0.269534 z m 2.909093,0 V 16.875 c 0,0.109375 -0.03407,0.199217 -0.102273,0.269528 -0.06818,0.07032 -0.1553,0.105469 -0.261367,0.105469 h -0.727266 c -0.106067,0 -0.193187,-0.03514 -0.261367,-0.105469 -0.06818,-0.07031 -0.102273,-0.160153 -0.102273,-0.269528 v -6.749998 c 0,-0.109375 0.03407,-0.199224 0.102273,-0.269534 0.06818,-0.070311 0.1553,-0.1054702 0.261367,-0.1054702 h 0.727266 c 0.106067,0 0.193187,0.035135 0.261367,0.1054702 0.06818,0.07031 0.102273,0.160159 0.102273,0.269534 z m 2.909094,0 V 16.875 c 0,0.109375 -0.03407,0.199217 -0.102274,0.269528 -0.06819,0.07032 -0.155306,0.105469 -0.261366,0.105469 h -0.727274 c -0.10606,0 -0.19318,-0.03514 -0.26136,-0.105469 C 14.215903,17.074217 14.18182,16.984375 14.18182,16.875 v -6.749998 c 0,-0.109375 0.03407,-0.199224 0.102273,-0.269534 0.06818,-0.070311 0.1553,-0.1054702 0.26136,-0.1054702 h 0.727274 c 0.10606,0 0.19318,0.035135 0.261366,0.1054702 0.06818,0.07031 0.102274,0.160159 0.102274,0.269534 z m 1.45454,8.484375 V 7.4999964 H 6.9090933 V 18.609377 c 0,0.171874 0.026533,0.330075 0.07954,0.474608 0.053067,0.144527 0.10796,0.249996 0.1647734,0.316402 0.0568,0.06641 0.096593,0.09961 0.11932,0.09961 h 9.4545463 c 0.02273,0 0.06247,-0.03321 0.11932,-0.09961 0.0568,-0.06641 0.11174,-0.171875 0.164774,-0.316402 0.053,-0.144533 0.07954,-0.302734 0.07954,-0.474608 z M 9.4545467,6.0000022 H 14.545453 L 14,4.6289074 C 13.94693,4.5585968 13.882573,4.5156211 13.80682,4.5000012 h -3.602273 c -0.07576,0.015606 -0.140154,0.058575 -0.19318,0.1289062 z M 20,6.3749991 v 0.7500005 c 0,0.1093744 -0.03407,0.1992169 -0.102273,0.2695344 -0.06818,0.070311 -0.1553,0.1054624 -0.26136,0.1054624 H 18.545453 V 18.609377 c 0,0.648436 -0.178026,1.208982 -0.534086,1.681639 C 17.655307,20.763672 17.227273,21 16.727273,21 H 7.2727267 C 6.7727267,21 6.3447,20.771481 5.9886333,20.314452 5.6325733,19.857423 5.4545467,19.304687 5.4545467,18.65625 V 7.4999964 H 4.3636333 c -0.10606,0 -0.19318,-0.035131 -0.26136,-0.1054624 C 4.0340933,7.3242165 4,7.234374 4,7.1249996 V 6.3749991 C 4,6.2656247 4.034067,6.1757823 4.1022733,6.1054716 c 0.06818,-0.070318 0.1553,-0.1054694 0.26136,-0.1054694 H 7.875 L 8.6704533,4.0429718 C 8.7840933,3.7539056 8.9886333,3.507815 9.2840933,3.3046862 9.5795467,3.1015644 9.8787867,3 10.18182,3 h 3.63636 c 0.303033,0 0.602273,0.1015647 0.897727,0.3046862 0.29546,0.2031288 0.5,0.4492194 0.61364,0.7382856 L 16.125,6.0000022 h 3.511367 c 0.10606,0 0.19318,0.035132 0.26136,0.1054694 C 19.965907,6.1757823 20,6.2656247 20,6.3749991 Z"
                />
              </svg>
            </button>
          ))}
        </div>

        <div className="col-span-3 my-3">
          <button
            type="button"
            className="text-factorial p-1 rounded border-2 border-solid border-factorial cursor-pointer w-full"
            onClick={() => addAllocation()}
          >
            Add Allocation
          </button>
        </div>
        <div className="col-span-6 text-right my-3 self-center">
          <p className={`${isOverAlloc ? "text-factorial" : "text-gray-500"}`}>
            Allocations Total
          </p>
        </div>
        <div className="col-span-3 px-1 my-3 self-center">
          <p className={`${isOverAlloc ? "text-factorial" : "text-gray-500"}`}>
            <strong>
              {allocations
                .reduce((a, v) => a + Math.max(0, v.allocation), 0)
                .toFixed(2)}
              %
            </strong>
          </p>
        </div>
      </div>
      <button
        type="submit"
        className="text-white p-1 rounded border-2 border-solid border-factorial bg-factorial cursor-pointer"
      >
        Generate Timesheet
      </button>
    </form>
  );
};

export const Label = ({ label, children, className = "", ...props }) => (
  <label
    className={`gap-2 h-8 leading-8 flex items-center ${className}`}
    {...props}
  >
    <span className="flex-shrink-0">{label}</span>
    <div className="flex-grow">{children}</div>
  </label>
);

const Range = ({
  formName,
  value,
  min = 0,
  max = 100,
  precision = 2,
  onChange,
  ...props
}) => {
  const [_valueNum, setValueNum] = useState(value);
  const [_valueStr, setValueStr] = useState(value.toFixed(precision));

  useEffect(() => {
    setValueStr(value < 0 ? "" : value.toFixed(precision));
  }, [value, precision]);

  const onChangeInternal = (e) => {
    const v = e.target.value.trim();
    const n = parseFloat(v.slice[-1] === "." ? v + "0" : v);
    const regex = new RegExp(`^[\\d]{1,3}(\\.{1}[\\d]{0,${precision}})?$`);

    if (regex.test(v) || v === "") {
      // debugger;
      if (isNaN(n)) {
        setValueNum(-1);
        setValueStr("");
      } else {
        if (n > max) {
          setValueNum(max);
          setValueStr(max.toFixed(precision));
        } else if (n < min) {
          setValueNum(min);
          setValueStr(min.toFixed(precision));
        } else {
          setValueNum(n);
          setValueStr(v);
        }
      }
    }
  };

  const renderedValue = _valueStr;

  return (
    <div className="flex items-center text-center w-14 h-full">
      <input
        className="py-1 px-1 max-w-full border border-solid border-gray-300 rounded-l border-r-0 h-full bg-white outline-none inline-block"
        type="text"
        min={min}
        max={max}
        autoComplete="false"
        placeholder=""
        value={renderedValue}
        onChange={onChangeInternal}
        onBlur={() => onChange?.(MRound(_valueNum, 0.01))}
        name={formName}
        {...props}
      />
      <div className="border rounded-r border-l-0 border-gray-300 h-full p-1 bg-white flex items-center">
        <span>%</span>
      </div>
    </div>
  );
};

export default Form;
