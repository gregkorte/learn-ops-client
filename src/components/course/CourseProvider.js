import React, { useCallback, useEffect, useState } from "react"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const CourseContext = React.createContext()

export const CourseProvider = (props) => {
    const [courses, setCourses] = useState([])
    const [objectives, setObjectives] = useState([])
    const [activeCourse, setActiveCourse] = useState({})
    const [capstoneSeason, setCapstoneSeason] = useState([])

    useEffect(() => {
        const seasonObject = JSON.parse(localStorage.getItem("capstoneSeason"))
        if (seasonObject) {
            setCapstoneSeason(seasonObject)
        }
    }, [])


    useEffect(() => {
        if (activeCourse && "id" in activeCourse) {
            localStorage.setItem("activeCourse", activeCourse.id)
        }
    }, [activeCourse])

    const getCourses = useCallback(
        (cohortId = null) => fetchIt(`${Settings.apiHost}/courses${cohortId ? `?cohortId=${cohortId}` : ""}`)
            .then((data) => {
                setCourses(data)

                if (localStorage.getItem("activeCourse")) {
                    const course = data.find(c => c.id === parseInt(localStorage.getItem("activeCourse")))
                    setActiveCourse(course)
                }

                return data
            }),
        [setCourses, setActiveCourse]
    )

    const getActiveCourse = useCallback(
        (cohortId) => fetchIt(`${Settings.apiHost}/courses?cohortId=${cohortId}&active=true`)
            .then(courseArray => {
                setActiveCourse(courseArray[0])
                return courseArray[0]
            })
        ,
        []
    )

    const getCourse = id => fetchIt(`${Settings.apiHost}/courses/${id}`)

    const createCourse = course => {
        return fetchIt(`${Settings.apiHost}/courses`, { method: "POST", body: JSON.stringify(course) })
    }

    const editCourse = useCallback(
        course => fetchIt(`${Settings.apiHost}/courses/${course.id}`, {
            method: "PUT",
            body: JSON.stringify(course)
        }), []
    )

    const deactivateCourse = useCallback(
        courseId => fetchIt(`${Settings.apiHost}/courses/${courseId}`, { method: "DELETE" }),
        []
    )

    const getBooks = useCallback((courseId = null) => {
        const ordering = "?orderBy=course&orderBy=index"
        return fetchIt(`${Settings.apiHost}/books${ordering}${courseId ? `&courseId=${courseId}` : ""}`)
    }, [])

    const getBook = useCallback((bookId) => fetchIt(`${Settings.apiHost}/books/${bookId}`), [])

    const deleteBook = useCallback(
        id => fetchIt(`${Settings.apiHost}/books/${id}`, { method: "DELETE" }),
        []
    )

    const getProjects = useCallback(
        () => fetchIt(`${Settings.apiHost}/projects?expand=course&expand=book`),
        []
    )

    const getBookProjects = useCallback(
        (bookId) => fetchIt(`${Settings.apiHost}/projects?bookId=${bookId}`),
        []
    )

    const getProject = useCallback(
        (id) => fetchIt(`${Settings.apiHost}/projects/${id}?&expand=book&expand=course`),
        []
    )

    const deleteProject = useCallback(
        id => fetchIt(`${Settings.apiHost}/projects/${id}`, { method: "DELETE" }),
        []
    )

    const editBook = useCallback(
        book => fetchIt(`${Settings.apiHost}/books/${book.id}`, {
            method: "PUT",
            body: JSON.stringify(book)
        }), []
    )

    const migrateCohortToServerSide = useCallback(
        cohortId => fetchIt(`${Settings.apiHost}/cohorts/${cohortId}/migrate`, {
            method: "PUT"
        }), []
    )

    const getLearningObjectives = useCallback(
        (id) => fetchIt(`${Settings.apiHost}/weights`).then(setObjectives),
        [setObjectives]
    )

    return (
        <CourseContext.Provider value={{
            getCourses, courses, activeCourse, setActiveCourse,
            getCourse, getLearningObjectives, objectives, getBooks,
            getProjects, deleteProject, getActiveCourse, getProject,
            migrateCohortToServerSide, getBook, editBook,
            deleteBook, createCourse, editCourse, getBookProjects,
            deactivateCourse, capstoneSeason, setCapstoneSeason
        }} >
            {props.children}
        </CourseContext.Provider>
    )
}
