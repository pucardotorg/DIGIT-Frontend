import {
  CardLabel,
  CheckBox,
  DatePicker,
  Dropdown,
  LabelFieldPair,
  Loader,
  MultiSelectDropdown,
  RemoveableTag,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import cleanup from "../Utils/cleanup";
import { convertEpochToDate } from "../Utils/index";

const makeDefaultValues = (sessionFormData) => {
  return sessionFormData?.Assignments?.map((ele, index) => {
    return {
      key: index,
      fromDate: ele.fromDate ? convertEpochToDate(ele.fromDate) : null,
      toDate: ele.toDate ? convertEpochToDate(ele.toDate) : null,
      // isCurrentAssignment: ele?.isCurrentAssignment,
      designation: {
        code: ele?.designation,
        i18key: ele.designation ? "COMMON_MASTERS_DESIGNATION_" + ele.designation : null,
      },
      courtEstablishment: {
        code: ele?.courtEstablishment,
        i18key: ele.courtEstablishment ? "COMMON_MASTERS_COURT_ESTABLISHMENT_" + ele.courtEstablishment : null,
      },
      courtroom: {
        code: ele?.courtroom,
        i18key: ele.courtroom ? "COMMON_MASTERS_COURT_ROOM_" + ele.courtroom : null,
      },
      district: {
        code: ele?.district,
        i18key: ele.district ? "COMMON_MASTERS_DISTRICT_" + ele.district : null,
      },
      roles: ele?.roles || [],
    };
  });
};

const Assignments = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: data = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  // const [currentassignemtDate, setCurrentAssiginmentDate] = useState(null);

  const employeeCreateSession = Digit.Hooks.useSessionStorage("NEW_EMPLOYEE_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = employeeCreateSession;
  const isEdit = window.location.href.includes("hrms/edit");

  const [assignments, setassignments] = useState(
    !isEdit && sessionFormData?.Assignments
      ? makeDefaultValues(sessionFormData)
      : formData?.Assignments || [
          {
            key: 1,
            fromDate: undefined,
            toDate: undefined,
            // isCurrentAssignment: false,
            courtEstablishment: null,
            designation: null,
            district: null,
            courtroom: null,
            roles: [],
          },
        ]
  );

  useEffect(() => {
    console.log("checking");
    
    // setassignments(
    //   makeDefaultValues(sessionFormData) ||
    //     formData?.Assignments || [
    //       {
    //         key: 1,
    //         fromDate: undefined,
    //         toDate: undefined,
    //         // isCurrentAssignment: false,
    //         courtEstablishment: null,
    //         designation: null,
    //         district: null,
    //         courtroom: null,
    //         roles: [],
    //       },
    //     ]
    // );
  }, [sessionFormData]);

  // console.log(assignments, sessionFormData, "assignments");
  const reviseIndexKeys = () => {
    setassignments((prev) => prev.map((unit, index) => ({ ...unit, key: index })));
  };

  const handleAddUnit = () => {
    setassignments((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        fromDate: undefined,
        toDate: undefined,
        // isCurrentAssignment: false,
        courtEstablishment: null,
        district: null,
        designation: null,
        courtroom: null,
        roles: [],
      },
    ]);
  };

  const handleRemoveUnit = (unit) => {
    setassignments((prev) => prev.filter((el) => el.key !== unit.key));
    if (FormData.errors?.Assignments?.type == unit.key) {
      clearErrors("Jurisdictions");
    }
    reviseIndexKeys();
  };

  useEffect(() => {
    var promises = assignments?.map((assignment) => {
      let res = assignment
        ? cleanup({
            id: assignment?.id,
            position: assignment?.position,
            govtOrderNumber: assignment?.govtOrderNumber,
            tenantid: assignment?.tenantid,
            auditDetails: assignment?.auditDetails,
            fromDate: assignment?.fromDate ? new Date(assignment?.fromDate).getTime() : undefined,
            toDate: assignment?.toDate ? new Date(assignment?.toDate).getTime() : undefined,
            // isCurrentAssignment: true,
            courtEstablishment: assignment?.courtEstablishment?.code,
            district: assignment?.district?.code,
            designation: assignment?.designation?.code,
            courtroom: assignment?.courtroom?.code,
          })
        : [];
      if (assignment?.roles) {
        res["roles"] = assignment?.roles.map((ele) => {
          delete ele.description;
          return ele;
        });
      }
      return res;
    });

    Promise.all(promises).then(function (results) {
      onSelect(
        config.key,
        results.filter((value) => Object.keys(value).length !== 0)
      );
    });

    // assignments.map((ele) => {
    //   if (ele.isCurrentAssignment) {
    //     setCurrentAssiginmentDate(ele.fromDate);
    //   }
    // });
  }, [assignments]);

  let courtEstablishment = [];
  let designation = [];
  let courtroom = [];
  let district = [];
  const [focusIndex, setFocusIndex] = useState(-1);

  function getCourtEstablishment() {
    return data?.MdmsRes?.["common-masters"]?.CourtEstablishment?.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_COURT_ESTABLISHMENT_" + ele.code);
      return ele;
    }).sort((a, b) => {
      const keyA = a?.i18key || "";
      const keyB = b?.i18key || "";
      return keyA.localeCompare(keyB);
    });
  }
  function getDistrict() {
    return data?.MdmsRes?.["common-masters"]?.District?.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_DISTRICT_" + ele.code);
      return ele;
    }).sort((a, b) => {
      const keyA = a?.i18key || "";
      const keyB = b?.i18key || "";
      return keyA.localeCompare(keyB);
    });
  }

  function getdesignationdata() {
    return data?.MdmsRes?.["common-masters"]?.Designation.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_DESIGNATION_" + ele.code);
      return ele;
    }).sort((a, b) => {
      const keyA = a?.i18key || "";
      const keyB = b?.i18key || "";
      return keyA.localeCompare(keyB);
    });
  }
  function getcourtroomdata() {
    return data?.MdmsRes?.["common-masters"]?.Court_Rooms.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_COURT_R00M_" + ele.code);
      return ele;
    }).sort((a, b) => {
      const keyA = a?.i18key || "";
      const keyB = b?.i18key || "";
      return keyA.localeCompare(keyB);
    });
  }
  function getroledata() {
    return data?.MdmsRes?.["ACCESSCONTROL-ROLES"].roles
      .map((role) => {
        return { code: role.code, name: role?.name ? role?.name : " ", labelKey: "ACCESSCONTROL_ROLES_ROLES_" + role.code };
      })
      .sort((a, b) => {
        const labelKeyA = t(a?.labelKey) || "";
        const labelKeyB = t(b?.labelKey) || "";
        return labelKeyA.localeCompare(labelKeyB);
      });
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {assignments?.map((assignment, index) => (
        <Assignment
          t={t}
          key={assignment.key}
          keys={index.key}
          formData={formData}
          assignment={assignment}
          setassignments={setassignments}
          index={index}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          getCourtEstablishment={getCourtEstablishment}
          getDistrict={getDistrict}
          courtEstablishment={courtEstablishment}
          designation={designation}
          courtroom={courtroom}
          getdesignationdata={getdesignationdata}
          getcourtroomdata={getcourtroomdata}
          assignments={assignments}
          handleRemoveUnit={handleRemoveUnit}
          // setCurrentAssiginmentDate={setCurrentAssiginmentDate}
          // currentassignemtDate={currentassignemtDate}
          getroledata={getroledata}
        />
      ))}
      <label onClick={handleAddUnit} className="link-label" style={{ width: "12rem" }}>
        {t("HR_ADD_ASSIGNMENT")}
      </label>
    </div>
  );
};
function Assignment({
  t,
  assignment,
  assignments,
  setassignments,
  index,
  focusIndex,
  setFocusIndex,
  getCourtEstablishment,
  getDistrict,
  courtEstablishment,
  formData,
  handleRemoveUnit,
  designation,
  district,
  courtroom,
  getdesignationdata,
  getcourtroomdata,
  // setCurrentAssiginmentDate,
  // currentassignemtDate,
  getroledata,
  roleoption,
}) {
  const selectCourtEstablishment = (value) => {
    if (!value) return;

    // Find the corresponding district
    const districtData = getDistrict();
    const correspondingDistrict = districtData?.find((dist) => dist.code === value.district);

    // Clear courtroom if it doesn't belong to the selected establishment
    const currentCourtroom = assignment?.courtroom;
    const newCourtroom = currentCourtroom?.establishment === value.code ? currentCourtroom : null;

    setassignments((pre) =>
      pre.map((item) =>
        item.key === assignment.key
          ? {
              ...item,
              courtEstablishment: value,
              district: correspondingDistrict,
              courtroom: newCourtroom,
            }
          : item
      )
    );
  };

  const selectDesignation = (value) => {
    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, designation: value } : item)));
  };
  const selectCourtroom = (value) => {
    if (!value) return;

    // Find the corresponding court establishment for the selected courtroom
    const courtEstablishmentData = getCourtEstablishment();
    console.log(courtEstablishmentData, "courtEstablishmentData");

    const correspondingEstablishment = courtEstablishmentData?.find((est) => est.code === value.establishment);

    if (!correspondingEstablishment) return;

    // Find the district for the court establishment
    const districtData = getDistrict();
    const correspondingDistrict = districtData?.find((dist) => dist.code === correspondingEstablishment.district);

    // Update all related fields
    setassignments((pre) =>
      pre.map((item) =>
        item.key === assignment.key
          ? {
              ...item,
              courtroom: value,
              courtEstablishment: correspondingEstablishment,
              district: correspondingDistrict,
            }
          : item
      )
    );
  };

  const selectDistrict = (value) => {
    if (!value) return;

    // Clear court establishment and courtroom if they don't belong to the selected district
    const currentEstablishment = assignment?.courtEstablishment;
    const newEstablishment = currentEstablishment?.district === value.code ? currentEstablishment : null;

    const currentCourtroom = assignment?.courtroom;
    const newCourtroom = currentCourtroom && newEstablishment?.code === currentCourtroom.establishment ? currentCourtroom : null;

    setassignments((pre) =>
      pre.map((item) =>
        item.key === assignment.key
          ? {
              ...item,
              district: value,
              courtEstablishment: newEstablishment,
              courtroom: newCourtroom,
            }
          : item
      )
    );
  };

  const selectrole = (e, data) => {
    let res = [];
    e &&
      e?.map((ob) => {
        res.push(ob?.[1]);
      });

    res?.forEach((resData) => {
      resData.labelKey = "ACCESSCONTROL_ROLES_ROLES_" + resData.code;
    });

    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, roles: res } : item)));
  };
  const onRemove = (index, key) => {
    let afterRemove = assignment?.roles.filter((value, i) => {
      return i !== index;
    });
    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, roles: afterRemove } : item)));
  };
  const getFilteredCourtEstablishments = () => {
    const selectedDistrict = assignment?.district;
    const courtEstablishmentData = getCourtEstablishment();
    console.log(selectedDistrict, courtEstablishmentData, "selectedDistrict, courtEstablishmentData");

    if (!selectedDistrict) return courtEstablishmentData;
    return courtEstablishmentData?.filter((ele) => ele.district === selectedDistrict.code);
  };

  const getFilteredCourtrooms = () => {
    const selectedEstablishment = assignment?.courtEstablishment;
    const selectedDistrict = assignment?.district;
    const courtroomData = getcourtroomdata();

    if (!courtroomData) return [];

    if (selectedEstablishment) {
      return courtroomData.filter((room) => room.establishment === selectedEstablishment.code);
    }

    if (selectedDistrict) {
      const validEstablishments = getCourtEstablishment()?.filter((est) => est.district === selectedDistrict.code);
      return courtroomData.filter((room) => validEstablishments.some((est) => est.code === room.establishment));
    }

    return courtroomData;
  };

  // const onAssignmentChange = (value) => {
  //   setassignments((pre) =>
  //     pre.map((item) => (item.key === assignment.key ? { ...item, isCurrentAssignment: value } : { ...item, isCurrentAssignment: false }))
  //   );
  //   if (value) {
  //     setassignments((pre) =>
  //       pre.map((item) =>
  //         item.key === assignment.key
  //           ? {
  //               ...item,
  //               toDate: null,
  //             }
  //           : item
  //       )
  //     );
  //     assignments.map((ele) => {
  //       if (ele.key == assignment.key) {
  //         setCurrentAssiginmentDate(ele.fromDate);
  //       }
  //     });
  //   } else {
  //     setCurrentAssiginmentDate(null);
  //   }
  // };
  const onIsHODchange = (value) => {
    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, isHOD: value } : item)));
  };

  const ValidateDatePickers = (value) => {
    assignments;
  };
  const currentDate = new Date();
  const tommorowDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

  return (
    <div key={index + 1} style={{ marginBottom: "16px" }}>
      <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
        <LabelFieldPair>
          <div className="label-field-pair" style={{ width: "100%" }}>
            <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
              {t("HR_ASSIGNMENT")} {index + 1}
            </h2>
          </div>
          {assignments.length > 1 && !assignment?.id && !assignment?.isCurrentAssignment ? (
            <div onClick={() => handleRemoveUnit(assignment)} style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>
              X
            </div>
          ) : null}
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}> {`${t("HR_ASMT_FROM_DATE_LABEL")} * `} </CardLabel>
          <div className="field">
            <DatePicker
              type="date"
              name="fromDate"
              max={convertEpochToDate(new Date())}
              // min={formData?.SelectDateofEmployment?.dateOfAppointment}
              disabled={assignment?.id ? true : false}
              onChange={(e) => {
                setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, fromDate: e } : item)));
                setFocusIndex(index);
              }}
              date={assignment?.fromDate}
              autoFocus={focusIndex === index}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className={assignment?.isCurrentAssignment ? "card-label-smaller" : "card-label-smaller"}>
            {t("HR_ASMT_TO_DATE_LABEL")}
            {assignment?.isCurrentAssignment ? "" : " * "}{" "}
          </CardLabel>
          <div className="field">
            <DatePicker
              type="date"
              name="toDate"
              min={convertEpochToDate(tommorowDate)}
              onChange={(e) => {
                setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, toDate: e } : item)));
                setFocusIndex(index);
              }}
              date={assignment?.toDate}
              autoFocus={focusIndex === index}
            />
          </div>
        </LabelFieldPair>

        {/* <LabelFieldPair>
          <CardLabel className="card-label-smaller" style={{ color: "white" }}>
            .
          </CardLabel>
          <div className="field">
            <CheckBox
              onChange={(e) => onAssignmentChange(e.target.checked)}
              checked={assignment?.isCurrentAssignment}
              label={t("HR_CURRENTLY_ASSIGNED_HERE_SWITCH_LABEL")}
            />
          </div>
        </LabelFieldPair> */}
        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}> {`${t("HR_DISTRICT")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={assignment?.district}
            disable={assignment?.id ? true : false}
            optionKey={"i18key"}
            option={getDistrict() || []}
            select={selectDistrict}
            optionCardStyles={{ maxHeight: "300px" }}
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}> {`${t("HR_COURT_ESTABLISHMENT")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={assignment?.courtEstablishment}
            disable={assignment?.id ? true : false}
            optionKey={"i18key"}
            option={getFilteredCourtEstablishments() || []}
            select={selectCourtEstablishment}
            optionCardStyles={{ maxHeight: "300px" }}
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}>{`${t("HR_COURTRROOM_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={assignment?.courtroom}
            disable={assignment?.id ? true : false}
            option={getFilteredCourtrooms() || []}
            select={selectCourtroom}
            optionCardStyles={{ maxHeight: "250px" }}
            optionKey={"i18key"}
            t={t}
          />
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}>{`${t("HR_DESG_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={assignment?.designation}
            disable={assignment?.id ? true : false}
            option={getdesignationdata(designation) || []}
            select={selectDesignation}
            optionCardStyles={{ maxHeight: "250px" }}
            optionKey={"i18key"}
            t={t}
          />
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("HR_COMMON_TABLE_COL_ROLE")} *</CardLabel>
          <div className="form-field">
            <MultiSelectDropdown
              className="form-field"
              isMandatory={true}
              defaultUnit="Selected"
              selected={assignment?.roles || []}
              options={getroledata()}
              onSelect={selectrole}
              optionsKey="labelKey"
              t={t}
            />
            <div className="tag-container">
              {assignment?.roles.length > 0 &&
                assignment?.roles.map((value, index) => {
                  return <RemoveableTag key={index} text={`${t(value["labelKey"]).slice(0, 22)} ...`} onClick={() => onRemove(index, value)} />;
                })}
            </div>
          </div>
        </LabelFieldPair>
      </div>
    </div>
  );
}

export default Assignments;
