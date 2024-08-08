import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axiosInstance from "../../auth/axiosInstance"

const DeleteResource = ({ open, courseId, onClose }) => {
  const handleClose = () => {
    onClose(false);
  };
 const id = 1;

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/courses/${id}`);
      alert('Resource deleted successfully');
      handleClose();
      // You may want to refresh the page or update the UI to reflect the deletion
    } catch (error) {
      console.error('Error deleting resource', error);
      alert('Failed to delete resource');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6">Delete Resource</Typography>
        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
          <IoMdCloseCircleOutline size={30} color="red" />
        </IconButton>
      </DialogTitle>
      <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
        Are you sure you want to delete this resource?
      </Typography>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">No</Button>
        <Button onClick={handleDelete} variant="contained" color="warning">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteResource;
