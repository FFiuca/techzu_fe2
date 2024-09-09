import App from "./app"
import { Container, Row, Col, ModalHeader } from "react-bootstrap"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import moment from "moment"
import axios from "axios"
import ApiConfig from "@/config/api"
import ModalEvent from "@/subpages/event/modal"
import ModalImport from "@/subpages/event/modal_import"

function renderEventContent(eventInfo) {
    console.log('eventInfo', eventInfo)
    return(
      <>
        <b>{eventInfo.timeText} </b> <i> {eventInfo.event.title}</i>
      </>
    )
  }

const _minuteInSecond = 60
const _hourInSecond = _minuteInSecond*60
const _dayInSecond = _hourInSecond*24

export default function Index(){
    const initData = {
        filter: {
            "date_start": moment().startOf('month').format('YYYY-MM-DD'),
            "date_end": moment().endOf('month').format('YYYY-MM-DD'),
        }
    }

    const [_id, _setId] = useState(null)
    const [dataCalendar, setDataCalendar] = useState([])
    const [dataEvent, setDataEvent] = useState([])
    const [event, setEvent] = useState({})
    const [loading, setLoading] = useState({})
    const [filter, setFilter] = useState(initData.filter)
    const [filterCalendar, setFilterCalendar] = useState([])

    const [modal, setModal] = useState(false)
    const toggleModal = ()=> setModal(e=> !e)
    const [type, setType] = useState('add')
    const toggleUpdate = ()=> setType('update')
    const toggleAdd = ()=> setType('add')

    const [modalImport, setModalImport] = useState(false)
    const toggleModalImport = ()=> setModalImport(e=> !e)

    const refUpcoming = useRef()

    //SECTION
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [eventDate, setEventDate] = useState(null)
    const [eventTime, setEventTime] = useState(null)
    const [location, setLocation] = useState(null)
    const [reminder, setReminder] = useState([])
    const [member, setMember] = useState([])
    const [formError, setFormError] = useState({})

    const resetForm = ()=>{
        setTitle(null)
        setDescription(null)
        setEventDate(null)
        setEventTime(null)
        setLocation(null)
        setReminder([])
        setMember([])
        setFormError({})
    }
    //SECTION END

    //SECTION
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const [errorFormUpload, setErrorFormUpload] = useState({})

    const resetFormUpload = ()=>{
        setFile(null)
        setErrorFormUpload({})
    }
    //SECTION - END

    const resetFilter = ()=>{
        setFilter(initData.filter)
    }
    const resetDataEvent = ()=> setDataEvent([])
    const resetDataCalendar = ()=> setDataCalendar([])
    const resetEvent = ()=> setEvent({})

    const handleUpcoming = ()=>{
        let d = {...filter}

        d.date_start = moment().format('YYYY-MM-DD')
        d.date_end = null
        console.log(d)
        setFilter(d)
    }

    const handleComplete = ()=>{
        let d = {...filter}

        d.date_end = moment().subtract(1, 'day').format('YYYY-MM-DD')
        d.date_start = null

        setFilter(d)
    }

    const handleType = (e)=>{
        const checked = e.target.checked
        const val = e.target.value

        console.log(checked, val)
        if(checked && val=='upcoming')
            handleUpcoming()
        else if(checked && val=='complete')
            handleComplete()

        // console.log(val)
    }

    const handleChangeMonth = async (e)=>{
        console.log(e)

        let d = {...filterCalendar}

        d.date_end = moment(e.end).format('YYYY-MM-DD')
        d.date_start = moment(e.start).format('YYYY-MM-DD')

        setFilterCalendar(d)
    }

    const fetchData = async ()=>{
        try{
            let url = ApiConfig.apiEntry +'/guest/event'
            const res = await axios.get(url, {
                params: filter
            })

            if (res.status!=200){
                throw new Error('fetch error')
            }

            setDataEvent(res.data.data)
        }catch(e){
            console.warn(e)
            resetDataEvent()
        }
    }

    const fetchDataCalendar = async ()=>{
        try{
            let url = ApiConfig.apiEntry +'/guest/event'
            const res = await axios.get(url, {
                params: filterCalendar
            })

            if (res.status!=200){
                throw new Error('fetch error')
            }
            let d = res.data.data

            d = d.map(e=> ({
                ...e,

                'date': e.event_date + (e.event_time!=null? ' '+e.event_time: '')
            }))
            setDataCalendar(d)
        }catch(e){
            resetDataCalendar()
            console.warn(e)
        }
    }

    const initEvent = ()=>{
        setTitle(event.title)
        setDescription(event.description)
        setLocation(event.location)
        setEventDate(event.event_date)
        setEventTime(event.event_time)
        setMember(event.event_member_external)

        let mEventDate = moment(event.event_date+ ' '+(event.event_time??''))
        setReminder(event.event_reminder.map(el=>{
            let mTimeBeforeObj = moment(mEventDate.format('YYYY-MM-DD HH:mm:ss')).subtract(el.time_before, 'second')
            let h = moment(mEventDate.format('YYYY-MM-DD HH:mm:ss')).diff(moment(mTimeBeforeObj.format('YYYY-MM-DD HH:mm:ss')), 'hours')
            let tempM = moment(mEventDate.format('YYYY-MM-DD HH:mm:ss')).subtract(h, 'hours')
            let m = moment(tempM.format('YYYY-MM-DD HH:mm:ss')).diff(moment(mTimeBeforeObj.format('YYYY-MM-DD HH:mm:ss')), 'minutes')

            return {
                time_before: el.time_before,
                h:h,
                m:m,
                time_before_obj: mTimeBeforeObj,
                time_diff: null,
                event_date:mEventDate,
            }
        }))
    }

    const fetchDetail = async (id)=>{
        try{
            let url = ApiConfig.apiEntry +'/guest/event/'+id
            const res = await axios.get(url)

            if (res.status!=200){
                throw new Error('fetch error')
            }

            setEvent(res.data.data)
        }catch(e){
            resetEvent()
            console.warn(e)
        }
    }

    //NOTE - should be in actions but just here now. PWA not yet
    const handleCreate = async ()=>{
        let res
        try{
            let url = ApiConfig.apiEntry +'/user/event'
            res = await axios.post(url, normalizeData())

            if (res.status!=200){
                throw new Error('add error')
            }

            fetchData()
            fetchDataCalendar()
            alert('success')

            toggleModal()
        }catch(e){
            if(e.status==400)
                setFormError(e.response.data.data)

            alert('failed')
            console.warn(e)
        }
    }

    const handleUpload = async ()=>{
        let res
        try{
            let url = ApiConfig.apiEntry +'/user/event/store-batch'

            const fD = new FormData()
            fD.append('file', file)

            res = await axios.post(url, fD, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            if (res.status!=200){
                throw new Error('add error')
            }

            fetchData()
            fetchDataCalendar()
            alert('success')

            toggleModalImport()
        }catch(e){
            if(e.status==400)
                setErrorFormUpload(e.response.data.data)

            alert('failed')
            console.warn(e)
        }
    }

    const handleUpdate = async (id)=>{
        let res
        try{
            let url = ApiConfig.apiEntry +'/user/event/'+_id
            res = await axios.put(url, normalizeData())

            if (res.status!=200){
                throw new Error('add error')
            }

            fetchData()
            fetchDataCalendar()
            alert('success')

            toggleModal()
        }catch(e){
            if(e.status==400)
                setFormError(e.response.data.data)

            alert('failed')
            console.warn(e)
        }
    }

    const handleDelete = async (id)=>{
        if(confirm('Delete?')==false)
            return

        try{
            let url = ApiConfig.apiEntry +'/user/event/'+id
            const res = await axios.delete(url)

            if (res.status!=200){
                throw new Error('fetch error')
            }

            fetchData()
            fetchDataCalendar()
        }catch(e){
            console.warn(e)
        }
    }

    const handleAddMember = ()=>{
        let d = [
            ...member,
            {
                email_external_member: null,
                status_member: 'external',
            }
        ]

        setMember(d)
    }

    const handleUpdateMember = (idx, val)=>{
        let d = [...member]
        d[idx].email_external_member = val

        setMember(d)
    }

    const handleDeleteMember = (idx)=>{
        let d = [...member]

        d.splice(idx,1)

        setMember(d)
    }

    const handleAddReminder = ()=>{
        let d = [
            ...reminder,
            {
                h: 0,
                m: 0,
                time_before: 0,
                time_before_obj: null,
                time_diff: null,
                event_date:null,
            }
        ]

        setReminder(d)
    }

    const handleUpdateReminder = (idx, type, val)=>{
        let d = [...reminder]

        if(type=='h')
            d[idx].h = val
        else if(type=='m')
            d[idx].m = val

        d[idx].event_date = moment(eventDate+' '+(eventTime!=null? eventTime+':00': '00:00:00'))
        d[idx].time_before_obj = moment(d[idx].event_date.format('YYYY-MM-DD HH:mm:ss')).subtract(d[idx].h, 'hours').subtract(d[idx].m, 'minutes');
        d[idx].time_before = d[idx].event_date.diff(d[idx].time_before_obj, 'second')
        setReminder(d)
    }

    const handleDeleteReminder = (idx)=>{
        let d = [...reminder]

        d.splice(idx,1)

        setReminder(d)
    }

    const normalizeData = ()=>{
        let d = {
            data: {
                title: title,
                description: description,
                event_date: eventDate,
                event_time: eventTime!=null? (eventTime.split(':').length==3? eventTime : eventTime+':00'): '00:00:00',
                location: location,
            },
            data_member : member.filter(el=> el.email_external_member!=null && el.email_external_member!=''),
            data_reminder: reminder.filter(el=> el.time_before!=null && el.time_before!=NaN).map(el=> ({
                time_before: el.time_before
            }))
        }

        return d
    }



    // init
    useEffect(()=>{
        refUpcoming.current.checked = true
    }, [])

    useEffect(()=>{
        if(Object.keys(event).length>0)
            initEvent()
    }, [event])

    useEffect(()=>{
        console.log(filter)

        fetchData()
    }, [filter])

    useEffect(()=>{
        fetchDataCalendar()
    }, [filterCalendar])

    useEffect(()=>{
        console.log('rem', reminder)
    }, [reminder])

    useEffect(()=>{
        console.log('err', formError)
    }, [formError])

    const handleDateClick = (arg) => {
        // alert(arg.dateStr)
        console.log(arg)
    }

    return <App>
        <Container>
            <Row>
                <Col md={9} className="mt-1 mb-3" style={{
                    // height:'100vH',
                    // overflowY:'auto',
                 }}>
                    <FullCalendar
                        plugins={[ dayGridPlugin, interactionPlugin ]}
                        initialView="dayGridMonth"
                        dateClick={handleDateClick}
                        eventContent={renderEventContent}
                        datesSet={handleChangeMonth}
                        events={dataCalendar}
                    />
                </Col>
                <Col md={3}>
                    <Row>
                        <Col md={12} className="mt-1 mb-3 d-flex justify-content-between">
                            <h4>Event Info</h4>
                            <div>
                                <Button onClick={()=>{
                                    toggleAdd()
                                    toggleModal()
                                    resetEvent()
                                }}>Create</Button>
                                <Button onClick={()=>{
                                    toggleModalImport()
                                }}>Import</Button>

                            </div>
                        </Col>
                        <hr />
                        <Col md={12}>
                            <Form>
                                <Form.Check
                                    inline
                                    label="Upcoming"
                                    name="content-type"
                                    type="radio"
                                    value="upcoming"
                                    id="radio-upcoming"
                                    onChange={handleType}
                                    ref={refUpcoming}
                                />
                                <Form.Check
                                    inline
                                    label="Complete"
                                    value="complete"
                                    name="content-type"
                                    type="radio"
                                    id="radio-complete"
                                    onChange={handleType}
                                />
                            </Form>
                        </Col>
                        <Col md={12} style={{
                            maxHeight:'100vH',
                            overflowY:'auto',
                         }}>
                            <Card>
                                <Card.Body>
                                    <ul style={{
                                        paddingLeft: '0.7rem',
                                     }}>
                                        {Array.isArray(dataEvent) && dataEvent.map((e, idx)=>{
                                            return (
                                                <li key={idx+'-data-event'}>
                                                    <div className="">
                                                        {e.title} @ <i>{e.event_date} {e.event_time}</i>
                                                        <br></br>
                                                        <div className="d-flex justify-content-end">
                                                            <Button variant="info" onClick={()=> {
                                                                resetForm()
                                                                toggleUpdate()
                                                                toggleModal()
                                                                fetchDetail(e.id)
                                                                _setId(e2=> e.id)
                                                            }}>Edit</Button>
                                                            <Button variant="danger" onClick={()=> handleDelete(e.id)}>Delete</Button>
                                                            {idx!=dataEvent.length-1 && <hr />}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>

        <ModalEvent
            modal={modal}
            handleClose={toggleModal}
            event={event}
            type={type}
            handleUpdate={handleUpdate}
            handleCreate={handleCreate}
            _id={_id}
            resetForm={resetForm}
            formError={formError}

            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventTime={eventTime}
            setEventTime={setEventTime}
            location={location}
            setLocation={setLocation}
            reminder={reminder}
            setReminder={setReminder}
            member={member}
            setMember={setMember}
            handleAddMember={handleAddMember}
            handleDeleteMember={handleDeleteMember}
            handleAddReminder={handleAddReminder}
            handleDeleteReminder={handleDeleteReminder}
            handleUpdateMember={handleUpdateMember}
            handleUpdateReminder={handleUpdateReminder}
        />

        <ModalImport
            modal={modalImport}
            handleClose={toggleModalImport}
            file={file}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            errorFormUpload={errorFormUpload}
            resetFormUpload={resetFormUpload}
        />
    </App>
}
