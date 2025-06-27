import React from "react"

export const CapstoneRow = ({ capstone }) => {
    let statusClass = ""

    return <div className="capstoneassessments">
        <div className="capstoneassessment">
            <div className="capstoneassessment__course">
                <a href={capstone.proposal} target="_blank">{capstone.course}</a>
            </div>
            <div className="capstoneassessment__statuses">
                {
                    capstone.statuses.length > 0
                        ? capstone.statuses.map(status => {
                            switch (status.status__status) {
                                case "Approved":
                                    statusClass = "assessment--inProgress"
                                    break
                                case "In Review":
                                    statusClass = "assessment--readyForReview"
                                    break
                                case "MVP":
                                    statusClass = "assessment--reviewedSuccess"
                                    break
                                case "Requires Changes":
                                    statusClass = "assessment--reviewedFail"
                                    break
                            }

                            return <div key={`status--${status.status__status}`} className={`capstoneassessment__status ${statusClass}`}>
                                {status.status__status} on {new Date(status.date).toLocaleDateString()}
                            </div>
                        })
                        : <div key={`status--submitted`} className={`capstoneassessment__status assessment--submitted`}>
                            Submitted
                        </div>
                }
            </div>
        </div>
    </div>
}
