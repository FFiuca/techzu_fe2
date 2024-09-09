import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import  Form  from 'react-bootstrap/Form';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import { getErrorMessage } from '@/helpers/error_helper';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';

export default function ModalEvent({
    modal,
    handleClose,
    event,
    type,
    handleUpdate,
    handleCreate,
    _id,
    resetForm,
    formError,

    title,
    setTitle,
    description,
    setDescription,
    eventDate,
    setEventDate,
    eventTime,
    setEventTime,
    location,
    setLocation,
    reminder,
    setReminder,
    member,
    setMember,

    handleAddMember,
    handleDeleteMember,
    handleAddReminder,
    handleDeleteReminder,
    handleUpdateMember,
    handleUpdateReminder,
}){
    // console.log('ttt', eventDate, eventTime)

    const [value, onChange] = useState();

    return (
        <Modal show={modal} size="lg"  onHide={()=> {
            handleClose()
            resetForm()
        }}>
            <Modal.Header closeButton>
                <Modal.Title>{type=='add'? 'Add':"Change"} Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" placeholder="" value={title} onChange={(e)=> setTitle(e.target.value)}/>
                                    <small className='text-danger'>{getErrorMessage(formError, 'title')}</small>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={description} onChange={e=> setDescription(e.target.value)}/>
                                </Form.Group>

                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" placeholder="" value={eventDate} onChange={e=> setEventDate(e.target.value)}/>
                                    <small className='text-danger'>{getErrorMessage(formError, 'event_date')}</small>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control type="time" placeholder="" value={eventTime} onChange={e=> setEventTime(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" placeholder="" value={location} onChange={e=> setLocation(e.target.value)}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                Member
                            </Col>
                            <Col md={12}>
                                {
                                    Array.isArray(member) && member.map((el, idx)=>{
                                        return (
                                            <Row key={'member-'+idx} className=''>
                                                <Col md={9}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Control type="email" placeholder="email@gmai.com" value={el.email_external_member} onChange={(e)=> handleUpdateMember(idx, e.target.value)}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Button variant='danger' onClick={()=> handleDeleteMember(idx)}>Delete</Button>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                            <Col md={12}>
                                <Button onClick={handleAddMember}>Add</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                Reminder
                            </Col>
                            <Col md={12}>
                                {
                                    Array.isArray(reminder) && reminder.map((el, idx)=>{
                                        return (
                                            <Row key={'rem'+idx} className=''>
                                                <Col md={3}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>How many hours before?</Form.Label>
                                                        <Form.Control type='number' min={0} value={el.h} onChange={e=> handleUpdateReminder(idx, 'h', e.target.value)}></Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>How many minutes before?</Form.Label>
                                                        <Form.Control type='number' min={0} value={el.m} onChange={e=> handleUpdateReminder(idx, 'm', e.target.value)}></Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3} className='d-flex align-items-center'>
                                                    result at {eventDate==null && 'NaN'} {eventDate!=null && moment(eventDate+' '+(eventTime!=null? eventTime+':00': '00:00:00')).subtract(el?.h?? 0, 'hours').subtract(el?.m?? 0, 'minutes').format('YYYY-MM-DD HH:mm')}
                                                </Col>
                                                <Col md={3} className='d-flex align-items-center'>
                                                    <Button variant='danger' onClick={()=> handleDeleteReminder(idx)}>Delete</Button>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                            <Col md={12}>
                                <Button onClick={handleAddReminder} disabled={eventDate==null}>Add</Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {
                    type=='add' && <Button variant="primary" onClick={()=>{
                        handleCreate()
                    }}> Save </Button>
                }
                {
                    type=='update' && <Button variant="primary" onClick={()=>{
                        handleUpdate(_id)
                    }}> Update </Button>
                }

            </Modal.Footer>
        </Modal>
    )

}
