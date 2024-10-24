import React, { useContext, useEffect, useState } from "react"
import { CohortContext } from "./CohortProvider"
import { EditIcon } from "../../svgs/EditIcon"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { HumanDate } from "../utils/HumanDate"
import { CourseContext } from "../course/CourseProvider"
import { Toast } from "toaster-js"
import { AssessmentIcon } from "../../svgs/AssessmentIcon"
import { GridIcon } from "../../svgs/GridIcon"
import { CertificateIcon } from "../../svgs/CertificateIcon"
import slackLogo from "../teams/images/slack.png"
import "./Cohort.css"
import "./CohortList.css"


export const Cohort = ({ cohort, getRecentCohorts }) => {
    const [editSlack, setSlackEdit] = useState(0)
    const {
        getCohorts, cohorts, leaveCohort, getCohortInfo,
        joinCohort, updateCohort, activateCohort, setCohortDetails
    } = useContext(CohortContext)
    const { migrateCohortToServerSide } = useContext(CourseContext)

    const slackEditInput = (cohort) => {
        return <input type="text" autoFocus style={{ fontSize: "smaller" }} onKeyUp={e => {
            if (e.key === "Enter") {
                const updatedCohort = { ...cohort, slack_channel: e.target.value }
                updateCohort(updatedCohort).then(() => {
                    getRecentCohorts()
                    setSlackEdit(0)
                })
            }
            else if (e.key === "Escape") {
                setSlackEdit(0)
            }
        }} defaultValue={cohort.slack_channel} />
    }

    const slackDisplay = (cohort) => {
        return <>
            {cohort.slack_channel}
            <EditIcon tip="Set instructor channel Slack ID" clickFunction={() => setSlackEdit(cohort.id)} />
        </>
    }

    const leave = (cohort) => {
        leaveCohort(cohort.id)
            .then(getRecentCohorts)
            .then(() => {
                localStorage.removeItem("activeCohort")
                activateCohort(null)
            })
            .catch(reason => new Toast(reason, Toast.TYPE_ERROR, Toast.TIME_NORMAL))
    }

    const join = (cohort) => {
        joinCohort(cohort.id)
            .then(getRecentCohorts)
            .then(() => {
                localStorage.setItem("activeCohort", cohort.id)
                activateCohort(cohort.id)
            })
            .catch(reason => new Toast(reason, Toast.TYPE_ERROR, Toast.TIME_NORMAL))
    }

    return <section key={`cohort--${cohort.id}`} className={`cohort ${cohort.is_instructor === 1 ? "cohort--mine" : ""}`}>
        <h3 className="cohort__header fakeLink"
            onClick={() => {
                setCohortDetails(cohort)
                document.querySelector('.overlay--cohort').style.display = "block"
            }}>{cohort.name}</h3>
        <div className="cohort__join">
            {
                cohort.is_instructor === 1
                    ? <button onClick={() => leave(cohort)} className="fakeLink">Leave</button>
                    : <button onClick={() => join(cohort)} className="fakeLink">Join</button>
            }

        </div>
        <div className="cohort__dates">
            <HumanDate date={cohort.start_date} weekday={false} shortMonth={true} />
            <div style={{ width: "30%" }}>&nbsp;</div>
            <HumanDate date={cohort.end_date} weekday={false} shortMonth={true} />
        </div>

        <div className="cohort__links">
            <a href={cohort.student_organization_url} target="_blank">Github Org</a>
            <a href={cohort.attendance_sheet_url} target="_blank">Attendance</a>
        </div>

        <footer className="cohort__footer">
            <div>
                <PeopleIcon /> {cohort.students}
            </div>
            <div>
                {
                    editSlack === cohort.id
                        ? slackEditInput(cohort)
                        : slackDisplay(cohort)
                }
            </div>
        </footer>
    </section>
}
