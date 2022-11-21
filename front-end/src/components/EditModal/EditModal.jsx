import React from 'react'
import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Button} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useState } from 'react'
import * as Yup from "yup";
import {Formik, Form, Field} from 'formik';
import { FormControl, FormErrorMessage, Textarea} from '@chakra-ui/react'
import SMART_CONTRACT from '../../smartContract';

//use formik to control safe user input


function EditModal(props) {
  //function for the modal
    const {isOpen, onOpen} = useDisclosure()
    
  //save original value of the tweet before editing, to check 
    const [originalValue, setOriginalValue] = useState(props.tweetMessage)

    //variable for determing if the dit button should be loading or not
    let isEditing = false
  
    //reload the container if showModal has been changed
    useEffect( ()=>{
        onOpen()
    },[props.showModal])

    if(props.showModal)
    {
        return (
          <Modal isOpen={isOpen} onClose={() => props.closeModal()}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader marginLeft='150px'>Edit Tweet</ModalHeader>
              <ModalCloseButton />
              <ModalBody >
                <Formik
                  initialValues={{ body: props.tweetMessage }}
                  validationSchema={Yup.object({
                    body: Yup.string()
                      .min(5, "Minimum 5 characters")
                      .max(140, "Max 140 caracters")
                      .required("Obligatory Field"),
                  })}
                  onSubmit= { async (values, actions) => {
                    isEditing = true
                    if (values.body === originalValue)
                    {
                        alert("You haven't edited your message!")
                        isEditing = false
                        actions.setSubmitting(false)
                    }
                    else{
                        SMART_CONTRACT.methods.EditTweet(props.id, values.body)
                        .send({from: props.userAccount})
                        .then( (response) => {
                            isEditing = false;
                            props.populateTweets()
                            props.closeModal()
                        }).catch( (error) => {
                            console.log(`Error: ${error}`)
                        })
                    }
                  }}
                 
                >
            { (props) => {
                return(
                    <Form>
                    <Field name="body">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.body && form.touched.body}
                        >
                          <Textarea {...field} 
                          className="bodyInput" 
                          minHeight="15vh"  
                          />
                          <FormErrorMessage className="errorMessage">
                            {form.errors.body}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Button 
                    color='white'
                    bgColor='#0a8e33'
                    marginTop='15px'
                    marginLeft='145px'
                    marginBottom='15px'
                    type='submit'
                    isLoading={isEditing}
                    >Edit Tweet</Button>
                  </Form>
                )
            }}
                </Formik>
              </ModalBody>
              {/* <ModalFooter className="editButton">
                <Button>Edit Tweet</Button>
              </ModalFooter> */}
            </ModalContent>
          </Modal>
        );
    }
    else{
        return(<></>)
    }
 
}

export default EditModal