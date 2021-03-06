import React, { Component, Fragment, useState, useEffect} from "react";
import SignIn from "../UserProfile/LogIn";
import { Avatar, Divider, Toolbar, TextareaAutosize, Grid, Button, Typography } from "@material-ui/core";
import Navbar from "../../NavBar/Navbar";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import AssignmentIcon from "@material-ui/icons/Assignment";
import List from "@material-ui/core/List";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as Constants from '../../utils';


const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 130,
    left: 300,
    width: 1400,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  divider: {
    width: "85%",
    height: 3,
    marginTop: 15,
    marginBottom: 20,
  },
  profilePic: {
    width: 200,
    marginTop: 20,
    borderRadius: 5,
  },
  info: {
    marginTop: 3,
    marginLeft: 15,
    maxWidth: 1100,
  },
  category: {
    fontSize: 22,
    fontWeight: 700,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  btn: {
    backgroundColor: "#fcb040",
    color: "#ffffff",
    width: 180,
    "&:hover": { background: "#e69113" },
    marginLeft: 10,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    display: "none",
  },
  pageTitle: {
    marginLeft: 10,
    marginRight: 712,
    marginTop: 40,
    display: "inline",
  },
  uploadButton: {
    //marginLeft: 800,
    backgroundColor: "#fcb040",
    color: "#ffffff",
    "&:hover": { background: "#e69113" },
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: "10px",
    width: 200,
  },
  assignmentHeader: {
    
    fontSize: 22,
  },
  noAssignmentHeader: {
    fontSize: 22,
  },
  assignmentCard: {
    width: 1200,
  },
  cardBody: {
    marginBottom: 25,
    color: "#5f6368",
    fontSize: "12px",
    fontWeight: 400
  }, 
  cardDesc: {
    fontSize: "13px",
    fontWeight: 400,
    marginBottom: 35
  },
  upload: {
    flexBasis: "23.33%",
    color: "#5f6368",
    fontSize: "12px",
    fontWeight: 400,
    marginTop: 8,
  }, 
  textArea: {
    marginTop: 10,
    marginBottom: 10
  },
  viewSubmissionsBtn: {
    backgroundColor: "#fcb040",
    color: "#ffffff",
    width: 180,
    "&:hover": { background: "#e69113" },
    borderRadius: 20,
    marginRight: 30,
    marginBottom: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
}));

const RedTextTypography = withStyles({
  root: {
    color: "#e43132",
  },
})(Typography);




function getCurrentDateTime(){

  var currentdate = new Date(); 
  var datetime = [currentdate.getFullYear(), (currentdate.getMonth()+1), currentdate.getDate(), 
                  currentdate.getHours(),currentdate.getMinutes(), currentdate.getSeconds()];
  for (let i = 0; i < datetime.length; i++) {
    if (datetime[i] >= 0 && datetime[i] < 10 ) {
      datetime[i] = ('0' + datetime[i]) as any ;
    }
  }

  datetime = (datetime[0] + "-" 
          + datetime[1] + "-"
          + datetime[2] + "T"
          + datetime[3] + ":"  
          + datetime[4] + ":" 
          + datetime[5]) as any;

  return datetime;
  
}


function parseDeadline(deadline: string) {
    let datetime = new Date(deadline).toString().split(' ', 5);
    let time = new Date(deadline).toLocaleTimeString('en-US');
    datetime[4] = time;
    
    let datetimeString = "";
    for (let i = 0; i < datetime.length; i++) {
      datetimeString += datetime[i] + " ";
    }
    return datetimeString;
}

function ViewSubmissions(props: any) {
  const classes = useStyles();
  return <Button variant="contained" className={classes.viewSubmissionsBtn} onClick={props.openHandler} >View Submissions</Button>
}



function AssignmentPage(prop: any) {
  
  
  var currentdate = getCurrentDateTime() as any;
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [totalMarks, setTotalMarks] = React.useState(0);
  const [deadline, setDeadline] = React.useState(currentdate);
  const [assignmentItems, setAssignmentItems] = React.useState([]); // array of objects
  const [alertMessage, setAlertMessage] = React.useState("");

  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlertMessage("");
  };

  const handleUploadedFile = (e: any) => {
    setFile(e.target.files[0]);
  };
  const handleAlert = (e: string) => {
    setAlertMessage(e);
  };
  const handleSubmit = async (e: any) => {
    const formData = new FormData();
    formData.append("assignments", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("totalMarks", totalMarks as any);
    formData.append("deadline", deadline);

    const response = await fetch(Constants.server + "/api/course/upload/assignment/teacher/", {
      method: "POST",
      body: formData,
      credentials: 'include',
      mode: "cors",

    });

    if (response.status > 300 || response.status < 200) {
      handleAlert("Failed to upload");
    }
    handleAlert("Successfully Uploaded");
    handleClose();
    handleGet();
  };

  const parseItem = (e: any) => {
    var filePath = e.file_path;
    return filePath.substring(filePath.indexOf('_')+1,filePath.length)
  };

  const handleGet = async () => {
    const response = await fetch(
      Constants.server + "/api/course/getAssignments",
      {
        method: "GET",
        credentials: 'include',
        mode: "cors",
      }
    );
    const responseData = await response.json();
    if (response.status > 300 || response.status < 200) {
      throw responseData;
    }
    
    setAssignmentItems(responseData);
  };

  

    const renderAssignments = (item: any) => {  // item is an object containing assignment data
    // call event handler in main and set state to the current assignment
    return(
      <Accordion className={classes.assignmentCard}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <AssignmentOutlinedIcon style={{marginTop: 2, marginRight: 8}} /> 
          <Typography variant="h6" style={{flexBasis: "73.33%"}} >{item.title}</Typography>
          <Typography className={classes.upload} style={{marginLeft: 600}} >Due: {parseDeadline(item.deadline)}</Typography>
        </AccordionSummary>
        
        <AccordionDetails style={{flexDirection: "column"}} >
          <div style={{flexBasis: "33.33%"}}>
          <Typography variant="body2" className={classes.cardBody} style={{marginBottom: 14}}>
              Posted: {item.upload_date.substring(0,10)}
            </Typography>
          </div>

          <div style={{flexBasis: "33.33%"}}>
            <Typography variant="body2" className={classes.cardDesc}>
            {item.description}
            </Typography>
          </div>
          <Divider style={{marginBottom: "20px"}}/>
          <Grid container direction="row" justify="space-between"> 

            <Grid item>
                <Grid container direction="column"> 
                    <Grid item>   
                        <Typography variant="body2" style={{marginBottom: 10}}>
                            Download File
                        </Typography>
                    </Grid>

                    <Grid item>
                        <a href={Constants.awsServer + item.file_path }  target='_blank' download>
                            <Typography variant="body2" >
                                {parseItem(item)}
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item> 
              <Button variant="contained" className={classes.viewSubmissionsBtn} onClick={prop.openHandler} >View Submissions</Button>
            </Grid>

            
              {/* {renderButtons(index)} */}
            
        </Grid>
        </AccordionDetails>
      </Accordion>
      
    
    ); 




  }

  

  useEffect(() => {
    handleGet();
  }, []);


  return (
    <div>
      {handleGet}
      <Navbar></Navbar>
      <Grid container className={classes.root}>
        <Grid item xs={12} container spacing={2}>
          
          <Grid>

            <Typography variant="h4" className={classes.pageTitle}>
              Your Assignments
            </Typography>
           
            
              <Button
                variant="contained"
                onClick={handleClickOpen}
                className={classes.uploadButton}
              >
                Upload Assignment
              </Button>
              
              
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogContent>
                  <DialogContentText>
                    Please fill in the following fields
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    name="title"
                    label="Title"
                    type="text"
                    fullWidth
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextField
                    
                    margin="dense"
                    id="totalMarks"
                    name="totalMarks"
                    label="Total Marks"
                    type="number"
                    variant="standard"
                    defaultValue={0}
                    inputProps={{min: "0"}}
                    style={{marginRight: 40, marginTop: 11, width: 100}}
                    onChange={(e) => {
                      setTotalMarks((e.target as any).value);
                      }
                    }
                  />
                 
                 
                  <TextField
                    style={{marginTop: 10, marginBottom: 10}}
                    id="datetime-local"
                    label="Deadline"
                    type="datetime-local"
                    defaultValue={currentdate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setDeadline((e.target as any).value);
                      }
                    }
                  />

                   <TextField
                   label="Description"
                   variant="outlined"
                   fullWidth
                   multiline
                   className={classes.textArea}
                   rows={2}
                   rowsMax={4}
                   onChange={(e) => setDescription(e.target.value)}
                 />
                </DialogContent>

                <DialogContent>
                  <TextField
                    type={"file"}
                    name="assignments"
                    id="assignments"
                    inputProps={{ accept: "application/pdf,.doc,.docx,.txt" }}
                    onChange={handleUploadedFile}
                  ></TextField>
                </DialogContent>
                <DialogContent>
                  {alertMessage.length > 0 ? (
                    <RedTextTypography>{alertMessage}</RedTextTypography>
                  ) : null}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleSubmit} color="primary">
                    Submit
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
        <List component="nav" aria-labelledby="assignmentList">
          {assignmentItems.length > 0 ?  assignmentItems.map((item) => (
      renderAssignments(item)
    )) : ( 
            <Typography align="center" className={classes.noAssignmentHeader}>
              There are currently no assignments!
            </Typography>
          )}
        </List>
      </Grid>
    </div>

    
  );
}

export default AssignmentPage;

