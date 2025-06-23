import { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function Home() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [segmentedUrl, setSegmentedUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Fun 🎉");

  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSegmentedUrl("");
      setCaption("");
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/process-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setCaption(data.caption);
      setSegmentedUrl("http://localhost:5000" + data.segmented_image_url);
    } catch (error) {
      alert("Error processing image.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#0d1117",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main content grows and pushes footer down */}
      <Box sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Image Caption Generator
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Generate image to captions using AI free online.
          </Typography>

          {/* Upload Box */}
          <Box
            onClick={handleFileButtonClick}
            sx={{
              border: "2px dashed #58a6ff",
              borderRadius: 2,
              py: 6,
              textAlign: "center",
              cursor: "pointer",
              my: 4,
              bgcolor: "#161b22",
            }}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: "#58a6ff" }} />
            <Typography variant="body1" mt={1}>
              {image ? image.name : "Click to upload or drag and drop"}
            </Typography>
            <Typography variant="caption" color="gray">
              PNG, JPG, GIF, HEIC
            </Typography>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#f87171",
              color: "#fff",
              "&:hover": { backgroundColor: "#ef4444" },
            }}
            onClick={handleUpload}
            disabled={loading || !image}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Captions"
            )}
          </Button>

          {/* Preview Image */}
          {previewUrl && (
            <Card sx={{ mt: 5, bgcolor: "#161b22" }}>
              <CardMedia
                component="img"
                height="250"
                image={previewUrl}
                alt="Original"
              />
              <CardContent>
                <Typography variant="h6" color="#fff">
                  Original Image
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Segmented Image */}
          {segmentedUrl && (
            <Card sx={{ mt: 4, bgcolor: "#161b22" }}>
              <CardMedia
                component="img"
                height="250"
                image={segmentedUrl}
                alt="Segmented Output"
              />
              <CardContent>
                <Typography variant="h6" color="#fff">
                  Segmented Output
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Caption */}
          {caption && (
            <Box mt={4} p={2} bgcolor="#1f2937" borderRadius={2}>
              <Typography variant="h6" gutterBottom>
                Caption:
              </Typography>
              <Typography variant="body1">{caption}</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Sticky Footer */}
      <Box
        sx={{
          backgroundColor: "#161b22",
          color: "#8b949e",
          textAlign: "center",
          py: 3,
          borderTop: "1px solid #30363d",
        }}
      >
        <Typography variant="body2">
          © 2025 Zinio Team 18. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
