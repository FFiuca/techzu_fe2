import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import  Form  from 'react-bootstrap/Form';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import ApiConfig from '@/config/api';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import { getErrorMessage } from '@/helpers/error_helper';

export default function ModalImport({
    modal,
    handleClose,

    file,
    handleFileChange,
    handleUpload,
    errorFormUpload,
    resetFormUpload,
}){
    const handleDownload = ()=>{
        window.open(ApiConfig.host+'/template/template-event.xlsx', '_self')
    }

    return (
        <Modal show={modal} size="lg"  onHide={()=> {
            handleClose()
            resetFormUpload()
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Upload Template</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Button onClick={handleDownload}>Download Template</Button>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Upload Template</Form.Label>
                                    <Form.Control type="file" accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' onChange={(e) => handleFileChange(e)}/>
                                    <small className='text-danger'>{getErrorMessage(errorFormUpload, 'file')}</small>
                                </Form.Group>

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>{
                    handleUpload()
                }}> Upload </Button>
            </Modal.Footer>
        </Modal>
    )

}
