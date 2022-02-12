import * as React from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {DataGridPro, GridToolbar} from '@mui/x-data-grid-pro';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {styled} from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from "axios";
import {Backdrop, Fade, Grid, Modal, TextField} from "@mui/material";
import './style.css';
import {Link, useParams} from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    width: '100%',
    '& .MuiFormGroup-options': {
        alignItems: 'center',
        paddingBottom: theme.spacing(1),
        '& > div': {
            minWidth: 100,
            margin: theme.spacing(2),
            marginLeft: 0,
        },
    },
}));

const style = {
    position: 'absolute',
    top: '0',
    right:'0',
    width: 600,
    height:'100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function SettingsPanel(props) {
    const { onApply } = props;
    const [selectedPaginationValue, setSelectedPaginationValue] = React.useState(-1);

    const handlePaginationChange = React.useCallback((event) => {
        setSelectedPaginationValue(event.target.value);
    }, []);


    const handleApplyChanges = React.useCallback(() => {
        onApply({
            pagesize: selectedPaginationValue,
        });
    }, [selectedPaginationValue,onApply]);

    return (
        <FormGroup className="MuiFormGroup-options" row>
            <FormControl variant="standard">
                <InputLabel>Page Size</InputLabel>
                <Select value={selectedPaginationValue} onChange={handlePaginationChange}>
                    <MenuItem value={-1}>off</MenuItem>
                    <MenuItem value={0}>auto</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
            </FormControl>
            <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleApplyChanges}
            >
                <KeyboardArrowRightIcon fontSize="small" /> Apply
            </Button>
        </FormGroup>
    );
}

SettingsPanel.propTypes = {
    onApply: PropTypes.func.isRequired
};

export default function Crewmembers() {
    const {id}=useParams();
    const [crewmembers,setCrewmembers]=useState([]);
    const [count,setCount]=useState(1);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isEditing,setIsEditing]=useState(false);
    const [crewmember,setCrewmember]=useState({name:'',role:'',movieId:id});

    const handleModalOpen = () => {
        setIsModalOpened(true);
    };

    const handleInputChange = (e) => {
        setCrewmember({...crewmember, [e.target.name]:e.target.value});
    }

    const handleModalClose = () => {
        setIsModalOpened(false);
        setIsEditing(false);
    };

    const handleEditItem = (row) => {
        const item=(crewmembers.find(row2=>row2.id===row.id));
        setCrewmember({
            id:item.id,
            name:item.name,
            role:item.role,
            movieId: id
        })
        setIsEditing(true);
        handleModalOpen();
    }

    const handleDeleteItem = (row) => {
        const item=(crewmembers.find(row2=>row2.id===row.id));
        axios.delete(`http://localhost:8080/crewmember/${item.id}`)
            .then(() => {
                console.log('Deleted item!');
                setCount(count+1);

            })
            .catch((error) => {
                console.log('Error:',error);
                alert(error.response.data.message);

            })
    }

    const handleEdit = () => {
        axios.put(`http://localhost:8080/crewmember/${crewmember.id}`,crewmember)
            .then(() =>{
                setCount(count+1);

                handleModalClose();
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);

            })

    }

    const handleCrewmember = () => {
        axios.post('http://localhost:8080/crewmember',crewmember)
            .then(res => {
                setCount(count+1);
                handleModalClose()
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);
            })

    }

    const handleAddCrewmember = () => {
        setCrewmember({name:'',role:'',movieId: id});
        setIsEditing(false)
        handleModalOpen()
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/crewmember/${id}`)
            .then(res => {
                setCrewmembers(res.data);
                console.log('Movies:',res.data);
            })
    },[count])
    const columns=[
        {field:"id",hide:true},
        {field:"name",headerName:"Name",width:210},
        {field:"role",headerName:"Role",width:210},
        {field:"edit",headerName:"Edit", width: 210,
            renderCell: (params) => {
                return (
                    <Button variant="contained" sx={{mr:1}} onClick={()=> handleEditItem(params.row)}>Edit</Button>
                )
            }
        },
        {field:"delete",headerName:"Delete", width: 210,
            renderCell: (params) => {
                return (
                    <Button variant="contained" color="error" sx={{mr:1}} onClick={()=> handleDeleteItem(params.row)}>Delete</Button>
                )
            }
        }
    ]
    const [pagination, setPagination] = React.useState({
        pagination: false,
        autoPageSize: false,
        pageSize: undefined,
    });
    const handleApplyClick = (settings) => {

        const newPaginationSettings = {
            pagination: settings.pagesize !== -1,
            autoPageSize: settings.pagesize === 0,
            pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
        };

        setPagination((currentPaginationSettings) => {
            if (
                currentPaginationSettings.pagination === newPaginationSettings.pagination &&
                currentPaginationSettings.autoPageSize ===
                newPaginationSettings.autoPageSize &&
                currentPaginationSettings.pageSize === newPaginationSettings.pageSize
            ) {
                return currentPaginationSettings;
            }
            return newPaginationSettings;
        });
    };

    const DataGridComponent =  DataGridPro;
    return (
        <div className={"container"}>
            <h2 className={"title"}>Crewmembers</h2>
            <Button className={"btn"} variant={"outlined"} onClick={handleAddCrewmember}>Add Crewmember</Button>
            <div className={"datagrid-container"}>
                <StyledBox>

                    <SettingsPanel
                        onApply={handleApplyClick}
                    />
                    {crewmembers && (
                        <DataGridComponent
                            columns={columns}
                            rows={crewmembers}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            checkboxSelection
                            disableSelectionOnClick
                            rowThreshold={0}
                            {...pagination}
                        />
                    )}

                </StyledBox>
            </div>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isModalOpened}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isModalOpened}>
                    <Box sx={style}>
                        <div className="modal-header">Add Crewmember</div>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    name="name"
                                    value={crewmember.name}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="role"
                                    label="role"
                                    name="role"
                                    value={crewmember.role}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                            </Grid>

                            <Grid item xs={12} direction={"row"} justify={"center"} alignItems={"center"}>
                                {isEditing ? <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleEdit}
                                    >
                                        Edit crewmember
                                    </Button> :
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCrewmember}
                                    >
                                        Add crewmember
                                    </Button>}

                            </Grid>


                        </Grid>

                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
