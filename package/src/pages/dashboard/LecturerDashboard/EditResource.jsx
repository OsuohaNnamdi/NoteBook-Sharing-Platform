import React, { useState } from 'react';
import { Dialog, DialogTitle, TextField, Button, IconButton, Typography, Box } from '@mui/material';
import { LuPaperclip } from 'react-icons/lu';
import { FiTrash } from 'react-icons/fi';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axiosInstance from '../../auth/axiosInstance'; // Import your Axios instance

const EditResource = ({ open, onClose, courseId }) => {
  const [fileError, setFileError] = useState("");
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseCode: "",
    videoLink: "",
    file: null,
  });

  const reset = () => {
    setFormData({
      courseTitle: "",
      courseCode: "",
      videoLink: "",
      file: null,
    });
  };

  const handleClose = () => {
    reset();
    onClose(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileInputChange = (e) => {
    setFileError("");
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
      if (!allowedExtensions.includes(fileExtension)) {
        setFileError("Invalid file type. Please select an image (.jpg, .jpeg, .png) or a pdf file.");
        return;
      }
      setFormData((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleFileDelete = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const handleSave = async () => {
    const { courseTitle, courseCode, videoLink, file } = formData;
    const formDataToSend = new FormData();
    formDataToSend.append('courseTitle', courseTitle);
    formDataToSend.append('courseCode', courseCode);
    formDataToSend.append('videoLink', videoLink);
    if (file) formDataToSend.append('document', file);

    try {
      await axiosInstance.put(`/courses/${courseId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Resource updated successfully');
      handleClose();
      // You may want to refresh the page or update the UI to reflect the update
    } catch (error) {
      console.error('Error updating resource', error);
      alert('Failed to update resource');
    }
  };

  if (!open) return null;
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">Update Resource</Typography>
        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
          <IoMdCloseCircleOutline size={30} color="red" />
        </IconButton>
      </DialogTitle>
      <Box sx={{ p: 3 }}>
        <TextField
          name="courseTitle"
          label="Course Title"
          placeholder="Add title"
          fullWidth
          margin="normal"
          value={formData.courseTitle}
          onChange={handleInputChange}
        />
        <TextField
          name="courseCode"
          label="Course Code"
          placeholder="CSC 203"
          fullWidth
          margin="normal"
          value={formData.courseCode}
          onChange={handleInputChange}
        />
        <TextField
          name="videoLink"
          label="Video Link"
          placeholder="Add video link (optional)"
          fullWidth
          margin="normal"
          value={formData.videoLink}
          onChange={handleInputChange}
        />
        <Box
          sx={{ 
            border: '1px dotted', 
            borderRadius: 2, 
            padding: 2, 
            textAlign: 'center', 
            bgcolor: '#f5f5f5' 
          }}
          onDrop={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: '#d1eaff' }}>
            <LuPaperclip size={20} />
            {formData.file ? "Change file" : "Upload file"}
          </label>
          {formData.file && (
            <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ p: 1 }}>{formData.file.name}</Typography>
              <IconButton onClick={handleFileDelete} sx={{ ml: 1 }}>
                <FiTrash color="red" />
              </IconButton>
            </Box>
          )}
          {fileError && <Typography color="error">{fileError}</Typography>}
        </Box>
      </Box>
      <Button onClick={handleSave} variant="contained" color="primary" sx={{ m: 3 }}>
        Save
      </Button>
    </Dialog>
  );
};

export default EditResource;
